// ========== ИНТЕРВАЛЫ ==========

// ----- 1. Минутный доход (пассивный доход) -----
setInterval(() => {
    if (!gameState) return;
    
    let income = 0;
    
    // Доход с бизнесов
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
                income += inc;
                b.totalEarned = (b.totalEarned || 0) + inc;
            }
        });
    }
    
    // Доход с крипты
    if (gameState.crypto && cryptoPrices) {
        gameState.crypto.forEach(c => {
            const taxItem = gameState.taxes.find(t => t.type === 'crypto' && t.id === c.id);
            if ((!taxItem || !taxItem.paid) && c.owned > 0) {
                const cryptoData = cryptoCurrencies.find(cr => cr.id === c.id);
                if (cryptoData) {
                    income += cryptoData.incomePerCoin * c.owned;
                }
            }
        });
    }
    
    // Доход с майнинга
    if (gameState.miningFarms) {
        gameState.miningFarms.forEach(farm => {
            const taxItem = gameState.taxes.find(t => t.type === 'mining' && t.id === farm.id);
            if (!taxItem || !taxItem.paid) {
                income += farm.crypto.basePrice * farm.level * 10 / 60;
            }
        });
    }
    
    // Доход с домов
    if (gameState.houses) {
        gameState.houses.forEach(h => {
            if (h.owned) {
                const taxItem = gameState.taxes.find(t => t.type === 'house' && t.id === h.id);
                if (!taxItem || !taxItem.paid) {
                    let houseIncome = h.baseIncome;
                    const upgradeCount = Object.values(h.upgrades).reduce((a, b) => a + b, 0);
                    houseIncome *= (1 + upgradeCount);
                    income += houseIncome;
                }
            }
        });
    }
    
    // Доход с островов
    if (gameState.islands) {
        gameState.islands.forEach(i => {
            if (i.owned) {
                const taxItem = gameState.taxes.find(t => t.type === 'island' && t.id === i.id);
                if (!taxItem || !taxItem.paid) {
                    income += i.income;
                }
            }
        });
    }
    
    // Доход с Suguru Coin
    if (specialItem.owned) {
        income += specialItem.income;
    }
    
    // Бонус от космоса
    let spaceBonus = 0;
    if (gameState.space) {
        spaceBonus = SPACE_LEVELS.slice(0, gameState.space.level).reduce((sum, l) => sum + l.bonus, 0);
        income *= (1 + spaceBonus / 100);
    }
    
    if (income > 0) {
        gameState.balance = (gameState.balance || 0) + Math.floor(income);
        gameState.totalEarned = (gameState.totalEarned || 0) + Math.floor(income);
    }
    
    updateTaxes();
    checkBattlePassLevel();
    checkAchievements();
    
    updateUI();
    saveGame();
    
    // Обновляем текущую вкладку если нужно
    const activeTab = document.querySelector('.nav-item.active')?.innerText || '';
    if (activeTab.includes('Заработок')) renderEarn();
    if (activeTab.includes('Налоги')) renderTax();
}, 60000);


// ----- 2. Обновление цен криптовалют (каждые 5 минут) -----
setInterval(() => {
    if (gameState) {
        updateCryptoPrices();
        const activeTab = document.querySelector('.nav-item.active')?.innerText || '';
        if (activeTab.includes('Инвестиции')) {
            renderInvestments();
        }
    }
}, 300000);


// ----- 3. БЫСТРОЕ ОБНОВЛЕНИЕ UI (КАЖДЫЕ 0.1 СЕКУНДЫ) -----
setInterval(() => {
    if (!gameState) return;
    
    // Обновляем баланс и силу клика в шапке
    updateUI();
    
    // Проверяем завершение улучшений бизнесов
    if (gameState.myBusinesses) {
        gameState.myBusinesses.forEach((b, index) => {
            if (b.upgradeEnd && b.upgradeEnd <= Date.now()) {
                completeUpgrade(index);
            }
        });
    }
    
    // Проверяем полет ракеты
    if (rocketLaunchEnd && rocketLaunchEnd <= Date.now()) {
        completeRocketLaunch();
    }
    
    // Обновляем прогресс-бары в текущей вкладке
    const activeTab = document.querySelector('.nav-item.active')?.innerText || '';
    if (activeTab.includes('Бизнес')) {
        renderBusiness();
    } else if (activeTab.includes('Налоги')) {
        renderTax();
    } else if (activeTab.includes('Календарь')) {
        // Не обновляем календарь каждый раз, только если нужно
        // renderCalendar();
    } else if (activeTab.includes('Космос')) {
        // Только если есть активный полет
        if (rocketLaunchEnd && rocketLaunchEnd > Date.now()) {
            renderSpace();
        }
    }
    
}, 100); // 0.1 секунды (100 миллисекунд)