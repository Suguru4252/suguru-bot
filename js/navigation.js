// ========== НАВИГАЦИЯ ==========

// Переключение вкладок
function switchTab(tab) {
    console.log('Switching to tab:', tab); // Для отладки
    
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    
    // Добавляем активный класс нажатой кнопке
    event.target.classList.add('active');
    
    // Вызываем соответствующий рендер
    if (tab === 'earn') {
        if (typeof renderEarn === 'function') renderEarn();
        else console.error('renderEarn not found');
    }
    else if (tab === 'calendar') {
        if (typeof renderCalendar === 'function') renderCalendar();
        else console.error('renderCalendar not found');
    }
    else if (tab === 'space') {
        if (typeof renderSpace === 'function') renderSpace();
        else console.error('renderSpace not found');
    }
    else if (tab === 'achievements') {
        if (typeof renderAchievements === 'function') renderAchievements();
        else console.error('renderAchievements not found');
    }
    else if (tab === 'investments') {
        if (typeof renderInvestments === 'function') renderInvestments();
        else console.error('renderInvestments not found');
    }
    else if (tab === 'business') {
        if (typeof renderBusiness === 'function') renderBusiness();
        else console.error('renderBusiness not found');
    }
    else if (tab === 'mining') {
        if (typeof renderMining === 'function') renderMining();
        else console.error('renderMining not found');
    }
    else if (tab === 'tax') {
        if (typeof renderTax === 'function') renderTax();
        else console.error('renderTax not found');
    }
    else if (tab === 'items') {
        if (typeof renderItems === 'function') renderItems();
        else console.error('renderItems not found');
    }
    else if (tab === 'profile') {
        if (typeof renderProfile === 'function') renderProfile();
        else console.error('renderProfile not found');
    }
}

// Обновление UI (баланс, сила клика)
function updateUI() {
    if (!gameState) return;
    
    const balanceEl = document.getElementById('balance');
    const balanceChangeEl = document.getElementById('balanceChange');
    const clickPowerEl = document.getElementById('clickPower');
    
    if (balanceEl) balanceEl.textContent = formatMoney(gameState.balance || 0);
    if (balanceChangeEl) balanceChangeEl.innerHTML = '+ ' + formatMoney(gameState.totalEarned || 0) + ' за все время';
    if (clickPowerEl) clickPowerEl.textContent = formatMoney(BASE_CLICK_POWER * (gameState.level || 1));
}

// Закрыть модалку по ID
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// Закрыть модалку ника
function closeNicknameModal() {
    closeModal('nicknameModal');
}

// Закрыть модалку админ пароля
function closeAdminPasswordModal() {
    closeModal('adminPasswordModal');
}

// Закрыть модалку домов
function closeHousesModal() {
    closeModal('housesModal');
}

// Закрыть модалку топ
function closeTopModal() {
    closeModal('topModal');
}

// Закрыть модалку островов
function closeIslandsModal() {
    closeModal('islandsModal');
}