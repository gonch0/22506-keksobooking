'use strict';

(function () {

  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var formInputs = document.querySelectorAll('input');
  var formElements = document.querySelectorAll('fieldset');

  var formType = adForm.querySelector('#type');
  var formPrice = adForm.querySelector('#price');
  var formTimein = adForm.querySelector('#timein');
  var formTimeout = adForm.querySelector('#timeout');
  var formRooms = adForm.querySelector('#room_number');
  var formCapacity = adForm.querySelector('#capacity');

  var footer = document.querySelector('footer');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var setDisable = function (elements, remove) {
    elements.forEach(function (element) {
      element.disabled = !remove;
    });
  };

  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');
    setDisable(formElements, true);
    setDisable(formInputs, true);
    validatePrice();
    validateCapacityRooms();
  };

  var disableForm = function () {
    adForm.classList.add('ad-form--disabled');
    adForm.reset();
    setDisable(formElements, false);
    setDisable(formInputs, false);
    window.images.resetAvatar();
    window.images.resetPhotos();
  };

  var validatePrice = function () {
    var errorMessage = '';
    var typeValue = formType.value;
    var price = formPrice.value;
    var flatPrice = window.data.types['flat'].price;
    var housePrice = window.data.types['house'].price;
    var palacePrice = window.data.types['palace'].price;

    formPrice.placeholder = window.data.types[typeValue].price;
    formPrice.min = window.data.types[typeValue].price;

    switch (typeValue) {
      case 'flat':
        if (price < flatPrice) {
          errorMessage += 'Минимальная стоимость Вашего типа жилья -- ' + flatPrice;
        }
        break;
      case 'house':
        if (price < housePrice) {
          errorMessage = 'Минимальная стоимость Вашего типа жилья -- ' + housePrice;
        }
        break;
      case 'palace':
        if (price < palacePrice) {
          errorMessage = 'Минимальная стоимость Вашего типа жилья -- ' + palacePrice;
        }
        break;
    }
    formPrice.setCustomValidity(errorMessage);
  };

  var validateCapacityRooms = function () {
    var errorMessage = '';
    var roomsValue = formRooms.value;
    var capacity = +formCapacity.value;

    switch (roomsValue) {
      case '1':
        if (capacity !== 1) {
          errorMessage = 'Максимально возможное количество гостей -- 1';
        }
        break;
      case '2':
        if (capacity !== 1 && capacity !== 2) {
          errorMessage = 'Максимально возможное количество гостей -- 2';
        }
        break;

      case '3':
        if (capacity !== 1 && capacity !== 2 && capacity !== 3) {
          errorMessage = 'Максимально возможное количество гостей -- 3';
        }
        break;
      case '100':
        if (capacity !== 0) {
          errorMessage = 'Не для гостей';
        }
        break;
    }
    formCapacity.setCustomValidity(errorMessage);
  };


  formRooms.addEventListener('change', validateCapacityRooms);
  formCapacity.addEventListener('change', validateCapacityRooms);
  formType.addEventListener('change', validatePrice);
  formPrice.addEventListener('change', validatePrice);

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

  var onServerSuccess = function () {
    var successElement = successTemplate.cloneNode(true);

    var onSuccessClose = function () {
      successElement.remove();
    };

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.KEYCODES.esc) {
        onSuccessClose();
      }
    });

    document.addEventListener('click', onSuccessClose);

    footer.insertAdjacentElement('afterbegin', successElement);
  };

  mapFilters.addEventListener('change', function () {
    window.card.closePopup();
  });

  adForm.addEventListener('submit', function (evt) {
    validatePrice();
    validateCapacityRooms();

    if (adForm.checkValidity()) {
      window.backend.save(onServerSuccess, window.backend.onServerError, new FormData(adForm));
      window.map.disablePage();
      evt.preventDefault();
    } else {
      adForm.reportValidity();
    }
  });

  window.form = {
    setDisable: setDisable,
    enableForm: enableForm,
    disableForm: disableForm
  };

})();
