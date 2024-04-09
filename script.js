document.addEventListener('DOMContentLoaded', () => {
    setupTabs('#autoTabPanel', true); // Configuração para guias automáticas
    setupTabs('#manualTabPanel', false); // Configuração para guias manuais
});

function setupTabs(panelId, isAuto) {
    const panel = document.querySelector(panelId);
    const tabs = panel.querySelectorAll('[role="tab"]');
    const tabList = panel.querySelector('.tab-list');

    tabList.addEventListener('keydown', e => navigateTabs(e, tabs, isAuto));
    tabs.forEach(tab => {
        // Adiciona suporte tanto para clique quanto para toque
        tab.addEventListener('click', e => handleInteraction(e, tab, tabs, isAuto));
        tab.addEventListener('touchstart', e => handleInteraction(e, tab, tabs, isAuto));
    });
}

function navigateTabs(e, tabs, isAuto) {
    let newIndex, dir;
    const currentTab = e.target;
    const currentIndex = Array.from(tabs).indexOf(currentTab);

    if (e.key === 'ArrowLeft') dir = -1;
    else if (e.key === 'ArrowRight') dir = 1;

    if (dir !== undefined) {
        newIndex = (currentIndex + dir + tabs.length) % tabs.length;
        e.preventDefault();
        tabs[newIndex].focus();
        if (isAuto) selectTab(tabs[newIndex], tabs, isAuto);
    } else if (e.key === 'Enter' && !isAuto) {
        selectTab(currentTab, tabs, isAuto);
    }
}

function handleInteraction(e, tab, tabs, isAuto) {
    e.preventDefault(); // Previne o comportamento padrão para toque e clique
    selectTab(tab, tabs, isAuto);
}

function selectTab(selectedTab, tabs, isAuto) {
    tabs.forEach(tab => {
        const isSelected = tab === selectedTab;
        tab.setAttribute('aria-selected', isSelected);
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        panel.style.display = isSelected ? 'block' : 'none';
        if (isSelected && !isAuto) {
            // Mover o foco apenas se for necessário no modo manual
            panel.setAttribute('tabindex', '-1');
            panel.focus();
        }
    });
}
