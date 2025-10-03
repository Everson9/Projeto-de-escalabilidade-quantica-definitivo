document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');

    // Largura de um card + margem (240px + 20px + 20px)
    const cardWidth = cards[0].getBoundingClientRect().width + 40;

    let currentIndex = 0;
    const totalCards = cards.length / 2; // Número de cards originais

    // Função para mover a trilha
    function moveToCard(index) {
        track.style.transform = 'translateX(' + (-index * cardWidth) + 'px)';
    }

    // Event listener para o botão "Próximo"
    nextButton.addEventListener('click', () => {
        currentIndex++;
        track.style.transition = "transform 0.5s ease-in-out"; // Habilita a transição
        moveToCard(currentIndex);

        // Se chegarmos ao início dos cards duplicados,
        // resetamos para o início sem animação.
        if (currentIndex === totalCards) {
            setTimeout(() => {
                track.style.transition = "none"; // Desabilita a transição para o pulo
                currentIndex = 0;
                moveToCard(currentIndex);
            }, 500); // Deve ser igual à duração da transição do CSS
        }
    });

    // Event listener para o botão "Anterior"
    prevButton.addEventListener('click', () => {
        if (currentIndex === 0) {
            // Se estivermos no início, pulamos para o final (clone) sem animação
            track.style.transition = "none";
            currentIndex = totalCards;
            moveToCard(currentIndex);
        }

        // A pequena espera (setTimeout) garante que o navegador processe o pulo
        // antes de iniciar a animação de volta.
        setTimeout(() => {
            track.style.transition = "transform 0.5s ease-in-out";
            currentIndex--;
            moveToCard(currentIndex);
        }, 10);
    });
});
