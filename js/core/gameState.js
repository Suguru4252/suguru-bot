// ========== ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЯ ИГРЫ ==========
const GameState = {
    // Создание начального состояния
    createInitialState(userId, nickname) {
        return {
            currentUserId: userId,
            currentUser: nickname || "ИГРОК",
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
            businessSlots: CONSTANTS.MAX_BUSINESSES,
            businessPassUpgraded: false,
            garages: { cars: [], planes: [], ships: [] },
            crypto: CRYPTO_CURRENCIES.map(c => ({ id: c.id, owned: 0 })),
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
            rocketLaunches: [],
            settings: {
                soundEnabled: true,
                effectsEnabled: true
            },
            isAdmin: false
        };
    },
    
    // Создание домов
    createHouses() {
        const houses = [];
        for (let i = 0; i < 50; i++) {
            houses.push({
                id: i,
                name: `${['Квартира', 'Дом', 'Вилла', 'Особняк', 'Замок'][i % 5]} ${Math.floor(i/5) + 1}`,
                emoji: ['🏢', '🏠', '🏡', '🏰', '🏯'][i % 5],
                price: (50000000 + (i * 20000000)) * 3,
                baseIncome: 1000 * (i + 1) * CONSTANTS.HOUSE_INCOME_MULTIPLIER / 60,
                owned: false,
                upgrades: { interior: 0, kitchen: 0, bed: 0, antenna: 0, tv: 0 }
            });
        }
        return houses;
    },
    
    // Создание островов
    createIslands() {
        const islands = [];
        for (let i = 0; i < 10; i++) {
            islands.push({
                id: i,
                name: `${['Тропический', 'Вулканический', 'Ледяной', 'Пустынный', 'Райский'][i % 5]} остров ${Math.floor(i/2) + 1}`,
                emoji: ['🏝️', '🌋', '🏔️', '🏜️', '🌴'][i % 5],
                price: 1000000000 * Math.pow(5, i),
                income: 5000000 * Math.pow(2, i) / 60,
                owned: false
            });
        }
        return islands;
    }
};

window.GameState = GameState;