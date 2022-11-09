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
        // вариант с очисткой поля, для пиксель-перфекта, например
        // evt.target.value = '';
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
let moreButton = document.querySelector('[data-more-button]');
let additional = document.querySelectorAll('[data-additional-text]');
additional.forEach((element) => {
  element.classList.add('visually-hidden');
});

if (moreButton) {
  moreButton.classList.remove('visually-hidden');
  additional.forEach((element) => {
    element.classList.remove('no-js');
  });
  moreButton.addEventListener('click', showMore);
}

function showMore() {
  moreButton.classList.toggle('is-closed');
  if (!moreButton.classList.contains('is-closed')) {
    moreButton.textContent = 'Свернуть';
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

let accordionBlock = document.querySelectorAll('[data-accordion-block]');
let accordionTitle = document.querySelectorAll('[data-accordion-title]');
let accordionText = document.querySelectorAll('[data-accordion-text]');
if (accordionTitle && accordionText) {
  accordionTitle.forEach((element) => {
    if (element.classList.contains('no-js')) {
      element.classList.remove('no-js');
    }
  });

  accordionText.forEach((element) => {
    if (element.classList.contains('no-js')) {
      element.classList.remove('no-js');
    }
  });


  accordionBlock.forEach((element) => {
    element.addEventListener('click', () => {
      let temp = element.firstElementChild;
      let setClasses = !temp.classList.contains('is-active');
      setClass(accordionTitle, 'is-active', 'remove');
      setClass(accordionText, 'is-open', 'remove');

      if (setClasses) {
        temp.classList.toggle('is-active');
        temp.nextElementSibling.classList.toggle('is-open');
      }
    });
  });
}

function setClass(elements, className, fnName) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList[fnName](className);
  }
}

// приключения модального окна
let orderButton = document.querySelector('[data-order-button]');
let modal = document.querySelector('[data-modal-container]');
let closeButton = document.querySelector('[data-close-button]');
let pageBody = document.body;
let modalForm = document.querySelector('[data-modal-form]');
let modalUserName = document.querySelector('[data-input-username]');
let modalUserPhone = document.querySelector('[data-input-phone]');
let modalTextarea = document.querySelector('[data-textarea-question]');
let isStorageSupport = true;
let userNameStorage = '';
let userPhoneStorage = '';

if (modal) {
  try {
    userNameStorage = localStorage.getItem('modalUserName');
    userPhoneStorage = localStorage.getItem('phoneInputOnModal');
  } catch (err) {
    isStorageSupport = false;
  }

  orderButton.addEventListener('click', openModal);
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
  orderButton.focus();
  modalForm.removeEventListener('submit', checkFillInputField);
}

let focusableEls = modal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="tel"]:not([disabled]), input[type="text"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
let firstFocusableEl = focusableEls[0];
let lastFocusableEl = focusableEls[focusableEls.length - 1];
let KEYCODE_TAB = 9;

let trapFocus = (evt) => {
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

function openModal() {
  pageBody.classList.add('scroll-lock');
  modal.classList.remove('visually-hidden');
  modalUserName.focus();
  if (userNameStorage) {
    modalUserName.value = userNameStorage;
    modalUserPhone.value = userPhoneStorage;
    modalTextarea.focus();
  } else {
    modalUserName.focus();
  }
  closeButton.addEventListener('click', closeModal);
  document.addEventListener('keydown', onModalEsc);
  modal.addEventListener('keydown', trapFocus);
  modal.addEventListener('click', onClickOverlay);
  modalForm.addEventListener('submit', checkFillInputField);
}

function onModalEsc(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

let modalWrapper = document.querySelector('[data-modal-wrapper]');
function onClickOverlay(evt) {
  const elementsСlickArea = !evt.composedPath().includes(modalWrapper);
  if (elementsСlickArea) {
    closeModal();
  }
}

function checkFillInputField(evt) {
  if (!modalUserName || !modalUserPhone) {
    evt.preventDefault();
  } else {
    if (isStorageSupport) {
      localStorage.setItem('modalUserName', modalUserName.value);
      localStorage.setItem('phoneInputOnModal', modalUserPhone.value);
    }
  }
}
