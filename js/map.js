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

    var elements = renderMapElements(window.data.adverts);
    pinBlock.appendChild(elements);

  };

  var removeDisable = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('disabled');
    }
  };


  var renderMapElements = function (info) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < info.length; i++) {
      var pinElement = window.pin.createPin(info[i]);
      pinElement.setAttribute('pin-num', i);
      fragment.appendChild(pinElement);
    }
    return fragment;
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
      } else if (x > data.PIN.x.max - data.MAIN_PIN.width) {
        setStyleX(data.PIN.x.max - data.MAIN_PIN.width);
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

  //var showCard = function () {
  //  var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
  //};
