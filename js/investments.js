// ========== ИНВЕСТИЦИИ ==========
function renderInvestments() {
    let totalPortfolio = calculateTotalCryptoPortfolio();
    let totalIncome = calculateTotalCryptoIncome();
    
    const ownedHouses = gameState.houses.filter(h => h.owned).length;
    const totalHouses = gameState.houses.length;
    
    document.getElementById('content').innerHTML = `
        <div class="houses-section" onclick="showAllHouses()">
            <div class="houses-section-header">
                <span class="houses-section-title">🏠 Дома</span>
                <span class="houses-section-count">${ownedHouses}/${totalHouses}</span>
            </div>
            <div style="color:#8e8e98; font-size:13px; margin-top:8px;">
                Нажмите для управления домами
            </div>
        </div>
        
        <div class="portfolio-mini" onclick="showCryptoPortfolio()">
            <span class="portfolio-mini-label">📊 КРИПТОПОРТФЕЛЬ</span>
            <span class="portfolio-mini-value">${formatMoney(totalPortfolio)}</span>
        </div>
    `;
    
    if (!specialItem.owned) {
        document.getElementById('content').innerHTML += `
            <div style="background:linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,0,255,0.1)); border:2px solid #ff00ff; border-radius:16px; padding:16px; margin-bottom:20px; text-align:center; cursor:pointer;" onclick="buySpecialItem()">
                <div style="font-size:48px; margin-bottom:8px;">❓</div>
                <div style="font-size:20px; font-weight:bold; color:#ff00ff; margin-bottom:8px;">SUGURU COIN</div>
                <div style="font-size:16px; color:#ffd700; margin-bottom:8px;">${formatMoney(specialItem.price)}</div>
                <div style="font-size:14px; color:#4caf50; margin-bottom:12px;">⏱️ +${formatMoney(specialItem.income)}/мин</div>
                <button class="card-btn">КУПИТЬ</button>
            </div>
        `;
    } else {
        document.getElementById('content').innerHTML += `
            <div style="background:linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,0,255,0.1)); border:2px solid #ff00ff; border-radius:16px; padding:16px; margin-bottom:20px; text-align:center;">
                <div style="font-size:48px; margin-bottom:8px;">💎</div>
                <div style="font-size:20px; font-weight:bold; color:#ff00ff; margin-bottom:8px;">SUGURU COIN</div>
                <div style="font-size:14px; color:#4caf50; margin-bottom:12px;">⏱️ +${formatMoney(specialItem.income)}/мин</div>
                <div style="color:#4caf50;">ВЛАДЕЮ</div>
            </div>
        `;
    }
}