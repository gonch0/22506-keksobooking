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
  };

  var formType = adForm.querySelector('#type');
  var formPrice = adForm.querySelector('#price');
  var formTimein = adForm.querySelector('#timein');
  var formTimeout = adForm.querySelector('#timeout');
  var formRooms = adForm.querySelector('#room_number');
  var formCapacity= adForm.querySelector('#capacity');

  var conformPrice = function() {
    var type = formType.value;
    formPrice.placeholder = window.data.types[type].price;
    formPrice.min = window.data.types[type].price;
  };


  var validateCapacityRooms  = function () {

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

  validateCapacityRooms();
  formRooms.addEventListener('change', validateCapacityRooms);
  formCapacity.addEventListener('change', validateCapacityRooms);
  formType.addEventListener('change', conformPrice);

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

  //Модуль 8

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var avatarPreviewImg = document.querySelector('.ad-form-header__preview img');

  //Обработка загрузки аватарки
  var onAvatarUpload = function () {
    var file = avatarChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreviewImg.src = reader.result;
        avatarPreviewImg.width = '70';
        avatarPreviewImg.height = '70';
        avatarPreview.style.padding = '0';
      });
      reader.readAsDataURL(file);
    }
  };

  var photoChooser = document.querySelector('.ad-form__upload input[type=file]');
  var photoPreview = document.querySelector('.ad-form__photo');
  var photoPreviewContainer = document.querySelector('.ad-form__photo-container');


  //Обработка загрузки фотографий
  var onPhotoUpload = function () {
    var files = photoChooser.files;

    var photo = document.createElement('img');
    for (var i = 0; i < files.length; i++) {
      var file = photoChooser.files[i];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          photoPreview.appendChild(photo);

          var photoPreviewClone = photoPreview.cloneNode(true);
          var cloneImage = photoPreviewClone.querySelector('img');
          cloneImage.src = reader.result;
          cloneImage.width = '70';
          cloneImage.height = '70';

          photoPreviewContainer.appendChild(photoPreviewClone);
        });
        reader.readAsDataURL(file);
      }
    }
    photoPreview.remove();
  };

  avatarChooser.addEventListener('change', onAvatarUpload);
  photoChooser.addEventListener('change', onPhotoUpload);

  //Конец модуля 8


  /*Сброс страницы

  var disablePage = function () {

  };*/


  //Отправка данных на сервер:
  var onServerSuccess = function() {
    var footer = document.querySelector('footer');
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);

    var onSuccessClose = function () {
      successElement.remove();
    };

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === data.KEYCODES.esc) {
        onSuccessClose();
      }
    });

    footer.insertAdjacentElement('afterbegin', successElement);
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.save(onServerSuccess, window.backend.onServerError, new FormData(adForm));
    evt.preventDefault();
  });

})();
