// ========== БИЗНЕСЫ ==========
function buyBusiness(templateId) {
    const t = businessTemplates.find(t => t.id === templateId);
    if (!t) return;
    
    const totalBusinesses = gameState.myBusinesses ? gameState.myBusinesses.length : 0;
    
    if (totalBusinesses >= MAX_BUSINESSES) {
        alert(`❌ НЕЛЬЗЯ КУПИТЬ БОЛЬШЕ ${MAX_BUSINESSES} БИЗНЕСОВ!`);
        return;
    }
    
    if ((gameState.balance || 0) < t.baseUpgradeCost) {
        alert('❌ НЕДОСТАТОЧНО МОНЕТ!');
        return;
    }
    
    gameState.balance -= t.baseUpgradeCost;
    
    if (!gameState.myBusinesses) gameState.myBusinesses = [];
    
    const newBusiness = {
        id: Date.now() + Math.random(),
        templateId: templateId,
        name: t.name,
        level: 1,
        income: t.baseIncome,
        upgradeCost: Math.floor(t.baseUpgradeCost * t.costMultiplier),
        upgradeTime: t.upgradeTime,
        upgradeEnd: 0,
        manager: null,
        totalEarned: 0,
        incomeMultiplier: t.incomeMultiplier,
        costMultiplier: t.costMultiplier,
        diamondsSpent: 0
    };
    
    gameState.myBusinesses.push(newBusiness);
    
    addTaxItem('business', newBusiness.id, t.baseUpgradeCost);
    
    checkAchievements();
    saveGame();
    updateUI();
    renderBusiness();
    alert(`✅ Куплен ${t.name}!`);
}

function startUpgrade(index) {
    const business = gameState.myBusinesses[index];
    if (!business) return;
    
    const t = businessTemplates[business.templateId];
    if (!t) return;
    
    if ((business.level || 1) >= t.maxLevel) {
        alert('❌ МАКСИМАЛЬНЫЙ УРОВЕНЬ!');
        return;
    }
    
    if (business.upgradeEnd && business.upgradeEnd > Date.now()) {
        alert('⏱️ УЛУЧШЕНИЕ УЖЕ ИДЕТ!');
        return;
    }
    
    if ((gameState.balance || 0) < (business.upgradeCost || 0)) {
        alert('❌ НЕДОСТАТОЧНО МОНЕТ!');
        return;
    }
    
    gameState.balance -= (business.upgradeCost || 0);
    
    business.upgradeEnd = Date.now() + ((business.upgradeTime || t.upgradeTime) * 1000);
    
    saveGame();
    updateUI();
    renderBusiness();
    
    alert(`✅ Улучшение запущено на ${business.upgradeTime || t.upgradeTime} сек.`);
}

function completeUpgrade(index) {
    const business = gameState.myBusinesses[index];
    if (!business) return;
    
    const t = businessTemplates[business.templateId];
    if (!t) return;
    
    business.level++;
    business.income = Math.floor(t.baseIncome * Math.pow(t.incomeMultiplier, business.level - 1));
    business.upgradeCost = Math.floor(t.baseUpgradeCost * Math.pow(t.costMultiplier, business.level - 1));
    business.upgradeTime = Math.floor((business.upgradeTime || t.upgradeTime) * 1.3);
    business.upgradeEnd = 0;
    
    const taxItem = gameState.taxes.find(tax => tax.type === 'business' && tax.id === business.id);
    if (taxItem) {
        taxItem.value += (business.upgradeCost || 0) / (t.costMultiplier);
        taxItem.totalAmount = Math.floor(taxItem.value * TAX_RATE);
        taxItem.hourlyRate = taxItem.totalAmount / 72;
        taxItem.paid = false;
        taxItem.accrued = 0;
        taxItem.dueDate = Date.now() + TAX_PERIOD;
    }
    
    saveGame();
    updateUI();
    renderBusiness();
}

function hireManager(index) {
    const business = gameState.myBusinesses[index];
    if (!business) return;
    
    if (business.manager && business.manager.level >= 10) {
        alert('❌ МАКСИМАЛЬНЫЙ УРОВЕНЬ МЕНЕДЖЕРА!');
        return;
    }
    
    const cost = 50;
    
    if (gameState.diamonds < cost) {
        alert('❌ НУЖНО 50 АЛМАЗОВ!');
        return;
    }
    
    gameState.diamonds -= cost;
    business.diamondsSpent = (business.diamondsSpent || 0) + cost;
    
    if (!business.manager) {
        business.manager = { level: 1 };
    } else {
        business.manager.level++;
    }
    
    saveGame();
    updateUI();
    renderBusiness();
    alert(`✅ Менеджер улучшен до ${business.manager.level} уровня! (+${business.manager.level * 10}% прибыли)`);
}

function sellBusiness(index) {
    const business = gameState.myBusinesses[index];
    if (!business) return;
    
    const t = businessTemplates[business.templateId];
    if (!t) return;
    
    const taxItem = gameState.taxes.find(tax => tax.type === 'business' && tax.id === business.id);
    const totalSpent = taxItem ? taxItem.value : t.baseUpgradeCost;
    
    const sellPrice = Math.floor(totalSpent * 0.5);
    const diamondsReturn = Math.floor((business.diamondsSpent || 0) * 0.5);
    
    if (confirm(`Продать ${business.name} за ${formatMoney(sellPrice)} и вернуть ${diamondsReturn}💎?`)) {
        gameState.myBusinesses.splice(index, 1);
        if (taxItem) {
            const taxIndex = gameState.taxes.findIndex(tax => tax.type === 'business' && tax.id === business.id);
            if (taxIndex !== -1) gameState.taxes.splice(taxIndex, 1);
        }
        gameState.balance += sellPrice;
        gameState.diamonds += diamondsReturn;
        
        saveGame();
        updateUI();
        renderBusiness();
        alert(`✅ Продано! +${formatMoney(sellPrice)} и +${diamondsReturn}💎`);
    }
}

function upgradeBusinessPass() {
    if (gameState.businessPassUpgraded) {
        alert('❌ ПРОПУСК УЖЕ УЛУЧШЕН!');
        return;
    }
    
    if (gameState.diamonds < 500) {
        alert('❌ НУЖНО 500 АЛМАЗОВ!');
        return;
    }
    
    gameState.diamonds -= 500;
    gameState.businessPassUpgraded = true;
    
    saveGame();
    updateUI();
    renderBusiness();
    alert('✅ БИЗНЕС ПРОПУСК УЛУЧШЕН! Все улучшения бизнесов теперь дают +50% к прибыли');
}

function renderBusiness() {
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
            const taxItem = gameState.taxes.find(tax => tax.type === 'business' && tax.id === b.id);
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

function showBuyBusinessModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    const totalBusinesses = gameState.myBusinesses ? gameState.myBusinesses.length : 0;
    const businessLimit = gameState.businessSlots || MAX_BUSINESSES;
    
    let html = '<div class="modal-title">🏪 КУПИТЬ БИЗНЕС</div>';
    
    if (totalBusinesses >= businessLimit) {
        html += `
            <div style="background:rgba(255,68,68,0.1); border:1px solid #ff4444; border-radius:16px; padding:16px; margin-bottom:16px; text-align:center;">
                <span style="color:#ff4444;">⚠️ МАКСИМУМ ${businessLimit} БИЗНЕСОВ!</span>
            </div>
        `;
    }
    
    businessTemplates.forEach(t => {
        html += `
            <div style="background:#0f1117; border-radius:16px; padding:16px; margin-bottom:8px; cursor:${totalBusinesses >= businessLimit ? 'not-allowed' : 'pointer'}; opacity:${totalBusinesses >= businessLimit ? '0.5' : '1'};"
                 onclick="${totalBusinesses >= businessLimit ? '' : 'buyBusiness(' + t.id + '); closeModal(\'modal\');'}">
                <div style="display:flex; justify-content:space-between;">
                    <span style="font-weight:600;">${t.name}</span>
                    <span style="color:#4caf50;">${formatMoney(t.baseUpgradeCost)}</span>
                </div>
                <div style="font-size:13px; color:#8e8e98; margin-top:4px;">
                    💰 +${formatMoney(t.baseIncome * 60)}/мин
                </div>
            </div>
        `;
    });
    
    html += '<div class="close-btn" onclick="closeModal(\'modal\')">ЗАКРЫТЬ</div>';
    
    modalContent.innerHTML = html;
    modal.classList.add('active');
}

function openBusinessModal(index) {
    const business = gameState.myBusinesses[index];
    if (!business) return;
    
    const t = businessTemplates[business.templateId];
    const taxItem = gameState.taxes.find(tax => tax.type === 'business' && tax.id === business.id);
    
    let totalSpent = taxItem ? taxItem.value : t.baseUpgradeCost;
    
    const sellPrice = Math.floor(totalSpent * 0.5);
    const diamondsReturn = Math.floor((business.diamondsSpent || 0) * 0.5);
    const managerBonus = business.manager ? business.manager.level * 10 : 0;
    const passBonus = gameState.businessPassUpgraded ? 50 : 0;
    const totalBonus = managerBonus + passBonus;
    
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    let totalIncome = business.income;
    if (totalBonus > 0) {
        totalIncome = Math.floor(business.income * (1 + totalBonus / 100));
    }
    
    let content = `
        <div class="modal-title">${business.name}</div>
        <div style="background:#0f1117; border-radius:16px; padding:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>Уровень</span>
                <span style="color:#ffd700;">${business.level}/${t.maxLevel}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>Базовая прибыль</span>
                <span style="color:#4caf50;">+${formatMoney(business.income)}/мин</span>
            </div>
            ${totalBonus > 0 ? `
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                    <span>Итого прибыль</span>
                    <span style="color:#4caf50;">+${formatMoney(totalIncome)}/мин</span>
                </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>Заработано</span>
                <span style="color:#ffd700;">${formatMoney(business.totalEarned || 0)}</span>
            </div>
            ${taxItem ? `
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                    <span>Налог накоплен</span>
                    <span style="color:${taxItem.paid ? '#4caf50' : '#ff4444'};">
                        ${formatMoney(Math.floor(taxItem.accrued))} / ${formatMoney(taxItem.totalAmount)}
                    </span>
                </div>
            ` : ''}
    `;
    
    if ((business.level || 1) < t.maxLevel) {
        if (business.upgradeEnd && business.upgradeEnd > Date.now()) {
            const timeLeft = Math.ceil((business.upgradeEnd - Date.now()) / 1000);
            content += `
                <div style="color:#ff9800; text-align:center; margin:12px 0;">
                    ⏱️ Улучшение... ${timeLeft}с
                </div>
            `;
        } else {
            content += `
                <button class="card-btn" style="margin-top:12px;" onclick="startUpgrade(${index}); closeModal('modal');">
                    🚀 Улучшить (${formatMoney(business.upgradeCost || 0)}) - ${business.upgradeTime || t.upgradeTime}с
                </button>
            `;
        }
    }
    
    content += `
        <button class="card-btn" style="margin-top:8px; background:#7b1fa2;" onclick="hireManager(${index}); closeModal('modal');">
            👔 Улучшить менеджера (50💎) ${business.manager ? `ур.${business.manager.level}/10` : ''}
        </button>
        <button class="card-btn" style="margin-top:8px; background:#ff9800;" onclick="sellBusiness(${index}); closeModal('modal');">
            Продать (${formatMoney(sellPrice)} + ${diamondsReturn}💎)
        </button>
        </div>
        <div class="close-btn" onclick="closeModal('modal')">ЗАКРЫТЬ</div>
    `;
    
    modalContent.innerHTML = content;
    modal.classList.add('active');
}