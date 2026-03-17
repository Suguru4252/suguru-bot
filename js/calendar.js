// ========== КАЛЕНДАРЬ ==========
function getRewardForDay(day) {
    if (day % 10 === 0) {
        const multiplier = day / 10;
        
        if (day === 1000) {
            return { diamonds: 1000000, money: 1000000000000, title: "ИМПЕРАТОР ВСЕЛЕННОЙ", type: 'mega' };
        }
        if (day === 900) {
            return { diamonds: 100000, money: 100000000000, title: "КРИСТАЛЛ ВЕЧНОСТИ", type: 'mega' };
        }
        if (day === 800) {
            return { diamonds: 50000, money: 50000000000, title: "АЛМАЗНЫЙ БИЗНЕС", type: 'mega' };
        }
        if (day === 700) {
            return { diamonds: 30000, money: 30000000000, title: "СВОЙ ОСТРОВ", type: 'mega' };
        }
        if (day === 600) {
            return { diamonds: 20000, money: 20000000000, title: "ТЕЛЕПОРТ", type: 'mega' };
        }
        if (day === 500) {
            return { diamonds: 10000, money: 10000000000, title: "ПОЛОВИНА ПУТИ", type: 'mega' };
        }
        if (day === 400) {
            return { diamonds: 5000, money: 5000000000, title: "КОСМИЧЕСКАЯ СТАНЦИЯ", type: 'mega' };
        }
        if (day === 300) {
            return { diamonds: 3000, money: 3000000000, title: "ВЕЧНЫЙ БУСТЕР", type: 'mega' };
        }
        if (day === 200) {
            return { diamonds: 2000, money: 2000000000, title: "УНИКАЛЬНАЯ ФЕРМА", type: 'mega' };
        }
        if (day === 100) {
            return { diamonds: 5000, money: 5000000000, title: "ЮБИЛЕЙНЫЙ СУНДУК", type: 'mega' };
        }
        if (day % 100 === 0) {
            return { diamonds: 1000 * multiplier, money: 1000000000 * multiplier, title: `${day} ДНЕЙ!`, type: 'special-100' };
        }
        return { diamonds: 100 * multiplier, money: 100000000 * multiplier, title: `${day} ДНЕЙ`, type: 'special-10' };
    }
    const baseDiamonds = Math.floor(day / 10) + 5;
    const baseMoney = 10000 * day;
    return { diamonds: baseDiamonds, money: baseMoney, title: `День ${day}`, type: 'normal' };
}

function renderCalendar() {
    const now = Date.now();
    const daysPassed = Math.floor((now - calendarStartDate) / (24 * 60 * 60 * 1000));
    const currentDay = Math.min(daysPassed, CALENDAR_DAYS);
    
    if (gameState.calendar && gameState.calendar.currentDay < currentDay) {
        gameState.calendar.currentDay = currentDay;
    }
    
    let html = `
        <div class="calendar-container">
            <div class="calendar-header">
                <div class="calendar-day-info">
                    <div class="calendar-day-number">${gameState.calendar?.currentDay || 1}</div>
                    <div class="calendar-day-label">ТЕКУЩИЙ ДЕНЬ</div>
                </div>
                <div class="calendar-progress">
                    <div class="calendar-progress-fill" style="width: ${((gameState.calendar?.currentDay || 1) / CALENDAR_DAYS) * 100}%"></div>
                </div>
                <div class="calendar-day-info">
                    <div class="calendar-day-number">${CALENDAR_DAYS}</div>
                    <div class="calendar-day-label">ВСЕГО</div>
                </div>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin:10px 0;">
                <span>📊 Получено: ${gameState.calendar?.claimedDays?.length || 0}/${CALENDAR_DAYS}</span>
                <span>💎 Алмазов: ${gameState.calendar?.totalDiamonds || 0}</span>
                <span>🔥 Стрик: ${gameState.calendar?.streak || 0}</span>
            </div>
            
            <div class="calendar-grid">
    `;
    
    const startDay = Math.max(1, (gameState.calendar?.currentDay || 1) - 5);
    const endDay = Math.min(CALENDAR_DAYS, startDay + 14);
    
    for (let day = startDay; day <= endDay; day++) {
        const reward = getRewardForDay(day);
        const isClaimed = gameState.calendar?.claimedDays?.includes(day);
        const isAvailable = day <= (gameState.calendar?.currentDay || 1) && !isClaimed;
        
        let cardClass = 'calendar-day-card';
        if (reward.type === 'special-10') cardClass += ' special-10';
        if (reward.type === 'special-100' || reward.type === 'mega') cardClass += ' special-100';
        if (isClaimed) cardClass += ' claimed';
        
        html += `
            <div class="${cardClass}">
                <div class="calendar-day">День ${day}</div>
                <div class="calendar-reward">${reward.diamonds}💎</div>
                ${isAvailable ? 
                    `<button class="calendar-claim-btn" onclick="claimCalendarDay(${day})">Забрать</button>` :
                    `<button class="calendar-claim-btn disabled" disabled>${isClaimed ? 'Получено' : 'Закрыто'}</button>`
                }
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = html;
}

function claimCalendarDay(day) {
    if (!gameState.calendar) return;
    
    if (gameState.calendar.claimedDays.includes(day)) {
        alert('❌ НАГРАДА УЖЕ ПОЛУЧЕНА!');
        return;
    }
    
    if (day > gameState.calendar.currentDay) {
        alert('❌ ЭТОТ ДЕНЬ ЕЩЕ НЕ НАСТУПИЛ!');
        return;
    }
    
    const reward = getRewardForDay(day);
    gameState.calendar.claimedDays.push(day);
    gameState.calendar.totalDiamonds += reward.diamonds;
    gameState.diamonds = (gameState.diamonds || 0) + reward.diamonds;
    gameState.balance += reward.money;
    
    if (day === gameState.calendar.currentDay) {
        gameState.calendar.streak++;
    }
    
    checkAchievements();
    saveGame();
    updateUI();
    renderCalendar();
    alert(`✅ ПОЛУЧЕНО: ${reward.diamonds}💎 + ${formatMoney(reward.money)}`);
}