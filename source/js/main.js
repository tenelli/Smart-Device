import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)

// https://webkaa.ru/javascript/maska-nomera-telefona-js

// маска
document.addEventListener('DOMContentLoaded', function () {
  const onEventCallback = function (evt) {
    const el = evt.target;
    const clearVal = el.dataset.phoneClear;
    const pattern = el.dataset.phonePattern;
    const matrixDef = '+7(___) ___-__-__';
    const matrix = pattern ? pattern : matrixDef;
    const def = matrix.replace(/\D/g, '');
    let i = 0;
    let val = evt.target.value.replace(/\D/g, '');
    if (clearVal !== 'false' && evt.type === 'blur') {
      if (val.length < matrix.match(/([\_\d])/g).length) {
        evt.target.value = '';
        return;
      }
    }
    if (def.length >= val.length) {
      val = def;
    }
    evt.target.value = matrix.replace(/./g, function (a) {
      if (/[_\d]/.test(a) && i < val.length) {
        return val.charAt(i++);
      } else if (i >= val.length) {
        return '';
      }
      return a;
    });
  };
  let phoneInputs = document.querySelectorAll('[data-phone-pattern]');
  for (let elem of phoneInputs) {
    for (let ev of ['input', 'blur', 'focus']) {
      elem.addEventListener(ev, onEventCallback);
    }
  }
});

// показываем дополнительный текст в блоке "О компании"
let moreButton = document.querySelector('.about__more-button');
let additional = document.querySelectorAll('.about__additional');
additional.forEach((element) => {
  element.classList.add('visually-hidden');
});

if (moreButton) {
  moreButton.classList.remove('no-js__button');
  additional.forEach((element) => {
    element.classList.remove('no-js');
  });
  moreButton.addEventListener('click', showMore);
}

function showMore() {
  moreButton.classList.toggle('closed');
  if (!moreButton.classList.contains('closed')) {
    moreButton.textContent = 'Скрыть';
    additional.forEach((element) => {
      element.classList.remove('visually-hidden');
    });
  } else {
    moreButton.textContent = 'Подробнее';
    additional.forEach((element) => {
      element.classList.add('visually-hidden');
    });
  }
}

let acc = document.querySelectorAll('.accordion');
let panel = document.querySelectorAll('.panel');
if (acc && panel) {
  acc.forEach((element) => {
    if (element.classList.contains('no-js')) {
      element.classList.remove('no-js');
    }
  });

  panel.forEach((element) => {
    if (element.classList.contains('no-js')) {
      element.classList.remove('no-js');
    }
  });


  acc.forEach((element) => {
    element.addEventListener('click', () => {
      let setClasses = !element.classList.contains('active');
      setClass(acc, 'active', 'remove');
      setClass(panel, 'show', 'remove');

      if (setClasses) {
        element.classList.toggle('active');
        element.nextElementSibling.classList.toggle('show');
      }
    });
  });
}

function setClass(els, className, fnName) {
  for (let i = 0; i < els.length; i++) {
    els[i].classList[fnName](className);
  }
}

let order = document.querySelector('.order');
let modal = document.querySelector('.modal');
let closeButton = document.querySelector('.modal__close-button');
let pageBody = document.body;

const userNameInputOnModal = document.querySelector('[data-input-username]');

if (order) {
  order.addEventListener('click', modalOpen);
}

function isEscapeKey(evt) {
  return evt.key === 'Escape';
}


function closeModal() {
  modal.classList.add('visually-hidden');
  pageBody.classList.remove('scroll-lock');
  closeButton.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', onModalEsc);
  document.removeEventListener('click', onClickOverlay);
  modal.removeEventListener('keydown', trapFocus);
  order.focus();
}

const focusableEls = modal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="tel"]:not([disabled]), input[type="text"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
const firstFocusableEl = focusableEls[0];
const lastFocusableEl = focusableEls[focusableEls.length - 1];
const KEYCODE_TAB = 9;

const trapFocus = (evt) => {
  const isTabPressed = (evt.key === 'Tab' || evt.keyCode === KEYCODE_TAB);

  if (!isTabPressed) {
    return;
  }

  if (evt.shiftKey) {
    if (document.activeElement === firstFocusableEl) {
      lastFocusableEl.focus();
      evt.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableEl) {
      firstFocusableEl.focus();
      evt.preventDefault();
    }
  }
};

function modalOpen() {
  pageBody.classList.add('scroll-lock');
  modal.classList.remove('visually-hidden');
  userNameInputOnModal.focus();
  closeButton.addEventListener('click', closeModal);
  document.addEventListener('keydown', onModalEsc);
  modal.addEventListener('keydown', trapFocus);
  modal.addEventListener('click', onClickOverlay);
}

function onModalEsc(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

let modalWrapper = document.querySelector('.modal__wrapper');
function onClickOverlay(evt) {
  const elementsСlickArea = !evt.composedPath().includes(modalWrapper);
  if (elementsСlickArea) {
    closeModal();
  }
}
