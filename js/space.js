// ========== КОСМИЧЕСКАЯ ПРОГРАММА ==========

// Глобальные переменные для ракеты
let rocketLaunchEnd = null;
let rocketInterval = null;

// Рендер космоса
function renderSpace() {
    const totalBonus = SPACE_LEVELS.slice(0, gameState.space?.level || 0).reduce((sum, l) => sum + l.bonus, 0);
    
    let rocketHtml = '';
    if (rocketLaunchEnd && rocketLaunchEnd > Date.now()) {
        const timeLeft = rocketLaunchEnd - Date.now();
        rocketHtml = `
            <div class="rocket-timer">
                🚀 РАКЕТА В ПОЛЕТЕ: ${formatTime(timeLeft)}
            </div>
        `;
    }
    
    let html = `
        <div class="space-container">
            <div class="space-stars" id="spaceStars"></div>
            <div class="space-rocket" id="spaceRocket">
                <div class="space-rocket-body">
                    <div class="space-rocket-window"></div>
                </div>
                <div class="space-rocket-fire"></div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-label">Уровень космоса</div>
                <div class="stat-value">${gameState.space?.level || 0}/10</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Бонус к доходу</div>
                <div class="stat-value">+${totalBonus}%</div>
            </div>
        </div>
        
        ${rocketHtml}
        
        <button class="rocket-launch-btn" onclick="launchRocket()">
            🚀 ЗАПУСТИТЬ РАКЕТУ (10,000,000,000,000💰)
        </button>
        
        <div class="space-levels">
    `;
    
    SPACE_LEVELS.forEach((level, index) => {
        const isUnlocked = index <= (gameState.space?.level || 0);
        const isCurrent = index === (gameState.space?.level || 0);
        
        html += `
            <div class="space-level ${isUnlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}" onclick="buySpaceLevel(${index})">
                <div class="space-level-number">${index + 1}</div>
                <div class="space-level-name">${level.name}</div>
                <div class="space-level-bonus">+${level.bonus}%</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if ((gameState.space?.level || 0) < SPACE_LEVELS.length) {
        const nextLevel = SPACE_LEVELS[gameState.space?.level || 0];
        html += `
            <button class="card-btn" style="margin-top:16px;" onclick="buySpaceLevel(${gameState.space?.level || 0})">
                🚀 КУПИТЬ ${nextLevel.name} (${formatMoney(nextLevel.price)})
            </button>
        `;
    } else {
        html += `
            <button class="card-btn" style="margin-top:16px;" disabled>
                🌌 ВСЕЛЕННАЯ ПОКОРЕНА
            </button>
        `;
    }
    
    document.getElementById('content').innerHTML = html;
    generateSpaceStars();
}

// Генерация звезд
function generateSpaceStars() {
    const starsContainer = document.getElementById('spaceStars');
    if (!starsContainer) return;
    
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'space-star';
        
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starsContainer.appendChild(star);
    }
}

// Покупка уровня космоса
function buySpaceLevel(levelIndex) {
    if (!gameState.space) {
        gameState.space = { level: 0, unlockedLevels: [0] };
    }
    
    if (levelIndex !== gameState.space.level) {
        alert('❌ СНАЧАЛА КУПИТЕ ПРЕДЫДУЩИЕ УРОВНИ!');
        return;
    }
    
    if (levelIndex >= SPACE_LEVELS.length) return;
    
    const levelData = SPACE_LEVELS[levelIndex];
    
    if (gameState.balance < levelData.price) {
        alert('❌ НЕДОСТАТОЧНО МОНЕТ!');
        return;
    }
    
    gameState.balance -= levelData.price;
    gameState.space.level++;
    gameState.space.unlockedLevels.push(gameState.space.level);
    
    // Добавляем в налоги (космос тоже облагается налогом)
    addTaxItem('space', 'space_level', levelData.price);
    
    launchSpaceRocket();
    checkAchievements();
    saveGame();
    updateUI();
    renderSpace();
    alert(`✅ КУПЛЕН УРОВЕНЬ: ${levelData.name}\nТеперь ваш бонус: +${levelData.bonus}%`);
}

// Анимация запуска ракеты
function launchSpaceRocket() {
    const rocket = document.getElementById('spaceRocket');
    if (!rocket) return;
    
    rocket.classList.add('launch');
    
    setTimeout(() => {
        rocket.classList.remove('launch');
    }, 3000);
}

// Запуск ракеты (игровая механика)
function launchRocket() {
    if (!gameState.space) return;
    
    const launchCost = 10000000000000; // 10 триллионов
    
    if (gameState.balance < launchCost) {
        alert(`❌ НЕДОСТАТОЧНО МОНЕТ! Нужно ${formatMoney(launchCost)}`);
        return;
    }
    
    if (rocketLaunchEnd && rocketLaunchEnd > Date.now()) {
        alert('⏱️ РАКЕТА УЖЕ В ПОЛЕТЕ!');
        return;
    }
    
    gameState.balance -= launchCost;
    
    // Рандомное время от 1 часа до 3 дней
    const minTime = 60 * 60 * 1000; // 1 час
    const maxTime = 3 * 24 * 60 * 60 * 1000; // 3 дня
    const launchTime = minTime + Math.random() * (maxTime - minTime);
    
    rocketLaunchEnd = Date.now() + launchTime;
    
    // Шанс успеха (чем дольше полет, тем выше шанс)
    const successChance = 0.3 + (launchTime / maxTime) * 0.4; // от 30% до 70%
    
    gameState.space.lastLaunch = {
        startTime: Date.now(),
        endTime: rocketLaunchEnd,
        successChance: successChance,
        cost: launchCost
    };
    
    if (!gameState.rocketLaunches) gameState.rocketLaunches = [];
    gameState.rocketLaunches.push({
        time: Date.now(),
        duration: launchTime,
        chance: successChance
    });
    
    launchSpaceRocket();
    
    if (rocketInterval) clearInterval(rocketInterval);
    rocketInterval = setInterval(checkRocketLaunch, 1000);
    
    saveGame();
    updateUI();
    renderSpace();
    alert(`🚀 РАКЕТА ЗАПУЩЕНА!\n\nВремя полета: ${formatTime(launchTime)}\nШанс успеха: ${Math.floor(successChance * 100)}%`);
}

// Проверка статуса ракеты
function checkRocketLaunch() {
    if (!rocketLaunchEnd) return;
    
    if (rocketLaunchEnd <= Date.now()) {
        completeRocketLaunch();
        if (rocketInterval) {
            clearInterval(rocketInterval);
            rocketInterval = null;
        }
    } else {
        // Обновляем таймер если мы на вкладке космоса
        const activeTab = document.querySelector('.nav-item.active')?.innerText || '';
        if (activeTab.includes('Космос')) {
            const timeLeft = rocketLaunchEnd - Date.now();
            const timerEl = document.querySelector('.rocket-timer');
            if (timerEl) {
                timerEl.innerHTML = `🚀 РАКЕТА В ПОЛЕТЕ: ${formatTime(timeLeft)}`;
            }
        }
    }
}

// Завершение полета ракеты
function completeRocketLaunch() {
    if (!gameState.space?.lastLaunch) return;
    
    const launch = gameState.space.lastLaunch;
    const random = Math.random();
    const success = random < launch.successChance;
    
    let rewards = [];
    let message = '';
    
    if (success) {
        const rarity = 1 - launch.successChance;
        
        // Денежная награда
        const moneyReward = Math.floor(launch.cost * (0.5 + rarity * 2));
        gameState.balance += moneyReward;
        rewards.push(`💰 ${formatMoney(moneyReward)}`);
        
        // Алмазы
        if (rarity > 0.4) {
            const diamondsReward = Math.floor(100 * rarity * 10);
            gameState.diamonds += diamondsReward;
            rewards.push(`💎 ${diamondsReward}`);
        }
        
        // Крипта
        if (rarity > 0.5) {
            const randomCrypto = cryptoCurrencies[Math.floor(Math.random() * cryptoCurrencies.length)];
            const cryptoAmount = Math.floor(10000 * rarity);
            const userCrypto = gameState.crypto.find(c => c.id === randomCrypto.id);
            if (userCrypto) {
                userCrypto.owned += cryptoAmount;
                rewards.push(`${randomCrypto.emoji} ${cryptoAmount} ${randomCrypto.name}`);
            }
        }
        
        // Бесплатный уровень космоса
        if (rarity > 0.6) {
            if (gameState.space.level < SPACE_LEVELS.length) {
                gameState.space.level++;
                gameState.space.unlockedLevels.push(gameState.space.level);
                rewards.push(`🚀 +1 уровень космоса (бесплатно!)`);
            }
        }
        
        message = '🎉 УСПЕХ! Разведка удалась!';
    } else {
        // Неудача - возврат 30%
        const refund = Math.floor(launch.cost * 0.3);
        gameState.balance += refund;
        message = '💥 НЕУДАЧА! Ракета потеряна... Но вы получили страховку';
        rewards.push(`💰 ${formatMoney(refund)} (страховка)`);
    }
    
    gameState.space.lastLaunch = null;
    rocketLaunchEnd = null;
    
    saveGame();
    
    alert(`${message}\n\nПолучено:\n${rewards.join('\n')}`);
}
