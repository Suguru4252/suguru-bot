// ========== АДМИН ПАНЕЛЬ ==========
const Admin = {
    // Проверка пароля
    checkPassword() {
        const password = document.getElementById('adminPasswordInput').value;
        if (password === CONSTANTS.ADMIN_PASSWORD) {
            this.enableAdminMode();
            UI.closeModal('adminPasswordModal');
        } else {
            alert('❌ Неверный пароль!');
        }
    },
    
    // Включение админ-режима
    enableAdminMode() {
        const gameState = window.gameState;
        gameState.isAdmin = true;
        
        document.body.classList.add('admin-mode');
        document.querySelector('.app-container').classList.add('admin-app');
        document.querySelector('.header').classList.add('admin-header');
        document.getElementById('username').classList.add('admin-username');
        document.querySelector('.bottom-nav').classList.add('admin-nav');
        
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'rgba(255, 0, 0, 0.3)';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 1000);
        
        alert('🔥 ВАМ ВЫДАНЫ ПРАВА АДМИНИСТРАТОРА!');
    },
    
    // Выключение админ-режима
    disableAdminMode() {
        const gameState = window.gameState;
        gameState.isAdmin = false;
        
        document.body.classList.remove('admin-mode');
        document.querySelector('.app-container').classList.remove('admin-app');
        document.querySelector('.header').classList.remove('admin-header');
        document.getElementById('username').classList.remove('admin-username');
        document.querySelector('.bottom-nav').classList.remove('admin-nav');
    },
    
    // Показ модалки с паролем
    showPasswordModal(user) {
        window.pendingAdminUser = user;
        document.getElementById('adminPasswordInput').value = '';
        UI.openModal('adminPasswordModal');
    }
};

window.Admin = Admin;