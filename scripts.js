window.addEventListener('DOMContentLoaded', (event) => {

    // 1. Seleciona os elementos que vamos usar
    const backgroundVideo = document.getElementById('background-video');
    const stopTriggerSection = document.querySelector('.video-section');

    // 2. Cria uma função para verificar a posição da rolagem
    function checkScroll() {
        // Pega a posição da seção do vídeo explicativo em relação à janela
        const triggerPosition = stopTriggerSection.getBoundingClientRect().top;
        
        // Pega a altura da janela do navegador
        const windowHeight = window.innerHeight;

        // 3. A Lógica: Se o topo da seção do vídeo explicativo estiver
        // na metade superior da tela, pausamos o vídeo de fundo.
        if (triggerPosition < windowHeight / 2) {
            if (!backgroundVideo.paused) {
                backgroundVideo.pause();
            }
        } else {
            // Caso contrário (se rolarmos para cima), damos play no vídeo.
            if (backgroundVideo.paused) {
                backgroundVideo.play();
            }
        }
    }

    // 4. Adiciona um "ouvinte" que executa a função checkScroll toda vez que o usuário rolar a página
    window.addEventListener('scroll', checkScroll);
});