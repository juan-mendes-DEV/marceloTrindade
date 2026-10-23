'use strict';

// Toda a interação é local. Não são utilizados pedidos de rede nem armazenamento.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = 'Menu';
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? 'Fechar' : 'Menu';
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  if (menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const galleryItems = [
  { src: 'assets/images/sala.webp', title: 'Luz e amplitude', alt: 'Interior amplo e luminoso com uma paleta de tons naturais' },
  { src: 'assets/images/materiais.webp', title: 'A textura do conforto', alt: 'Sala com tecidos claros, madeira e apontamentos de vegetação' },
  { src: 'assets/images/detalhe.webp', title: 'Equilíbrio no quotidiano', alt: 'Referência de um interior com materiais naturais e acabamentos neutros' }
];
const galleryDialog = document.querySelector('#gallery-dialog');
const galleryImage = document.querySelector('#lightbox-image');
let activeImage = 0;
let galleryOpener = null;
function showImage(index) {
  activeImage = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeImage];
  galleryImage.src = item.src;
  galleryImage.alt = item.alt;
  document.querySelector('#lightbox-title').textContent = item.title;
  document.querySelector('#lightbox-count').textContent = `${activeImage + 1} / ${galleryItems.length}`;
}
document.querySelectorAll('.gallery-trigger').forEach(button => {
  button.addEventListener('click', () => {
    galleryOpener = button;
    showImage(Number(button.dataset.gallery));
    galleryDialog.showModal();
    document.body.classList.add('modal-open');
    galleryDialog.querySelector('.lightbox-close').focus();
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => galleryDialog.close());
document.querySelector('.lightbox-prev').addEventListener('click', () => showImage(activeImage - 1));
document.querySelector('.lightbox-next').addEventListener('click', () => showImage(activeImage + 1));
galleryDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (galleryOpener) galleryOpener.focus({ preventScroll: true });
});
galleryDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showImage(activeImage + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

const demoForm = document.querySelector('#demo-form');
const result = document.querySelector('#form-result');
const fieldMessages = {
  nome: 'Introduza um nome de exemplo.',
  localidade: 'Indique uma localidade de exemplo.',
  tipo: 'Selecione um tipo de intervenção.',
  descricao: 'Descreva um projeto de exemplo.'
};
const formFields = Object.keys(fieldMessages).map(id => document.getElementById(id));
function validateField(field) {
  const valid = field.value.trim().length > 0 && field.validity.valid;
  field.setAttribute('aria-invalid', String(!valid));
  document.getElementById(`${field.id}-error`).textContent = valid ? '' : fieldMessages[field.id];
  return valid;
}
formFields.forEach(field => {
  field.addEventListener('input', () => {
    result.textContent = '';
    if (field.hasAttribute('aria-invalid')) validateField(field);
  });
});
demoForm.addEventListener('submit', event => {
  event.preventDefault();
  result.textContent = '';
  let firstInvalid = null;
  formFields.forEach(field => {
    if (!validateField(field) && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }
  demoForm.reset();
  formFields.forEach(field => field.removeAttribute('aria-invalid'));
  result.textContent = 'Simulação concluída. Nenhum dado foi enviado ou guardado.';
});
// Impede a reposição dos valores de demonstração ao regressar à página.
window.addEventListener('pageshow', () => demoForm.reset());
