function renderBusiness() {
    if (!gameState) return;
    
    const businessLimit = gameState.businessSlots || MAX_BUSINESSES;
    
    let html = '';
    
    if (!gameState.businessPassUpgraded) {
        html += `
            <div class="upgrade-pass-btn" onclick="upgradeBusinessPass()">
                ⚡ УЛУЧШИТЬ БИЗНЕС ПРОПУСК (500💎)<br>
                <span style="font-size:12px;">+50% к прибыли от улучшений</span>
            </div>
        `;
    }
    
    html += `
        <div class="section-title">
            <h3>Мои бизнесы</h3>
            <span style="color:#8e8e98;">${gameState.myBusinesses?.length || 0} / ${businessLimit}</span>
        </div>
    `;
    
    if (!gameState.myBusinesses || gameState.myBusinesses.length === 0) {
        html += '<div style="color:#8e8e98; text-align:center; padding:30px;">У вас нет бизнесов</div>';
    } else {
        gameState.myBusinesses.forEach((b, i) => {
            const t = businessTemplates[b.templateId];
            if (!t) return;
            
            const taxItem = gameState.taxes?.find(tax => tax.type === 'business' && tax.id === b.id);
            const taxStatus = taxItem && !taxItem.paid && taxItem.accrued > 0 ? '⚠️' : '';
            
            const managerBonus = b.manager ? b.manager.level * 10 : 0;
            const passBonus = gameState.businessPassUpgraded ? 50 : 0;
            const totalBonus = managerBonus + passBonus;
            const upgrading = b.upgradeEnd && b.upgradeEnd > Date.now();
            const timeLeft = upgrading ? Math.ceil((b.upgradeEnd - Date.now()) / 1000) : 0;
            const progressPercent = upgrading ? ((Date.now() - (b.upgradeEnd - (b.upgradeTime * 1000))) / (b.upgradeTime * 1000)) * 100 : 0;
            
            let totalIncome = b.income;
            if (totalBonus > 0) {
                totalIncome = Math.floor(b.income * (1 + totalBonus / 100));
            }
            
            html += `
                <div class="business-item" onclick="openBusinessModal(${i})">
                    <div class="business-header">
                        <span class="business-name">${b.name} ${taxStatus}</span>
                        <span class="business-level">Ур. ${b.level}/${t.maxLevel}</span>
                    </div>
                    <div class="business-stats">
                        <span>💰 +${formatMoney(totalIncome)}/мин</span>
                        <span>📈 улучшить: ${formatMoney(b.upgradeCost)}</span>
                    </div>
                    ${upgrading ? `
                        <div class="business-progress">
                            <div class="business-progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="upgrade-time">⏱️ Улучшение... ${timeLeft}с</div>
                    ` : ''}
                    ${taxItem ? `
                        <div style="font-size:12px; color:#ff9800; margin:5px 0;">
                            Налог: ${formatMoney(Math.floor(taxItem.accrued))} / ${formatMoney(taxItem.totalAmount)}
                        </div>
                    ` : ''}
                    ${b.manager ? `
                        <div class="manager-info">
                            <span class="manager-level">👔 Менеджер ур.${b.manager.level}</span>
                            <span class="manager-bonus">+${managerBonus}%</span>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }
    
    html += '<button class="card-btn" style="margin-top:16px;" onclick="showBuyBusinessModal()">+ КУПИТЬ БИЗНЕС</button>';
    
    document.getElementById('content').innerHTML = html;
}