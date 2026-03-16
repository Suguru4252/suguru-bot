// ========== БИЗНЕСЫ ==========
const Businesses = {
    // Покупка бизнеса
    buyBusiness(templateId) {
        const gameState = window.gameState;
        const t = BUSINESS_TEMPLATES.find(t => t.id === templateId);
        if (!t) return;
        
        const totalBusinesses = gameState.myBusinesses ? gameState.myBusinesses.length : 0;
        const businessLimit = gameState.businessSlots || CONSTANTS.MAX_BUSINESSES;
        
        if (totalBusinesses >= businessLimit) {
            alert(`❌ НЕЛЬЗЯ КУПИТЬ БОЛЬШЕ ${businessLimit} БИЗНЕСОВ!`);
            return;
        }
        
        if ((gameState.balance || 0) < t.baseUpgradeCost) {
            alert('❌ НЕДОСТАТОЧНО МОНЕТ!');
            return;
        }
        
        gameState.balance -= t.baseUpgradeCost;
        
        if (!gameState.myBusinesses) gameState.myBusinesses = [];
        
        const newBusiness = {
            id: Utils.generateId(),
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
        
        Taxes.addTaxItem('business', newBusiness.id, t.baseUpgradeCost);
        
        Achievements.checkAchievements();
        Storage.saveGame();
        UI.updateHeader();
        UI.renderCurrentTab();
        alert(`✅ Куплен ${t.name}!`);
    },
    
    // Запуск улучшения
    startUpgrade(index) {
        const gameState = window.gameState;
        const business = gameState.myBusinesses[index];
        if (!business) return;
        
        const t = BUSINESS_TEMPLATES[business.templateId];
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
        
        Storage.saveGame();
        UI.updateHeader();
        UI.renderCurrentTab();
        
        alert(`✅ Улучшение запущено на ${business.upgradeTime || t.upgradeTime} сек.`);
    },
    
    // Завершение улучшения
    completeUpgrade(index) {
        const gameState = window.gameState;
        const business = gameState.myBusinesses[index];
        if (!business) return;
        
        const t = BUSINESS_TEMPLATES[business.templateId];
        if (!t) return;
        
        business.level++;
        business.income = Math.floor(t.baseIncome * Math.pow(t.incomeMultiplier, business.level - 1));
        business.upgradeCost = Math.floor(t.baseUpgradeCost * Math.pow(t.costMultiplier, business.level - 1));
        business.upgradeTime = Math.floor((business.upgradeTime || t.upgradeTime) * 1.3);
        business.upgradeEnd = 0;
        
        const taxItem = gameState.taxes.find(tax => tax.type === 'business' && tax.id === business.id);
        if (taxItem) {
            taxItem.value += (business.upgradeCost || 0) / (t.costMultiplier);
            taxItem.totalAmount = Math.floor(taxItem.value * CONSTANTS.TAX_RATE);
            taxItem.hourlyRate = taxItem.totalAmount / 72;
            taxItem.paid = false;
            taxItem.accrued = 0;
            taxItem.dueDate = Date.now() + CONSTANTS.TAX_PERIOD;
        }
        
        Storage.saveGame();
        UI.updateHeader();
        UI.renderCurrentTab();
    },
    
    // Найм менеджера
    hireManager(index) {
        const gameState = window.gameState;
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
        
        Storage.saveGame();
        UI.updateHeader();
        UI.renderCurrentTab();
        alert(`✅ Менеджер улучшен до ${business.manager.level} уровня! (+${business.manager.level * 10}% прибыли)`);
    },
    
    // Продажа бизнеса
    sellBusiness(index) {
        const gameState = window.gameState;
        const business = gameState.myBusinesses[index];
        if (!business) return;
        
        const t = BUSINESS_TEMPLATES[business.templateId];
        if (!t) return;
        
        const taxItem = gameState.taxes.find(tax => tax.type === 'business' && tax.id === business.id);
        const totalSpent = taxItem ? taxItem.value : t.baseUpgradeCost;
        
        const sellPrice = Math.floor(totalSpent * 0.5);
        const diamondsReturn = Math.floor((business.diamondsSpent || 0) * 0.5);
        
        if (confirm(`Продать ${business.name} за ${Utils.formatMoney(sellPrice)} и вернуть ${diamondsReturn}💎?`)) {
            gameState.myBusinesses.splice(index, 1);
            if (taxItem) {
                const taxIndex = gameState.taxes.findIndex(tax => tax.type === 'business' && tax.id === business.id);
                if (taxIndex !== -1) gameState.taxes.splice(taxIndex, 1);
            }
            gameState.balance += sellPrice;
            gameState.diamonds += diamondsReturn;
            
            Storage.saveGame();
            UI.updateHeader();
            UI.renderCurrentTab();
            alert(`✅ Продано! +${Utils.formatMoney(sellPrice)} и +${diamondsReturn}💎`);
        }
    },
    
    // Улучшение бизнес-пропуска
    upgradeBusinessPass() {
        const gameState = window.gameState;
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
        
        Storage.saveGame();
        UI.updateHeader();
        UI.renderCurrentTab();
        alert('✅ БИЗНЕС ПРОПУСК УЛУЧШЕН! Все улучшения бизнесов теперь дают +50% к прибыли');
    }
};

window.Businesses = Businesses;