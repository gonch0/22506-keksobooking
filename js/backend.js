'use strict';

(function () {

  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var MAX_TIMEOUT = 10000; //10s
  var SUCCESS_STATUS = 200;

  //Функция загрузки данных с сервера
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function() {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function() {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function() {
      onError('Время ожидания ответа с сервера вышло');
    });

    xhr.timeout = MAX_TIMEOUT;

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  //Функция записи данных на сервер
  var save =  function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function() {
      onLoad(xhr.response);
    });

    xhr.open('POST', SAVE_URL);
    xhr.send(data);
  };

  //Функция обработки ошибки получения данных
  var onServerError = function(message) {
    var footer = document.querySelector('footer');
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorMessage = errorElement.querySelector('.error__message');
    var errorButton = errorElement.querySelector('.error__button');

    errorMessage.textContent = message;

    var onErrorClose = function () {
      errorElement.remove();
    };

    errorButton.addEventListener('click', onErrorClose);
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === data.KEYCODES.esc) {
        onErrorClose();
      }
    });

    footer.insertAdjacentElement('afterbegin', errorElement);
  }


  window.backend = {
    load: load,
    save: save,
    onServerError: onServerError
  };

})();
