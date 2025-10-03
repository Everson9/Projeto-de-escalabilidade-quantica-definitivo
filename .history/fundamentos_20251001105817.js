document.addEventListener('DOMContentLoaded', () => {
    // Seletores dos elementos principais
    const wrapper = document.querySelector('.carousel-wrapper'); // Wrapper para pausar no hover
    const track = document.querySelector('.carousel-track');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    // Verificação para garantir que os elementos existem
    if (!wrapper || !track || !nextButton || !prevButton || !indicatorsContainer) {
        console.error("Um ou mais elementos essenciais do carrossel não foram encontrados.");
        return;
    }

    // --- CONFIGURAÇÃO INICIAL ---
    const originalCards = Array.from(track.children);
    const totalOriginalCards = originalCards.length;
    if (totalOriginalCards === 0) return;

    // Clonar os cards para o efeito de loop
    originalCards.forEach(card => {
        track.appendChild(card.cloneNode(true));
    });

    let currentIndex = 0;
    let cardWidth = 0;
    let autoplayInterval = null; // Variável para controlar o autoplay

    // --- FUNÇÕES PRINCIPAIS ---

    function setupCarousel() {
        const cardStyle = window.getComputedStyle(track.children[0]);
        const cardMargin = parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
        cardWidth = track.children[0].offsetWidth + cardMargin;
        
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function moveTo(index, isAutoplay = false) {
        // Se o movimento não for do autoplay, reinicia o timer
        if (!isAutoplay) {
            resetAutoplay();
        }

        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${index * cardWidth}px)`;
        currentIndex = index;

        // Lógica do loop: se chegar ao início dos clones, pula para o começo real
        if (currentIndex >= totalOriginalCards) {
            // Espera a animação terminar para pular de volta
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = `translateX(0px)`;
                updateIndicators();
            }, 500); // Tempo da animação
        }
        updateIndicators();
    }

    function updateIndicators() {
        const dots = Array.from(indicatorsContainer.children);
        const activeIndex = currentIndex % totalOriginalCards;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    // --- LÓGICA DO AUTOPLAY ---

    function startAutoplay() {
        // Garante que não haja múltiplos intervalos rodando
        if (autoplayInterval) clearInterval(autoplayInterval);
        
        autoplayInterval = setInterval(() => {
            moveTo(currentIndex + 1, true); // O 'true' indica que é um movimento de autoplay
        }, 3000); // Muda de slide a cada 3 segundos (3000 ms)
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // --- EVENT LISTENERS (CLIQUES E HOVER) ---

    nextButton.addEventListener('click', () => {
        moveTo(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        // Lógica para voltar: precisa pular para o fim antes de animar
        if (currentIndex === 0) {
            track.style.transition = 'none';
            currentIndex = totalOriginalCards;
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            setTimeout(() => {
                moveTo(currentIndex - 1);
            }, 20);
        } else {
            moveTo(currentIndex - 1);
        }
    });

    // Pausa o autoplay quando o mouse está sobre o carrossel
    wrapper.addEventListener('mouseenter', stopAutoplay);
    // Retoma o autoplay quando o mouse sai
    wrapper.addEventListener('mouseleave', startAutoplay);


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
    setupCarousel();
    updateIndicators();
    startAutoplay(); // Inicia o autoplay assim que a página carrega

    window.addEventListener('resize', () => {
        setupCarousel();
        resetAutoplay();
    });
});
