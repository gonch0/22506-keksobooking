'use strict';

(function () {

  var MAX_PINS = 5;
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinBlock = document.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters');
  var addressInput = document.querySelector('input[name="address"]');
  var housingFeatures = document.querySelector('.map__features');

  var resetButton = document.querySelector('.ad-form__reset');
  var submitButton = document.querySelector('.ad-form__submit');
  var formSelects = map.querySelectorAll('select');

  var mainPinCenterX = parseInt(mapPinMain.style.left, 10) + Math.floor(0.5 * mapPinMain.offsetWidth, 1);
  var mainPinCenterY = parseInt(mapPinMain.style.top, 10) + Math.floor(0.5 * mapPinMain.offsetHeight, 1);

  var setStyleX = function (x) {
    mapPinMain.style.left = x + 'px';
  };
  var setStyleY = function (y) {
    mapPinMain.style.top = y + 'px';
  };

  // Включаем страницу
  var enablePage = function () {
    map.classList.remove('map--faded');
    window.form.setDisable(formSelects, true);
    housingFeatures.disabled = true;
    window.form.enableForm();
    submitButton.disabled = false;
    var onLoadSuccess = function (adverts) {
      window.data.adverts = adverts;
      pinBlock.appendChild(renderMapElements(adverts));
    };
    window.backend.load(onLoadSuccess, window.backend.onServerError);
  };

  // Сброс страницы
  var disablePage = function () {
    window.form.disableForm();
    map.classList.add('map--faded');
    removePins();
    window.form.setDisable(formSelects, false);
    window.card.closePopup();
    setStyleX(window.data.MAIN_PIN.left);
    setStyleY(window.data.MAIN_PIN.top);
    mapFilters.reset();
    submitButton.disabled = true;
    setAddress();
  };

  var setAddress = function () {
    addressInput.value = mainPinCenterX + ', ' + mainPinCenterY;
  };

  setAddress();
  resetButton.addEventListener('click', disablePage);

  var renderMapElements = function (info) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < info.length && i < MAX_PINS; i++) {
      var pinElement = window.pin.createPin(info[i]);
      fragment.appendChild(pinElement);
    }
    return fragment;
  };

  // Drag and Drop главного пина
  mapPinMain.addEventListener('mousedown', function (evt) {
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

      if (y < window.data.PIN.y.min) {
        setStyleY(window.data.PIN.y.min);
      } else if (y > window.data.PIN.y.max) {
        setStyleY(window.data.PIN.y.max);
      } else {
        setStyleY(y);
      }
      addressInput.value = (x + 0.5 * window.data.MAIN_PIN.width) + ', ' + y;

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


  var updatePins = function () {
    removePins();
    var filteredAdverts = window.filter.applyFilters(window.data.adverts);
    pinBlock.appendChild(renderMapElements(filteredAdverts));
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pinElement) {
      pinElement.remove();
    });
  };

  var onHousingElementChange = function () {
    window.debounce(function () {
      updatePins();
    });
  };

  mapFilters.addEventListener('change', onHousingElementChange);

  window.map = {
    disablePage: disablePage
  };


})();
