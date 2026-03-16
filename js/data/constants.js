// ========== ГЛОБАЛЬНЫЕ КОНСТАНТЫ ==========
const CONSTANTS = {
    APP_VERSION: '12.0.0-MODULAR',
    ADMIN_PASSWORD: '2a3d4g5j',
    ADMIN_SECRETS: ['2a3d4g5j', 'test', 'test2', 'test3', 'dexter'],
    
    MAX_BUSINESSES: 8,
    MAX_MINING_FARMS: 20,
    MAX_FARM_LEVEL: 100,
    BASE_CLICK_POWER: 3000,
    HOUSE_INCOME_MULTIPLIER: 4.44,
    MAX_PLAYER_LEVEL: 100,
    MAX_HOUSE_UPGRADES: 42,
    
    TAX_RATE: 0.2,
    TAX_PERIOD: 72 * 60 * 60 * 1000, // 72 часа
    
    CALENDAR_DAYS: 1000,
    
    PASS_LEVELS_PER_PAGE: 10,
    ACHIEVEMENTS_PER_PAGE: 12
};

// Экспортируем в глобальную область
window.CONSTANTS = CONSTANTS;