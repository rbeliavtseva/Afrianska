'use strict';

/*
Реализует открытие/закрытие попапа
*/
var ESC_KEYCODE = 27;
var button = document.querySelector('.contact-us__button');
var popup = document.querySelector('.popup');
var overlay = document.querySelector('.overlay');
var textInputs = document.querySelectorAll('.input');
var body = document.querySelector('body');

// Блокировка скролла при открытии модального окна
function existVerticalScroll() {
  return document.body.offsetHeight > window.innerHeight;
}

function getBodyScrollTop() {
  return self.pageYOffset || (document.documentElement && document.documentElement.ScrollTop) || (document.body && document.body.scrollTop);
}

// Закрытие по нажатию ESC
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

// Ставит фокус в первое поле формы
var focusMethod = function getFocus() {
  textInputs[0].focus();
};

// Открытие попапа
var openPopup = function (evt) {
  evt.preventDefault();
  body.dataset.scrollY = getBodyScrollTop();
  popup.style.display = 'block';
  overlay.style.display = 'block';
  popup.querySelector('.popup__inner-content').style.display = 'block';
  message.classList.remove('popup__success-message--shown');
  focusMethod();
  document.addEventListener('keydown', onPopupEscPress);
  overlay.addEventListener('click', closePopup);

  if (existVerticalScroll()) {
    body.classList.add('body-lock');
    body.style.top = '-${body.dataset.scrollY}px';
  }
};

button.addEventListener('click', openPopup);

// Закрытие попапа
var closePopup = function () {
  popup.style.display = 'none';
  overlay.style.display = 'none';
  document.removeEventListener('keydown', onPopupEscPress);
  overlay.removeEventListener('click', closePopup);

  if (existVerticalScroll()) {
    body.classList.remove('body-lock');
    window.scrollTo(0, body.dataset.scrollY);
  }
};

/*
Реализует валидацию
*/
var userNameInput = popup.querySelector('#id-name');
var emailInput = popup.querySelector('#id-email');
var messageInput = popup.querySelector('#id-message');
var minLength = 2;
var maxNameLength = 25;
var maxMessageLength = 150;
var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Валидация имени и фамилии
userNameInput.addEventListener('input', function (evt) {
  var target = evt.target;
  var fullName = target.value.split(' ');
  if (fullName.length < 2) {
    target.setCustomValidity('Please enter your first and last name');
  } else {
    if (fullName[0].length < minLength || fullName[1].length < minLength) {
      target.setCustomValidity('First name or last name should contain at least 2 symbols');
    } else if (fullName[0].length > maxNameLength || fullName[1].length > maxNameLength) {
      target.setCustomValidity('First name or last name should not contain more than 25 symbols');
    } else {
      target.setCustomValidity('');
    }
  }
});

// Валидация email
emailInput.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value.match(mailFormat)) {
    target.setCustomValidity('');
  } else {
    target.setCustomValidity('Email should look like "somebody@example.com"');
  }
});

// Валидация текстового сообщения
messageInput.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value.length < minLength) {
    target.setCustomValidity('Message should contain at least 2 symbols');
  } else if (target.value.length > maxMessageLength) {
    target.setCustomValidity('Message should not contain more than 150 symbols');
  } else {
    target.setCustomValidity('');
  }
});

/*
Реализует отправку данных формы
*/
var form = popup.querySelector('.popup__form');
var message = popup.querySelector('.popup__success-message');

var upload = function (data, onSuccess) {
  var xhr = new XMLHttpRequest();
  var URL = 'https://echo.htmlacademy.ru'; // тестовый адрес

  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    onSuccess(xhr.response);
  });

  xhr.open('POST', URL);
  xhr.send(data);
};

form.addEventListener('submit', function (evt) {
  upload(new FormData(form), function () {
    popup.querySelector('.popup__inner-content').style.display = 'none';
    message.classList.add('popup__success-message--shown');
  });
  evt.preventDefault();
});
