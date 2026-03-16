// ========== НАЛОГИ ==========
const Taxes = {
    // Добавление налога
    addTaxItem(type, id, value) {
        const gameState = window.gameState;
        if (!gameState.taxes) gameState.taxes = [];
        
        const existing = gameState.taxes.find(t => t.type === type && t.id === id);
        const totalAmount = Math.floor(value * CONSTANTS.TAX_RATE);
        
        if (existing) {
            existing.value = value;
            existing.totalAmount = totalAmount;
            existing.hourlyRate = totalAmount / 72;
            existing.paid = false;
            existing.accrued = 0;
            existing.dueDate = Date.now() + CONSTANTS.TAX_PERIOD;
            existing.lastUpdate = Date.now();
            return;
        }
        
        gameState.taxes.push({
            type: type,
            id: id,
            value: value,
            totalAmount: totalAmount,
            hourlyRate: totalAmount / 72,
            accrued: 0,
            dueDate: Date.now() + CONSTANTS.TAX_PERIOD,
            paid: false,
            lastUpdate: Date.now()
        });
    },
    
    // Обновление налогов
    updateTaxes() {
        const gameState = window.gameState;
        if (!gameState.taxes) return;
        const now = Date.now();
        
        gameState.taxes.forEach(tax => {
            if (!tax.paid) {
                const timePassed = Math.min(60 * 60 * 1000, now - (tax.lastUpdate || now));
                tax.accrued += (tax.hourlyRate * timePassed) / (60 * 60 * 1000);
                if (tax.accrued > tax.totalAmount) {
                    tax.accrued = tax.totalAmount;
                }
                tax.lastUpdate = now;
            }
        });
    },
    
    // Оплата налога
    payTax(index) {
        const gameState = window.gameState;
        const tax = gameState.taxes[index];
        if (!tax) return false;
        
        const amountToPay = Math.floor(tax.accrued);
        
        if (amountToPay <= 0) {
            alert('❌ НЕТ НАЧИСЛЕННЫХ НАЛОГОВ!');
            return false;
        }
        
        if (gameState.balance < amountToPay) {
            alert('❌ НЕДОСТАТОЧНО МОНЕТ ДЛЯ УПЛАТЫ НАЛОГА!');
            return false;
        }
        
        gameState.balance -= amountToPay;
        
        // ИСПРАВЛЕНО: Налог полностью оплачен
        gameState.taxes.splice(index, 1); // Удаляем оплаченный налог
        
        Storage.saveGame();
        UI.updateHeader();
        UI.renderCurrentTab();
        alert(`✅ Налог оплачен: ${Utils.formatMoney(amountToPay)}`);
        return true;
    },
    
    // Получение статуса налога
    getTaxStatus(taxItem) {
        if (!taxItem) return 'none';
        if (taxItem.paid) return 'paid';
        const timeLeft = taxItem.dueDate - Date.now();
        if (timeLeft < 0) return 'overdue';
        if (timeLeft < 12 * 60 * 60 * 1000) return 'soon';
        return 'normal';
    },
    
    // Получение прогресса налога
    getTaxProgress(taxItem) {
        if (!taxItem) return 0;
        return (taxItem.accrued / taxItem.totalAmount) * 100;
    },
    
    // Получение оставшегося времени
    getTimeLeft(taxItem) {
        if (!taxItem) return 0;
        const timeLeft = taxItem.dueDate - Date.now();
        if (timeLeft < 0) return 0;
        return timeLeft;
    }
};

window.Taxes = Taxes;