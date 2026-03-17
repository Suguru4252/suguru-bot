// ========== ИНИЦИАЛИЗАЦИЯ ==========
window.onload = function() {
    if (!loadGame()) {
        gameState = {
            balance: 1000000,
            diamonds: 1000,
            exp: 0,
            level: 1,
            totalClicks: 0,
            totalEarned: 1000000,
            lastOnlineTime: Date.now(),
            myBusinesses: [],
            miningFarms: [],
            battlePass: { level: 1, exp: 0, claimed: [], lastReset: Date.now() },
            businessSlots: MAX_BUSINESSES,
            businessPassUpgraded: false,
            houses: houses.map(h => ({ ...h })),
            islands: islands.map(i => ({ ...i })),
            garages: { cars: [], planes: [], ships: [] },
            crypto: cryptoCurrencies.map(c => ({ id: c.id, owned: 0 })),
            cryptoPrices: cryptoCurrencies.map(c => c.basePrice),
            taxes: [],
            calendar: {
                currentDay: 1,
                lastClaimTime: Date.now() - 24 * 60 * 60 * 1000,
                claimedDays: [],
                totalDiamonds: 0,
                streak: 0
            },
            space: {
                level: 0,
                unlockedLevels: [0],
                lastLaunch: null
            },
            achievements: [],
            claimedAchievements: [],
            rocketLaunches: []
        };
        
        cryptoPrices = gameState.cryptoPrices;
    }
    
    if (ADMIN_SECRETS.includes(currentUser)) {
        enableAdminMode();
    }
    
    document.getElementById('username').innerHTML = '👑 ' + currentUser + ' <span class="warning-badge">⚠️ ЛОКАЛЬНО</span>';
    if (specialItem.owned) {
        document.getElementById('username').innerHTML += ' <span class="suguru-badge">💎</span>';
    }
    
    updateUI();
    renderEarn();
    
    // Глобальные функции
window.handleClick = handleClick;
window.switchTab = switchTab;
window.showNicknameModal = showNicknameModal;
window.saveNickname = saveNickname;
window.closeNicknameModal = closeNicknameModal;
window.closeAdminPasswordModal = closeAdminPasswordModal;
window.checkAdminPassword = checkAdminPassword;
window.buyBusiness = buyBusiness;
window.buyMiningFarm = buyMiningFarm;
window.upgradeMiningFarm = upgradeMiningFarm;
window.sellMiningFarm = sellMiningFarm;
window.buySalonItem = buySalonItem;
window.sellGarageItem = sellGarageItem;
window.showSalon = showSalon;
window.showGarage = showGarage;
window.buyHouse = buyHouse;
window.sellHouse = sellHouse;
window.upgradeHouse = upgradeHouse;
window.openHouseModal = openHouseModal;
window.showAllHouses = showAllHouses;
window.closeHousesModal = closeHousesModal;
window.buyIsland = buyIsland;
window.showMyIslands = showMyIslands;
window.showAllIslands = showAllIslands;
window.closeIslandsModal = closeIslandsModal;
window.openTradeModal = openTradeModal;
window.setTradeAmount = setTradeAmount;
window.quickBuyMaxMoney = quickBuyMaxMoney;
window.quickSellAll = quickSellAll;
window.executeTrade = executeTrade;
window.showCryptoPortfolio = showCryptoPortfolio;
window.buySpecialItem = buySpecialItem;
window.showBattlePass = showBattlePass;
window.claimBattlePassReward = claimBattlePassReward;
window.changePassPage = changePassPage;
window.showTop100 = showTop100;
window.closeTopModal = closeTopModal;
window.payTaxByIndex = payTaxByIndex;
window.startUpgrade = startUpgrade;
window.hireManager = hireManager;
window.sellBusiness = sellBusiness;
window.upgradeBusinessPass = upgradeBusinessPass;
window.showBuyBusinessModal = showBuyBusinessModal;
window.openBusinessModal = openBusinessModal;
window.claimAchievement = claimAchievement;
window.changeAchievementsPage = changeAchievementsPage;
window.claimCalendarDay = claimCalendarDay;
window.buySpaceLevel = buySpaceLevel;
window.launchRocket = launchRocket;
window.closeModal = closeModal;
window.toggleSound = toggleSound;
window.toggleEffects = toggleEffects;
window.resetGame = resetGame;