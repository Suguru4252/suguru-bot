// ========== ГЛАВНЫЙ ФАЙЛ ==========

// Глобальные переменные
window.gameState = null;
window.cryptoPrices = [];
window.currentTab = 'earn';
window.pendingAdminUser = null;
window.specialItem = {
    id: 999,
    name: "???????",
    hiddenName: "SUGURU COIN",
    emoji: "❓",
    hiddenEmoji: "💎",
    price: 777777777777777777,
    income: 7777777 / 60,
    owned: false,
    revealed: false
};

// Инициализация при загрузке
window.onload = function() {
    const userId = Utils.getDeviceId();
    
    // Загрузка сохранения
    const loaded = Storage.loadGame();
    
    if (loaded.success) {
        window.gameState = loaded.gameState;
        window.gameState.settings = loaded.settings;
        window.gameState.currentUser = loaded.nickname;
        window.gameState.currentUserId = userId;
        
        // Создание домов и островов если их нет
        if (!window.gameState.houses) {
            window.gameState.houses = GameState.createHouses();
        }
        if (!window.gameState.islands) {
            window.gameState.islands = GameState.createIslands();
        }
        
        window.cryptoPrices = window.gameState.cryptoPrices || CRYPTO_CURRENCIES.map(c => c.basePrice);
    } else {
        // Новое сохранение
        window.gameState = GameState.createInitialState(userId, "ИГРОК");
        window.gameState.houses = GameState.createHouses();
        window.gameState.islands = GameState.createIslands();
        window.cryptoPrices = CRYPTO_CURRENCIES.map(c => c.basePrice);
        window.gameState.cryptoPrices = window.cryptoPrices;
    }
    
    // Проверка админ-режима
    if (CONSTANTS.ADMIN_SECRETS.includes(window.gameState.currentUser)) {
        Admin.enableAdminMode();
    }
    
    // Обновление ника в шапке
    document.getElementById('username').innerHTML = '👑 ' + window.gameState.currentUser + ' <span class="warning-badge">⚠️ ЛОКАЛЬНО</span>';
    
    // Обновление UI
    Renderer.updateHeader();
    Tabs.switchTab('earn');
    Tabs.init();
    
    // Запуск автообновлений
    Updates.init();
    
    // Экспорт функций в глобальную область
    window.UI = {
        switchTab: Tabs.switchTab,
        showNicknameModal: () => UI.openModal('nicknameModal'),
        saveNickname: UI.saveNickname,
        closeModal: UI.closeModal,
        openModal: UI.openModal
    };
};