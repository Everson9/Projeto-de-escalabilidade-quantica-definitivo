document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    if (!track || !track.children.length) {
        console.error("Elemento do carrossel ou cards não encontrados.");
        return;
    }

    let originalCards = Array.from(track.children);
    let totalOriginalCards = originalCards.length;
    let currentIndex = 0;

    // --- 1. LÓGICA DE CLONAGEM E RESPONSIVIDADE ---
    let cardWidth;

    function setupCarousel() {
        // Clonar cards para o efeito de loop infinito
        track.innerHTML = ''; // Limpa o track antes de re-popular
        const clonesEnd = originalCards.map(card => card.cloneNode(true));
        const clonesStart = originalCards.map(card => card.cloneNode(true));
        
        clonesStart.forEach(clone => track.appendChild(clone));
        originalCards.forEach(card => track.appendChild(card));
        clonesEnd.forEach(clone => track.appendChild(clone));

        // Calcular a largura do card (incluindo margens)
        const cardStyle = window.getComputedStyle(track.children[0]);
        const cardMarginRight = parseFloat(cardStyle.marginRight);
        const cardMarginLeft = parseFloat(cardStyle.marginLeft);
        cardWidth = track.children[0].offsetWidth + cardMarginLeft + cardMarginRight;

        // Posicionar no início correto (após os clones iniciais)
        currentIndex = totalOriginalCards;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        track.style.transition = 'none'; // Sem animação no setup inicial
    }

    // --- 2. LÓGICA DOS INDICADORES (PONTOS) ---
    function setupIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalOriginalCards; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            dot.addEventListener('click', () => {
                // Move para o card correspondente
                currentIndex = totalOriginalCards + i;
                updatePosition();
                updateIndicators();
            });
            indicatorsContainer.appendChild(dot);
        }
    }

    function updateIndicators() {
        const dots = Array.from(indicatorsContainer.children);
        dots.forEach((dot, index) => {
            // O índice real é o `currentIndex` menos o número de clones no início
            const activeIndex = (currentIndex - totalOriginalCards + totalOriginalCards) % totalOriginalCards;
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // --- FUNÇÕES DE MOVIMENTO ---
    function updatePosition() {
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function moveToNext() {
        currentIndex++;
        updatePosition();
        if (currentIndex >= totalOriginalCards * 2) {
            // Se chegou ao fim dos clones, reseta para o início
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = totalOriginalCards;
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }, 500);
        }
        updateIndicators();
    }

    function moveToPrev() {
        currentIndex--;
        updatePosition();
        if (currentIndex < totalOriginalCards) {
            // Se chegou ao início dos clones, reseta para o fim
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = totalOriginalCards * 2 - 1;
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }, 500);
        }
        updateIndicators();
    }

    // --- 3. LÓGICA DE ARRASTAR (DRAG/SWIPE) ---
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function dragStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        prevTranslate = -currentIndex * cardWidth;
        track.classList.add('grabbing');
        track.style.transition = 'none'; // Remove transição durante o arrasto
    }

    function dragMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd(event) {
        if (!isDragging) return;
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        track.classList.remove('grabbing');

        // Se moveu mais de 20% da largura do card, passa para o próximo/anterior
        if (movedBy < -cardWidth * 0.2) {
            moveToNext();
        } else if (movedBy > cardWidth * 0.2) {
            moveToPrev();
        } else {
            // Se não, volta para a posição original
            updatePosition();
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // --- INICIALIZAÇÃO E EVENT LISTENERS ---
    function initialize() {
        setupCarousel();
        setupIndicators();
        updateIndicators();

        // Event listeners para setas
        nextButton.addEventListener('click', moveToNext);
        prevButton.addEventListener('click', moveToPrev);

        // Event listeners para arrastar (mouse e toque)
        track.addEventListener('mousedown', dragStart);
        track.addEventListener('touchstart', dragStart, { passive: true });
        track.addEventListener('mousemove', dragMove);
        track.addEventListener('touchmove', dragMove, { passive: true });
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('mouseleave', dragEnd);
        track.addEventListener('touchend', dragEnd);

        // Recalcular tudo se a janela for redimensionada (RESPONSIVIDADE)
        window.addEventListener('resize', initialize);
    }

    initialize();
});