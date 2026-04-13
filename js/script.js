const telefoneInput = document.querySelector('input[name="telefone"]');
const linksInternos = document.querySelectorAll('a[href^="#"]');
const topo = document.querySelector('.topo');
const formulario = document.querySelector('#formulario');
const feedbackFormulario = document.querySelector('.formulario-feedback');

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function animarScroll(destinoY, duracao = 900, aoFinalizar) {
  const inicioY = window.scrollY;
  const distancia = destinoY - inicioY;
  let inicioTempo = null;

  function passo(tempoAtual) {
    if (!inicioTempo) {
      inicioTempo = tempoAtual;
    }

    const tempoDecorrido = tempoAtual - inicioTempo;
    const progresso = Math.min(tempoDecorrido / duracao, 1);
    const easing = easeInOutCubic(progresso);

    window.scrollTo(0, inicioY + distancia * easing);

    if (progresso < 1) {
      window.requestAnimationFrame(passo);
    } else if (typeof aoFinalizar === 'function') {
      aoFinalizar();
    }
  }

  window.requestAnimationFrame(passo);
}

if (telefoneInput) {
  telefoneInput.addEventListener('input', () => {
    telefoneInput.value = telefoneInput.value.replace(/[A-Za-zÀ-ÿ]/g, '');
  });
}

if (feedbackFormulario) {
  const urlAtual = new URL(window.location.href);
  const status = urlAtual.searchParams.get('status');

  if (status === 'sucesso') {
    feedbackFormulario.textContent = 'Mensagem enviada com sucesso. Em breve entraremos em contato.';
    feedbackFormulario.classList.add('formulario-feedback--sucesso');
  }

  if (status === 'erro') {
    feedbackFormulario.textContent = 'Nao foi possivel enviar sua mensagem agora. Tente novamente em instantes.';
    feedbackFormulario.classList.add('formulario-feedback--erro');
  }
}

linksInternos.forEach((link) => {
  link.addEventListener('click', (event) => {
    const seletor = link.getAttribute('href');

    if (!seletor || seletor === '#') {
      return;
    }

    const destino = document.querySelector(seletor);

    if (!destino) {
      return;
    }

    event.preventDefault();

    const alturaTopo = topo ? topo.offsetHeight : 0;
    const destinoY = destino.getBoundingClientRect().top + window.scrollY - alturaTopo - 12;

    animarScroll(destinoY, 900, () => {
      if (seletor === '#formulario' && formulario) {
        formulario.classList.remove('hero__card--destacado');
        void formulario.offsetWidth;
        formulario.classList.add('hero__card--destacado');
      }
    });
  });
});
