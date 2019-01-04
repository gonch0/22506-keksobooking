'use strict';

(function () {

  var MAX_PINS = 5;
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
      window.data.adverts = adverts;
      pinBlock.appendChild(renderMapElements(adverts));
    };
    window.backend.load(onLoadSuccess, window.backend.onServerError);
  };

  var renderMapElements = function (info) {

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < info.length && i < MAX_PINS; i++) {
      var pinElement = window.pin.createPin(info[i]);
      fragment.appendChild(pinElement);
    }
    return fragment;
  };


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

  //Модуль 7

  var mapFilters = map.querySelector('.map__filters');

  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');

  var PRICE_RANGE = {
    low: 10000,
    high: 50000
  };

  var updatePins = function (ads) {
    removePins();
    var filteredAdverts = applyFilters(window.data.adverts);
    pinBlock.appendChild(renderMapElements(filteredAdverts));
  };

  //Фильтры и вспомогательные функции
  var checkTypesMatch = function (data) {
    return (
      housingType.value === 'any' || data.offer.type === housingType.value
    );
  };

  var checkPricesMatch = function (data) {
    var priceMatch = true;
    if (housingPrice.value !== 'any') {
      switch (housingPrice.value) {
        case 'low':
          priceMatch = data.offer.price < PRICE_RANGE.low;
          break;
        case 'middle':
          priceMatch = data.offer.price >= PRICE_RANGE.low && data.offer.price < PRICE_RANGE.high;
          break;
        case 'high':
          priceMatch = data.offer.price >= PRICE_RANGE.high;
          break;
      }
    }
    return priceMatch;
  };

  var checkRoomsMatch = function (data) {
    return (
      housingRooms.value === 'any' || data.offer.rooms === +housingRooms.value
    );
  };

  var checkGuestsMatch = function (data) {
    return (
      housingGuests.value === 'any' || data.offer.guests === +housingGuests.value
    );
  };

  var checkFeaturesMatch = function (data) {
    var featuresMatch = true;
    var checkedFeaturesElements = housingFeatures.querySelectorAll('input:checked');
    checkedFeaturesElements.forEach(function (feature) {
      if (data.offer.features.indexOf(feature.value) === -1) {
        featuresMatch = false;
      }
    })
    return featuresMatch;
  };

  var applyFilters = function (ads) {
    var filteredAds = ads.filter(function(ad) {

      //console.log(checkTypesMatch(ad) + ' ' + checkPricesMatch(ad) + ' ' + checkRoomsMatch(ad) + ' ' + checkGuestsMatch(ad) + ' ' + checkFeaturesMatch(ad));
      return (
        checkTypesMatch(ad) &&
        checkPricesMatch(ad) &&
        checkRoomsMatch(ad) &&
        checkGuestsMatch(ad) &&
        checkFeaturesMatch(ad)
      );
    });
    return filteredAds;
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pinElement) {
      pinElement.remove();
    });
  };

  //Обработчики
  var onHousingElementChange = function () {
    window.debounce (function () {
      updatePins();
    })
  };

  mapFilters.addEventListener('change', onHousingElementChange);

})();
