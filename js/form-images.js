'use strict';
(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var customAvatarParams = {
    width: '70',
    height: '70',
    padding: '0'
  };

  var avatarParams = {
    width: '40',
    height: '44',
    padding: '0 15px',
    path: 'img/muffin-grey.svg'
  };

  var avatarChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview');
  var avatarPreviewImg = document.querySelector('.ad-form-header__preview img');

  // Обработка загрузки аватарки
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
        avatarPreviewImg.width = customAvatarParams.width;
        avatarPreviewImg.height = customAvatarParams.height;
        avatarPreview.style.padding = customAvatarParams.padding;
      });
      reader.readAsDataURL(file);
    }
  };

  var resetAvatar = function () {
    avatarPreviewImg.src = avatarParams.path;
    avatarPreviewImg.width = avatarParams.width;
    avatarPreviewImg.height = avatarParams.height;
    avatarPreview.style.padding = avatarParams.padding;
  };

  var photoChooser = document.querySelector('.ad-form__upload input[type=file]');
  var photoPreview = document.querySelector('.ad-form__photo');
  var photoPreviewContainer = document.querySelector('.ad-form__photo-container');

  var photoParams = {
    width: '70',
    height: '70'
  };

  // Обработка загрузки фотографий
  var onPhotoUpload = function () {
    var files = Array.from(photoChooser.files);
    var photo = document.createElement('img');
    files.forEach(function (file) {

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
          cloneImage.width = photoParams.width;
          cloneImage.height = photoParams.height;

          photoPreviewContainer.appendChild(photoPreviewClone);
        });
        reader.readAsDataURL(file);
      }
    });
    photoPreview.remove();
  };

  var resetPhotos = function () {
    var photoPreviewList = photoPreviewContainer.querySelectorAll('.ad-form__photo');
    photoPreviewList.forEach(function (element) {
      element.remove();
    });
    photoPreviewContainer.appendChild(photoPreview);
  };

  avatarChooser.addEventListener('change', onAvatarUpload);
  photoChooser.addEventListener('change', onPhotoUpload);

  window.images = {
    resetAvatar: resetAvatar,
    resetPhotos: resetPhotos
  };

})();
