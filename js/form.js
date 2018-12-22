'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var adForm = document.querySelector('.ad-form');
  var pageFieldsets = document.querySelectorAll('fieldset');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var formSelects = mapFilters.querySelectorAll('select');

  var addressInput = document.querySelector('input[name="address"]');

  var conformInputAddress = function () {
    var mainPinX =  parseInt(mapPinMain.style.left, 10) + Math.floor(0.5*mapPinMain.offsetWidth, 1);
    var mainPinY =  parseInt(mapPinMain.style.top, 10) + Math.floor(0.5*(mapPinMain.offsetHeight + MAIN_PIN_HEIGHT), 1);
  }

  var adForm = document.querySelector('.ad-form');
  var formType = adForm.querySelector('#type');
  var formPrice = adForm.querySelector('#price');
  var formTimein = adForm.querySelector('#timein');
  var formTimeout = adForm.querySelector('#timeout');
  var formRooms = adForm.querySelector('#room_number');
  var formCapacity= adForm.querySelector('#capacity');

  var conformPrice = function() {
    var type = formType.value;
    formPrice.placeholder = types[type].price;
    formPrice.min = types[type].price;
  }

  var onPriceChange = function() {
    conformPrice();
  }

  var validateCapacityRooms = function () {
    var errorMessage = '';
    if (
      +formRooms.value < +formCapacity.value ||
      (+formRooms.value === 100 && +formCapacity.value !== 0) || (+formRooms.value !== 100 && +formCapacity.value === 0)
    ) {
      errorMessage = 'Количество комнат не соответствует количеству возможных гостей';
    }
    formRooms.setCustomValidity(errorMessage);
  };

  var onRoomsChange = function() {
    validateCapacityRooms();
  }

  formType.addEventListener('change', onPriceChange);
  formRooms.addEventListener('change', onRoomsChange);
  formCapacity.addEventListener('change', onRoomsChange);

  formTimein.addEventListener('change', function (evt) {
    var targetValue = evt.target.value;
    if (targetValue !== formTimeout.value) {
      formTimeout.value = targetValue;
    }
  });

  formTimeout.addEventListener('change', function (evt) {
    var targetValue = evt.target.value;
    if (targetValue !== formTimein.value) {
      formTimein.value = targetValue;
    }
  });

})();


