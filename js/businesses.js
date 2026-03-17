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
    
    // ИСПРАВЛЕНО: понятное сообщение о покупке
    alert(`✅ ВЫ КУПИЛИ БИЗНЕС: ${t.name}\n\n💰 Стоимость: ${formatMoney(t.baseUpgradeCost)}\n📈 Доход: +${formatMoney(t.baseIncome * 60)}/мин`);
}