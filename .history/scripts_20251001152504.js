// Aguarda o conteúdo da página ser totalmente carregado
window.addEventListener('DOMContentLoaded', (event) => {

    // =======================================================
    // SCRIPT PARA ANIMAR O TÍTULO STICKY (ENTRADA E SAÍDA)
    // =======================================================

    // 1. Seleciona os elementos que vamos usar
    const stickyTitle = document.querySelector('.comparison-section h2');
    const footer = document.querySelector('.site-footer'); // Nosso novo gatilho de SAÍDA

    // Se algum dos elementos não existir, não faz nada para evitar erros.
    if (!stickyTitle || !footer) {
        return;
    }

    // --- OBSERVADOR 1: Para a animação de ENTRADA do título ---
    // Este observador só vai rodar UMA VEZ.
    const entryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Se o título estiver visível na tela...
            if (entry.isIntersecting) {
                // ...adiciona a classe para ele aparecer...
                stickyTitle.classList.add('is-visible');
                // ...e para de observar para não rodar de novo.
                entryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // A animação começa quando 10% do título estiver visível
    });

    // Inicia a observação do TÍTULO para a animação de entrada
    entryObserver.observe(stickyTitle);


    // --- OBSERVADOR 2: Para a animação de SAÍDA do título ---
    // Este observador fica ativo o tempo todo, vigiando o rodapé.
    const exitObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Se o RODAPÉ estiver visível na tela...
            if (entry.isIntersecting) {
                // ...REMOVE a classe do título para ele desaparecer.
                stickyTitle.classList.remove('is-visible');
            } else {
                // Se o RODAPÉ NÃO estiver visível (rolamos para cima)...
                // ...ADICIONA a classe de volta para o título reaparecer.
                stickyTitle.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Aciona quando 10% do rodapé estiver visível
    });

    // Inicia a observação do RODAPÉ para a animação de saída
    exitObserver.observe(footer);


    // --- Lógica de Transição de Página ---

// Função que será executada quando a página carregar
window.addEventListener('load', () => {
    const overlay = document.querySelector('.page-transition-overlay');
    // Esconde o overlay para revelar a página (efeito fade in)
    overlay.classList.remove('is-active');
});

// Adiciona a classe 'is-active' ao overlay antes da página ser descarregada
// Isso garante o efeito de fade-in na chegada.
window.addEventListener('pageshow', (event) => {
    const overlay = document.querySelector('.page-transition-overlay');
    overlay.classList.add('is-active');
});


// Intercepta todos os cliques em links
document.addEventListener('click', (e) => {
    // Verifica se o clique foi em um link (<a>) que não abre em nova aba
    const link = e.target.closest('a');
    if (link && link.target !== '_blank' && !link.href.startsWith('#')) {
        e.preventDefault(); // Impede a navegação imediata

        const overlay = document.querySelector('.page-transition-overlay');
        const destination = link.href;

        // Ativa o overlay (efeito fade out)
        overlay.classList.add('is-active');

        // Espera a animação do overlay terminar para então navegar
        setTimeout(() => {
            window.location.href = destination;
        }, 500); // Duração igual à transição do CSS (0.5s)
    }
});
