// script.js
document.addEventListener('DOMContentLoaded', () => {
    setupTabs('.auto', true); // Configuração do painel automático
    setupManualTabs('.manual'); // Configuração corrigida do painel manual
});

function setupTabs(panelSelector, isAuto) {
    const panel = document.querySelector(panelSelector);
    const tabs = panel.querySelectorAll('[role="tab"]');
    const tabList = panel.querySelector('.tab-list');

    tabList.addEventListener('keydown', e => {
        const currentTab = tabList.querySelector('[tabindex="0"]');
        let index = Array.prototype.indexOf.call(tabs, currentTab);
        let dir = null;

        if (e.key === 'ArrowLeft') { dir = -1; }
        else if (e.key === 'ArrowRight') { dir = 1; }

        if (dir !== null) {
            e.preventDefault();
            index = (index + dir + tabs.length) % tabs.length;
            tabs[index].focus();
            tabs[index].setAttribute('aria-selected', 'true');
            currentTab.setAttribute('aria-selected', 'false');

            if (isAuto) {
                changeTabFocus(tabs, index);
                showTabPanel(tabs[index]);
            }
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('focus', () => {
            if (isAuto) {
                showTabPanel(tab);
            }
        });
    });
}

function setupManualTabs(panelSelector) {
    const panel = document.querySelector(panelSelector);
    const tabs = panel.querySelectorAll('[role="tab"]');
    const tabList = panel.querySelector('.tab-list');

    tabList.addEventListener('keydown', e => {
        const currentTab = tabList.querySelector('[tabindex="0"]');
        let index = Array.prototype.indexOf.call(tabs, currentTab);

        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
            let dir = e.key === 'ArrowLeft' ? -1 : 1;
            e.preventDefault();
            index = (index + dir + tabs.length) % tabs.length;
            tabs[index].focus();
            tabs[index].setAttribute('aria-selected', 'true');
            currentTab.setAttribute('aria-selected', 'false');
            changeTabFocus(tabs, index); // Ajuste para manter a consistência com o foco
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (!tabs[index].hasAttribute('aria-selected') || tabs[index].getAttribute('aria-selected') === 'false') {
                changeTabFocus(tabs, index);
            }
            showTabPanel(currentTab, true); // Mover o foco para o conteúdo da guia
        }
    });
}

function changeTabFocus(tabs, newIndex) {
    tabs.forEach((tab, index) => {
        tab.tabIndex = index === newIndex ? 0 : -1;
        tab.setAttribute('aria-selected', index === newIndex ? 'true' : 'false');
    });
}

function showTabPanel(tab, moveFocus = false) {
    const panelId = tab.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    tab.closest('.tab-panel').querySelectorAll('.tab-content').forEach(p => {
        p.hidden = true;
    });
    panel.hidden = false;

    if (moveFocus) {
        panel.setAttribute('tabindex', '-1');
        panel.focus();
    }
}
