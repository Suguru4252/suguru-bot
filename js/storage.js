// ========== ЗАГРУЗКА/СОХРАНЕНИЕ ==========
function loadGame() {
    const saved = localStorage.getItem('imperiaClickerSave_' + currentUserId);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            gameState = data.gameState;
            settings = data.settings || { soundEnabled: true, effectsEnabled: true };
            currentUser = data.nickname || "ИГРОК";
            
            if (!gameState.houses) {
                gameState.houses = houses.map(h => ({ ...h }));
            }
            
            if (!gameState.islands) {
                gameState.islands = islands.map(i => ({ ...i }));
            }
            
            if (!gameState.garages) {
                gameState.garages = { cars: [], planes: [], ships: [] };
            }
            
            if (!gameState.crypto) {
                gameState.crypto = cryptoCurrencies.map(c => ({ id: c.id, owned: 0 }));
            }
            
            if (!gameState.cryptoPrices) {
                cryptoPrices = cryptoCurrencies.map(c => c.basePrice);
                gameState.cryptoPrices = cryptoPrices;
            } else {
                cryptoPrices = gameState.cryptoPrices;
            }
            
            if (!gameState.myBusinesses) {
                gameState.myBusinesses = [];
            }
            
            if (!gameState.miningFarms) {
                gameState.miningFarms = [];
            }
            
            if (!gameState.battlePass) {
                gameState.battlePass = { level: 1, exp: 0, claimed: [], lastReset: Date.now() };
            }
            
            if (!gameState.businessPassUpgraded) {
                gameState.businessPassUpgraded = false;
            }
            
            if (!gameState.taxes) {
                gameState.taxes = [];
            }
            
            if (!gameState.calendar) {
                gameState.calendar = {
                    currentDay: 1,
                    lastClaimTime: Date.now() - 24 * 60 * 60 * 1000,
                    claimedDays: [],
                    totalDiamonds: 0,
                    streak: 0
                };
            }
            
            if (!gameState.space) {
                gameState.space = {
                    level: 0,
                    unlockedLevels: [0],
                    lastLaunchTime: null
                };
            }
            
            if (!gameState.achievements) {
                gameState.achievements = [];
                gameState.claimedAchievements = [];
            }
            
            if (!gameState.rocketLaunches) {
                gameState.rocketLaunches = [];
            }
            
            if (gameState.specialItem === undefined) {
                gameState.specialItem = { owned: false, revealed: false };
            } else {
                specialItem.owned = gameState.specialItem.owned;
                specialItem.revealed = gameState.specialItem.revealed;
            }
            
            const now = Date.now();
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            if (now - (gameState.battlePass.lastReset || 0) > oneWeek) {
                gameState.battlePass = { level: 1, exp: 0, claimed: [], lastReset: now };
            }
            
            const lastOnline = gameState.lastOnlineTime || now;
            const secondsPassed = Math.floor((now - lastOnline) / 1000);
            
            if (secondsPassed > 10) {
                calculateOfflineEarnings(secondsPassed);
            }
            
            gameState.lastOnlineTime = now;
            
            return true;
        } catch(e) {
            console.error('Load error', e);
            return false;
        }
    }
    return false;
}

function saveGame() {
    if (gameState) {
        gameState.lastOnlineTime = Date.now();
        gameState.cryptoPrices = cryptoPrices;
        gameState.specialItem = { owned: specialItem.owned, revealed: specialItem.revealed };
        const saveData = {
            gameState: gameState,
            settings: settings,
            nickname: currentUser
        };
        localStorage.setItem('imperiaClickerSave_' + currentUserId, JSON.stringify(saveData));
    }
}

function resetGame() {
    if (confirm('ТОЧНО СБРОСИТЬ ВЕСЬ ПРОГРЕСС? Это действие необратимо!')) {
        localStorage.removeItem('imperiaClickerSave_' + currentUserId);
        localStorage.removeItem('deviceId');
        location.reload();
    }
}