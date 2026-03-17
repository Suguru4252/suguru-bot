// ========== КЛИКЕР ==========
function handleClick() {
    const earned = BASE_CLICK_POWER * (gameState.level || 1);
    gameState.balance = (gameState.balance || 0) + earned;
    gameState.totalClicks = (gameState.totalClicks || 0) + 1;
    gameState.totalEarned = (gameState.totalEarned || 0) + earned;
    
    gameState.exp = (gameState.exp || 0) + earned / 100;
    const expNeeded = (gameState.level || 1) * 1500;
    while (gameState.exp >= expNeeded && (gameState.level || 1) < MAX_PLAYER_LEVEL) {
        gameState.exp -= expNeeded;
        gameState.level = (gameState.level || 1) + 1;
        gameState.diamonds = (gameState.diamonds || 0) + 5;
    }
    
    if (gameState.battlePass && gameState.battlePass.level < 200) {
        gameState.battlePass.exp += 100;
        checkBattlePassLevel();
    }
    
    playClickSound();
    if (settings.effectsEnabled) {
        createFloatingEffect(event?.clientX || 200, event?.clientY || 200, `+${formatNumber(earned)}💰`);
    }
    
    checkAchievements();
    updateUI();
    saveGame();
}

function playClickSound() {
    if (!settings.soundEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 523.25;
        gainNode.gain.value = 0.1;
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    } catch(e) {}
}

function createFloatingEffect(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-effect';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function renderEarn() {
    let businessIncome = 0;
    if (gameState.myBusinesses && gameState.myBusinesses.length > 0) {
        gameState.myBusinesses.forEach(b => {
            const taxItem = gameState.taxes.find(t => t.type === 'business' && t.id === b.id);
            if (!taxItem || !taxItem.paid) {
                let inc = b.income || 0;
                if (b.manager) {
                    inc *= (1 + b.manager.level * 0.1);
                }
                if (gameState.businessPassUpgraded) {
                    inc *= 1.5;
                }
                businessIncome += inc;
            }
        });
    }
    
    let cryptoIncome = 0;
    gameState.crypto.forEach(c => {
        const taxItem = gameState.taxes.find(t => t.type === 'crypto' && t.id === c.id);
        if ((!taxItem || !taxItem.paid) && c.owned > 0) {
            const cryptoData = cryptoCurrencies.find(cr => cr.id === c.id);
            if (cryptoData) {
                cryptoIncome += cryptoData.incomePerCoin * c.owned;
            }
        }
    });
    
    let miningIncome = 0;
    if (gameState.miningFarms) {
        gameState.miningFarms.forEach(farm => {
            const taxItem = gameState.taxes.find(t => t.type === 'mining' && t.id === farm.id);
            if (!taxItem || !taxItem.paid) {
                miningIncome += farm.crypto.basePrice * farm.level * 10 / 60;
            }
        });
    }
    
    let houseIncome = 0;
    if (gameState.houses) {
        gameState.houses.forEach(h => {
            if (h.owned) {
                const taxItem = gameState.taxes.find(t => t.type === 'house' && t.id === h.id);
                if (!taxItem || !taxItem.paid) {
                    let inc = h.baseIncome;
                    const upgradeCount = Object.values(h.upgrades).reduce((a, b) => a + b, 0);
                    inc *= (1 + upgradeCount);
                    houseIncome += inc;
                }
            }
        });
    }
    
    let islandIncome = 0;
    if (gameState.islands) {
        gameState.islands.forEach(i => {
            if (i.owned) {
                const taxItem = gameState.taxes.find(t => t.type === 'island' && t.id === i.id);
                if (!taxItem || !taxItem.paid) {
                    islandIncome += i.income;
                }
            }
        });
    }
    
    let specialIncome = specialItem.owned ? specialItem.income : 0;
    let spaceBonus = 0;
    if (gameState.space) {
        spaceBonus = SPACE_LEVELS.slice(0, gameState.space.level).reduce((sum, l) => sum + l.bonus, 0);
    }
    
    let totalIncome = (businessIncome + cryptoIncome + miningIncome + houseIncome + islandIncome + specialIncome + (gameState.autoClickerLevel || 0)) * (1 + spaceBonus / 100);
    
    document.getElementById('content').innerHTML = `
        <div class="click-area" onclick="handleClick()">
            <p>Кликайте в этой области, чтобы зарабатывать деньги</p>
            <h2>💰 ${formatMoney(BASE_CLICK_POWER * (gameState.level || 1))}</h2>
        </div>
        
        <div class="offline-earnings" onclick="switchTab('profile')">
            ⏱️ ОФФЛАЙН ДОХОД РАБОТАЕТ
        </div>
        
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-label">Доход/мин</div>
                <div class="stat-value">+${formatMoney(Math.floor(totalIncome))}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Всего кликов</div>
                <div class="stat-value">${formatNumber(gameState.totalClicks || 0)}</div>
            </div>
        </div>
        
        <div class="section-title">
            <h3>Откуда доход</h3>
        </div>
        
        <div style="background:#1a1c24; border-radius:16px; padding:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>👆 Клики</span>
                <span style="color:#ffd700;">+${formatMoney(BASE_CLICK_POWER * (gameState.level || 1))}/мин</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>💼 Бизнесы</span>
                <span style="color:#ffd700;">+${formatMoney(businessIncome)}/мин</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>📈 Крипта</span>
                <span style="color:#ffd700;">+${formatMoney(cryptoIncome)}/мин</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>⛏️ Майнинг</span>
                <span style="color:#ffd700;">+${formatMoney(miningIncome)}/мин</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>🏠 Дома</span>
                <span style="color:#ffd700;">+${formatMoney(houseIncome)}/мин</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>🏝️ Острова</span>
                <span style="color:#ffd700;">+${formatMoney(islandIncome)}/мин</span>
            </div>
            ${specialItem.owned ? `
                <div style="display:flex; justify-content:space-between;">
                    <span>💎 Suguru Coin</span>
                    <span style="color:#ffd700;">+${formatMoney(specialItem.income)}/мин</span>
                </div>
            ` : ''}
            ${spaceBonus > 0 ? `
                <div style="display:flex; justify-content:space-between;">
                    <span>🚀 Космос</span>
                    <span style="color:#ffd700;">+${spaceBonus}%</span>
                </div>
            ` : ''}
        </div>
        
        <div style="background:#1a1c24; border-radius:16px; padding:16px; margin-top:20px;">
            <h4 style="color:#ffd700; margin-bottom:10px;">🚗 3D МОДЕЛИ</h4>
            <div style="display:flex; gap:20px; justify-content:center; height:100px; flex-wrap:wrap;">
                <div style="width:80px; height:80px; position:relative;">
                    <div class="car-body" style="position:absolute; top:25px;"></div>
                    <div class="car-wheel left" style="position:absolute; top:45px;"></div>
                    <div class="car-wheel right" style="position:absolute; top:45px;"></div>
                </div>
                <div style="width:80px; height:80px; position:relative;">
                    <div class="bitcoin-coin" style="position:absolute;"></div>
                </div>
                <div style="width:80px; height:80px; position:relative;">
                    <div class="mining-rig" style="position:absolute;"></div>
                    <div class="mining-fan" style="position:absolute;"></div>
                </div>
                <div style="width:80px; height:80px; position:relative;">
                    <div class="island-base" style="position:absolute; bottom:10px;"></div>
                    <div class="island-palm" style="position:absolute;"></div>
                    <div class="island-leaf" style="position:absolute;"></div>
                </div>
            </div>
        </div>
    `;
}