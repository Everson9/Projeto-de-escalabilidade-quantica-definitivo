document.addEventListener('DOMContentLoaded', () => {
    // Seletores dos elementos principais
    const track = document.querySelector('.carousel-track');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    // Verificação para garantir que os elementos existem
    if (!track || !nextButton || !prevButton || !indicatorsContainer) {
        console.error("Um ou mais elementos essenciais do carrossel não foram encontrados. Verifique os IDs e classes no HTML.");
        return;
    }

    // --- CONFIGURAÇÃO INICIAL ---
    const originalCards = Array.from(track.children);
    const totalOriginalCards = originalCards.length;
    if (totalOriginalCards === 0) return; // Não faz nada se não houver cards

    // Clonar os cards para o efeito de loop
    originalCards.forEach(card => {
        track.appendChild(card.cloneNode(true));
    });

    let currentIndex = 0;
    let cardWidth = 0;

    // --- FUNÇÕES PRINCIPAIS ---

    // Função para calcular a largura e configurar a posição inicial
    function setupCarousel() {
        const cardStyle = window.getComputedStyle(track.children[0]);
        const cardMargin = parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
        cardWidth = track.children[0].offsetWidth + cardMargin;
        
        // Reposiciona sem animação no início
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    // Função para mover o carrossel
    function moveTo(index) {
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${index * cardWidth}px)`;
        currentIndex = index;
        updateIndicators();
    }

    // Função para atualizar os pontos indicadores
    function updateIndicators() {
        const dots = Array.from(indicatorsContainer.children);
        const activeIndex = currentIndex % totalOriginalCards;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    nextButton.addEventListener('click', () => {
        // Adiciona a rotação no botão
        nextButton.classList.add('rotate');
        setTimeout(() => nextButton.classList.remove('rotate'), 300); // Remove a rotação após 300ms (duração da transição)
        
        moveTo(currentIndex + 1);

        // Lógica do loop: se chegar ao início dos clones, pula para o começo real
        if (currentIndex === totalOriginalCards) {
            setTimeout(() => {
                track.style.transition = 'none';
                moveTo(0); // Pula para o índice 0
            }, 500); // Tempo da animação
        }
    });

    prevButton.addEventListener('click', () => {
        // Adiciona a rotação no botão
        prevButton.classList.add('rotate');
        setTimeout(() => prevButton.classList.remove('rotate'), 300); // Remove a rotação após 300ms (duração da transição)
        
        // Lógica do loop: se estiver no início, pula para o fim (clone) antes de mover
        if (currentIndex === 0) {
            track.style.transition = 'none';
            moveTo(totalOriginalCards);
            
            // Pequeno delay para o navegador processar o pulo antes de animar
            setTimeout(() => moveTo(totalOriginalCards - 1), 20);
        } else {
            moveTo(currentIndex - 1);
        }
    });

    // --- CRIAÇÃO DOS INDICADORES ---
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalOriginalCards; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            dot.addEventListener('click', () => {
                moveTo(i);
            });
            indicatorsContainer.appendChild(dot);
        }
    }

    // --- INICIALIZAÇÃO ---
    createIndicators();
    setupCarousel(); // Configura a largura e posição inicial
    updateIndicators(); // Ativa o primeiro ponto

    // Recalcula a largura se a janela for redimensionada (para responsividade)
    window.addEventListener('resize', setupCarousel);
});
