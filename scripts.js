// =======================================================
// SCRIPT PARA ANIMAR O TÍTULO DA SEÇÃO DE COMPARAÇÃO
// =======================================================

// Aguarda o conteúdo da página ser totalmente carregado
window.addEventListener('DOMContentLoaded', (event) => {
    
    // Seleciona o título que queremos animar
    const stickyTitle = document.querySelector('.comparison-section h2');

    // Se o título não existir na página, não faz nada.
    if (!stickyTitle) {
        return;
    }

    // Cria um 'observador' que vai vigiar o título
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Se o título estiver visível na tela...
            if (entry.isIntersecting) {
                // ...adiciona a classe 'is-visible' para iniciar a animação do CSS...
                stickyTitle.classList.add('is-visible');
                // ...e para de observar para economizar recursos.
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // A animação começa quando 10% do título estiver visível
    });

    // Inicia a observação do título
    observer.observe(stickyTitle);
    
});