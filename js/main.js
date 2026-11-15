// EXE Smart Cities — interações

// Cabeçalho fica sólido depois que a pessoa rola a página
// e o botão flutuante do WhatsApp aparece depois que ela passa do topo
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const waFloat = document.querySelector('.wa-float');
const onScroll = () => {
  header.classList.toggle('is-solid', window.scrollY > 40);
  waFloat.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * 0.6);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) header.classList.add('is-solid'); else onScroll();
}

toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
});

// Galeria do residencial (abas)
const tabs = [...document.querySelectorAll('.gallery__tabs [role="tab"]')];
const panels = document.querySelectorAll('.gallery__frame [data-panel]');

function selectTab(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
  });
  panels.forEach((img) => img.classList.toggle('is-active', img.dataset.panel === tab.dataset.target));
}

tabs.forEach((tab, i) => {
  tab.tabIndex = i === 0 ? 0 : -1;
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    next.focus();
    selectTab(next);
  });
});

// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

// Pré-análise: valida e abre o WhatsApp com a mensagem montada (nada é salvo no site)
const precheck = document.getElementById('pre-analise');

if (precheck) {
  const WHATSAPP = '5579998906843';

  const showError = (input, show) => {
    const error = document.getElementById(input.id + '-erro');
    input.setAttribute('aria-invalid', String(show));
    if (show) input.setAttribute('aria-describedby', error.id);
    else input.removeAttribute('aria-describedby');
    error.hidden = !show;
  };

  precheck.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true' && input.value.trim()) showError(input, false);
    });
  });

  precheck.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(precheck);

    const invalid = [...precheck.querySelectorAll('[required]')].filter((input) => !input.value.trim());
    precheck.querySelectorAll('[required]').forEach((input) => showError(input, invalid.includes(input)));
    if (invalid.length) { invalid[0].focus(); return; }

    const linhas = [
      `Olá! Meu nome é ${data.get('nome').trim()} e fiz a pré-análise no site.`,
      '',
      `• Renda familiar: ${data.get('renda')}`,
      `• 3 anos ou mais de carteira assinada: ${data.get('fgts') || 'Não informado'}`,
      `• Imóvel no meu nome: ${data.get('imovel') || 'Não informado'}`,
      `• Interesse: ${data.get('interesse')}`,
    ];

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener');
  });
}
