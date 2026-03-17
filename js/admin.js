// ========== АДМИНКА ==========
function showNicknameModal() {
    document.getElementById('nicknameInput').value = currentUser;
    document.getElementById('nicknameModal').classList.add('active');
}

function saveNickname() {
    const newNick = document.getElementById('nicknameInput').value.trim();
    if (!newNick) return;
    
    const oldUser = currentUser;
    currentUser = newNick;
    
    if (ADMIN_SECRETS.includes(currentUser) && !ADMIN_SECRETS.includes(oldUser)) {
        showAdminPasswordModal(currentUser);
    } else if (!ADMIN_SECRETS.includes(currentUser) && ADMIN_SECRETS.includes(oldUser)) {
        disableAdminMode();
    }
    
    document.getElementById('username').innerHTML = '👑 ' + currentUser + ' <span class="warning-badge">⚠️ ЛОКАЛЬНО</span>';
    if (specialItem.owned) {
        document.getElementById('username').innerHTML += ' <span class="suguru-badge">💎</span>';
    }
    saveGame();
    closeNicknameModal();
    if (document.querySelector('.nav-item.active')?.innerText.includes('Профиль')) {
        renderProfile();
    }
}

function showAdminPasswordModal(user) {
    pendingAdminUser = user;
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminPasswordModal').classList.add('active');
}

function checkAdminPassword() {
    const password = document.getElementById('adminPasswordInput').value;
    if (password === ADMIN_PASSWORD) {
        enableAdminMode();
        closeAdminPasswordModal();
    } else {
        alert('❌ Неверный пароль!');
    }
}

function enableAdminMode() {
    isAdmin = true;
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
}

function disableAdminMode() {
    isAdmin = false;
    document.body.classList.remove('admin-mode');
    document.querySelector('.app-container').classList.remove('admin-app');
    document.querySelector('.header').classList.remove('admin-header');
    document.getElementById('username').classList.remove('admin-username');
    document.querySelector('.bottom-nav').classList.remove('admin-nav');
}

function toggleSound() {
    settings.soundEnabled = !settings.soundEnabled;
    saveGame();
}

function toggleEffects() {
    settings.effectsEnabled = !settings.effectsEnabled;
    saveGame();
}