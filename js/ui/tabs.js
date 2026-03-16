// ========== УПРАВЛЕНИЕ ВКЛАДКАМИ ==========
const Tabs = {
    // Переключение вкладки
    switchTab(tab) {
        window.currentTab = tab;
        
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.tab === tab) {
                el.classList.add('active');
            }
        });
        
        Renderer.renderCurrentTab();
    },
    
    // Инициализация навигации
    init() {
        document.querySelectorAll('.nav-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }
};

window.Tabs = Tabs;