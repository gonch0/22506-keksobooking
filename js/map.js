'use strict';

(function () {


  var pinTemplate = document.querySelector('#pin').content;
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinBlock = document.querySelector('.map__pins');

  var setStyleX = function (x) {
    mapPinMain.style.left = x + 'px';
  };
  var setStyleY = function (y) {
    mapPinMain.style.top = y + 'px';
  };

  var mapFilters = map.querySelector('.map__filters');

  var mainPinCenterX =  parseInt(mapPinMain.style.left, 10) + Math.floor(0.5*mapPinMain.offsetWidth, 1);
  var mainPinCenterY =  parseInt(mapPinMain.style.top, 10) + Math.floor(0.5*mapPinMain.offsetHeight, 1);
  var addressInput = document.querySelector('input[name="address"]');
  var adForm = document.querySelector('.ad-form');
  var pageFieldsets = document.querySelectorAll('fieldset');
  var formSelects = mapFilters.querySelectorAll('select');

  //Включаем страницу
  var enablePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    mapFilters.classList.remove('ad-form--disabled');

    removeDisable(Array.from(formSelects));
    removeDisable(Array.from(pageFieldsets));


    var onLoadSuccess = function (adverts) {
      var fragment = document.createDocumentFragment();

      window.data.adverts = adverts;

      for (var i = 0; i < adverts.length; i++) {
        if (adverts[i].offer) {
          var pinElement = window.pin.createPin(adverts[i]);
          pinElement.setAttribute('pin-num', i);
          fragment.appendChild(pinElement);
        }
      }
      pinBlock.appendChild(fragment);
    };
    window.backend.load(onLoadSuccess, window.backend.onServerError);
  };

  //console.log ('HEY');
  //console.log (window.data.adverts);

  var removeDisable = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('disabled');
    }
  };


  var onPopupEscPress = function(evt) {
    if (evt.keyCode === data.ESC_KEYCODE) {
      closePopup();
    }
  };

  var closePopup = function() {
    var popup = document.querySelector('.popup')
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  //Drag and Drop главного пина
  mapPinMain.addEventListener('mousedown', function(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var x = mapPinMain.offsetLeft - shift.x;
      var y = mapPinMain.offsetTop - shift.y;

      if (x < 0) {
        setStyleX(0);
      } else if (x > window.data.PIN.x.max - window.data.MAIN_PIN.width) {
        setStyleX(window.data.PIN.x.max - window.data.MAIN_PIN.width);
      } else {
        setStyleX(x);
      }

      if (y < data.PIN.y.min) {
        setStyleY(data.PIN.y.min);
      } else if (y > data.PIN.y.max) {
        setStyleY(data.PIN.y.max);
      } else {
        setStyleY(y);
      }
      addressInput.value = (x + 0.5 * data.MAIN_PIN.width) + ', ' + y;

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      enablePage();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


})();


