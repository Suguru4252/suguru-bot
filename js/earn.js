// ========== ЗАРАБОТОК ==========

function renderEarn() {
    if (!gameState) return;
    
    let businessIncome = 0;
    if (gameState.myBusinesses && gameState.myBusinesses.length > 0) {
        gameState.myBusinesses.forEach(b => {
            const taxItem = gameState.taxes?.find(t => t.type === 'business' && t.id === b.id);
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
    if (gameState.crypto) {
        gameState.crypto.forEach(c => {
            const taxItem = gameState.taxes?.find(t => t.type === 'crypto' && t.id === c.id);
            if ((!taxItem || !taxItem.paid) && c.owned > 0) {
                const cryptoData = cryptoCurrencies.find(cr => cr.id === c.id);
                if (cryptoData) {
                    cryptoIncome += cryptoData.incomePerCoin * c.owned;
                }
            }
        });
    }
    
    let miningIncome = 0;
    if (gameState.miningFarms) {
        gameState.miningFarms.forEach(farm => {
            const taxItem = gameState.taxes?.find(t => t.type === 'mining' && t.id === farm.id);
            if (!taxItem || !taxItem.paid) {
                miningIncome += farm.crypto.basePrice * farm.level * 10 / 60;
            }
        });
    }
    
    let houseIncome = 0;
    if (gameState.houses) {
        gameState.houses.forEach(h => {
            if (h.owned) {
                const taxItem = gameState.taxes?.find(t => t.type === 'house' && t.id === h.id);
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
                const taxItem = gameState.taxes?.find(t => t.type === 'island' && t.id === i.id);
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
    
    const content = document.getElementById('content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="click-area" onclick="handleClick(event)">
            <p>👆 Нажимай сюда чтобы зарабатывать</p>
            <h2>💰 ${formatMoney(BASE_CLICK_POWER * (gameState.level || 1))}</h2>
        </div>
        
        <div class="offline-earnings" onclick="switchTab('profile')">
            ⏱️ Оффлайн доход: +${formatMoney(Math.floor(totalIncome))}/мин
        </div>
        
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-label">💰 Доход/мин</div>
                <div class="stat-value">+${formatMoney(Math.floor(totalIncome))}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">👆 Всего кликов</div>
                <div class="stat-value">${formatNumber(gameState.totalClicks || 0)}</div>
            </div>
        </div>
        
        <div class="section-title">
            <h3>📊 Откуда доход</h3>
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
    `;
}