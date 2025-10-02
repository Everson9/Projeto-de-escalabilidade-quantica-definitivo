document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.carousel-wrapper');
    const track = document.querySelector('.carousel-track');
    let cards = Array.from(track.children);
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');

    // --- Configuração do Carrossel Infinito ---
    const cardsToClone = cards.slice(0, 4); // Clona os 4 primeiros cards
    cardsToClone.forEach(card => {
        track.appendChild(card.cloneNode(true));
    });
    const cardsToPrepend = cards.slice(-4); // Clona os 4 últimos originais
    cardsToPrepend.reverse().forEach(card => {
        track.prepend(card.cloneNode(true));
    });

    cards = Array.from(track.children); // Atualiza a lista de cards
    const cardWidth = cards[0].getBoundingClientRect().width + 40; // 240px + 40px de margem
    const originalCardsCount = cards.length / 3;

    let currentIndex = originalCardsCount; // Começa nos primeiros cards reais
    let autoScrollInterval;

    // Função para posicionar a trilha sem animação (para os "pulos")
    const setPosition = (index) => {
        track.style.transition = 'none';
        track.style.transform = `translateX(${-index * cardWidth}px)`;
    };

    // Função para mover a trilha com animação
    const moveTrack = () => {
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    };

    // Inicia na posição correta
    setPosition(currentIndex);

    // --- Lógica de Transição Infinita ---
    track.addEventListener('transitionend', () => {
        if (currentIndex >= originalCardsCount * 2) { // Chegou ao fim dos clones da direita
            currentIndex = originalCardsCount;
            setPosition(currentIndex);
        }
        if (currentIndex <= originalCardsCount - 1) { // Chegou ao fim dos clones da esquerda
            currentIndex = originalCardsCount * 2 - 1;
            setPosition(currentIndex);
        }
    });

    // --- Funções de Navegação ---
    const moveToNext = () => {
        currentIndex++;
        moveTrack();
    };

    const moveToPrev = () => {
        currentIndex--;
        moveTrack();
    };

    // --- Rolagem Automática ---
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(moveToNext, 3000); // Muda de card a cada 3 segundos
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    // --- Event Listeners ---
    nextButton.addEventListener('click', moveToNext);
    prevButton.addEventListener('click', moveToPrev);

    // Pausa a rolagem automática quando o mouse está sobre o carrossel
    wrapper.addEventListener('mouseenter', stopAutoScroll);
    // Retoma a rolagem automática quando o mouse sai
    wrapper.addEventListener('mouseleave', startAutoScroll);

    // Inicia a rolagem automática
    startAutoScroll();
});
