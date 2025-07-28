/*
Arquivo: main.js
Versão: 2.0
Responsabilidade: Scripts do Portal Municipal de Heliópolis
Data de Produção: 28/07/2025
Produção owner: Zeh Sobrinho
Sênior Full Stack DevOp: Manus
*/

// Função para mostrar seções
function showSection(sectionId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostra a seção clicada
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Atualiza o botão ativo no menu
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`.nav-item[onclick="showSection('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Salva a seção ativa no localStorage
    localStorage.setItem('activeSection', sectionId);
}

// Função para atualizar countdown
function updateCountdown() {
    const targetDate = new Date('2026-10-04'); // Data das eleições presidenciais de 2026
    const now = new Date();
    const difference = targetDate - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = `Faltam ${days} dias para as eleições presidenciais de 2026`;
    }
}

// Função para animar barras de progresso
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.sprint-progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Função para animar contadores
function animateCounters() {
    const counters = document.querySelectorAll('.metric-value');
    counters.forEach(counter => {
        const target = counter.textContent;
        const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
        
        if (!isNaN(numericTarget) && numericTarget > 0) {
            let current = 0;
            const increment = numericTarget / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericTarget) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString('pt-BR');
                }
            }, 30);
        }
    });
}

// Função para smooth scroll
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Função para detectar scroll e adicionar efeitos
function handleScroll() {
    const cards = document.querySelectorAll('.card, .sprint-card, .document-item');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = cardTop < window.innerHeight - 100;
        
        if (cardVisible) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// Função para inicializar tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Função para validar formulários
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Função para carregar dados dinâmicos
async function loadDynamicData() {
    try {
        // Simular carregamento de dados (em produção, seria uma API real)
        const data = {
            assinaturas: 15847,
            votos_confirmados: 28,
            meta_votos: 35,
            progresso_sprint2: 65
        };
        
        // Atualizar elementos na página
        const assinaturasElement = document.querySelector('.metric-value');
        if (assinaturasElement) {
            assinaturasElement.textContent = data.assinaturas.toLocaleString('pt-BR');
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showNotification('Erro ao carregar dados atualizados', 'error');
    }
}

// Função para inicializar o mapa (se necessário)
function initializeMap() {
    // Placeholder para inicialização de mapa
    // Em produção, integraria com Google Maps ou OpenStreetMap
    console.log('Mapa inicializado');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Restaurar seção ativa do localStorage
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
        showSection(savedSection);
    }
    
    // Inicializar componentes
    updateCountdown();
    animateProgressBars();
    initializeTooltips();
    loadDynamicData();
    
    // Configurar timers
    setInterval(updateCountdown, 3600000); // Atualiza countdown a cada hora
    setInterval(loadDynamicData, 300000); // Atualiza dados a cada 5 minutos
    
    // Configurar scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Animar elementos na primeira carga
    setTimeout(() => {
        animateCounters();
        handleScroll();
    }, 1000);
    
    // Configurar formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this.id)) {
                showNotification('Formulário enviado com sucesso!', 'success');
            } else {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        });
    });
    
    // Configurar botões de ação
    const actionButtons = document.querySelectorAll('.btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showNotification('Funcionalidade em desenvolvimento', 'info');
            }
        });
    });
});

// Função para exportar dados
function exportData(format = 'json') {
    const data = {
        timestamp: new Date().toISOString(),
        projeto: 'Município de Heliópolis',
        sprints: [
            {
                numero: 1,
                nome: 'Preparação e Protocolo',
                status: 'Concluído',
                progresso: 100,
                assinaturas: 15847,
                associacoes: 12,
                vereadores: 8
            },
            {
                numero: 2,
                nome: 'Aprovação Municipal',
                status: 'Em Andamento',
                progresso: 65,
                votos_confirmados: 28,
                meta_votos: 35
            }
        ]
    };
    
    if (format === 'json') {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'heliopolis-dados.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Função para imprimir página
function printPage() {
    window.print();
}

// Função para compartilhar
function shareProject() {
    if (navigator.share) {
        navigator.share({
            title: 'Portal do Município de Heliópolis',
            text: 'Acompanhe o projeto de criação do município de Heliópolis',
            url: window.location.href,
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copiado para a área de transferência!', 'success');
        });
    }
}

// Exportar funções globais
window.showSection = showSection;
window.exportData = exportData;
window.printPage = printPage;
window.shareProject = shareProject;

