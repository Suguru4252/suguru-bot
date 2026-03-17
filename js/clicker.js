// ========== КЛИКЕР ==========

function handleClick() {
    if (!gameState) return;
    
    const earned = BASE_CLICK_POWER * (gameState.level || 1);
    gameState.balance = (gameState.balance || 0) + earned;
    gameState.totalClicks = (gameState.totalClicks || 0) + 1;
    gameState.totalEarned = (gameState.totalEarned || 0) + earned;
    
    // Опыт
    gameState.exp = (gameState.exp || 0) + earned / 100;
    const expNeeded = (gameState.level || 1) * 1500;
    while (gameState.exp >= expNeeded && (gameState.level || 1) < MAX_PLAYER_LEVEL) {
        gameState.exp -= expNeeded;
        gameState.level = (gameState.level || 1) + 1;
        gameState.diamonds = (gameState.diamonds || 0) + 5;
    }
    
    // Боевой пропуск
    if (gameState.battlePass && gameState.battlePass.level < 200) {
        gameState.battlePass.exp += 100;
        if (typeof checkBattlePassLevel === 'function') checkBattlePassLevel();
    }
    
    // Звук
    playClickSound();
    
    // Визуальный эффект
    if (settings.effectsEnabled) {
        createFloatingEffect(event?.clientX || window.innerWidth/2, event?.clientY || window.innerHeight/2, `+${formatNumber(earned)}💰`);
    }
    
    // Проверка ачивок
    if (typeof checkAchievements === 'function') checkAchievements();
    
    // Обновление UI
    updateUI();
    saveGame();
}

function playClickSound() {
    if (!settings.soundEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 523.25;
        gainNode.gain.value = 0.1;
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    } catch(e) {
        console.log('Sound error:', e);
    }
}

function createFloatingEffect(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-effect';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}