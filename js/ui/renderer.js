// ========== РЕНДЕРИНГ ==========
const Renderer = {
    // Рендер вкладки "Заработок"
    renderEarn() {
        const gameState = window.gameState;
        let businessIncome = 0;
        let cryptoIncome = 0;
        let miningIncome = 0;
        let houseIncome = 0;
        let islandIncome = 0;
        
        // Расчет доходов (упрощенно)
        if (gameState.myBusinesses) {
            gameState.myBusinesses.forEach(b => {
                const taxItem = gameState.taxes.find(t => t.type === 'business' && t.id === b.id);
                if (!taxItem || !taxItem.paid) {
                    let inc = b.income || 0;
                    if (b.manager) inc *= (1 + b.manager.level * 0.1);
                    if (gameState.businessPassUpgraded) inc *= 1.5;
                    businessIncome += inc;
                }
            });
        }
        
        const spaceBonus = gameState.space ? SPACE_LEVELS.slice(0, gameState.space.level).reduce((sum, l) => sum + l.bonus, 0) : 0;
        const totalIncome = (businessIncome + cryptoIncome + miningIncome + houseIncome + islandIncome) * (1 + spaceBonus / 100);
        
        document.getElementById('content').innerHTML = `
            <div class="click-area" onclick="Clicker.handleClick(event)">
                <p>Кликайте в этой области, чтобы зарабатывать деньги</p>
                <h2>💰 ${Utils.formatMoney(CONSTANTS.BASE_CLICK_POWER * (gameState.level || 1))}</h2>
            </div>
            
            <div class="offline-earnings" onclick="UI.switchTab('profile')">
                ⏱️ ОФФЛАЙН ДОХОД РАБОТАЕТ
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Доход/мин</div>
                    <div class="stat-value">+${Utils.formatMoney(Math.floor(totalIncome))}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Всего кликов</div>
                    <div class="stat-value">${Utils.formatNumber(gameState.totalClicks || 0)}</div>
                </div>
            </div>
        `;
    },
    
    // Рендер текущей вкладки
    renderCurrentTab() {
        const tab = window.currentTab || 'earn';
        
        switch(tab) {
            case 'earn': this.renderEarn(); break;
            case 'profile': this.renderProfile(); break;
            // ... остальные вкладки
            default: this.renderEarn();
        }
    },
    
    // Обновление хедера
    updateHeader() {
        const gameState = window.gameState;
        document.getElementById('balance').textContent = Utils.formatMoney(gameState.balance || 0);
        document.getElementById('balanceChange').innerHTML = '+ ' + Utils.formatMoney(gameState.totalEarned || 0) + ' за все время';
        document.getElementById('clickPower').textContent = Utils.formatMoney(CONSTANTS.BASE_CLICK_POWER * (gameState.level || 1));
    }
};

window.Renderer = Renderer;