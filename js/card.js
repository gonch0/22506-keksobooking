'use strict';

(function () {

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  // Функции создания данных для карточки
  var createFeature = function (feature) {
    var cardFeature = document.createElement('li');
    cardFeature.classList.add('popup__feature');
    var cardFeatureClass = 'popup__feature--' + feature;
    cardFeature.classList.add(cardFeatureClass);
    return cardFeature;
  };

  var createFeaturesList = function (featuresList) {
    var fragment = document.createDocumentFragment();
    featuresList.forEach(function (feauture) {
      fragment.appendChild(createFeature(feauture));
    });
    return fragment;
  };

  var createPhoto = function (photoSrc) {
    var cardPhoto = document.createElement('img');
    cardPhoto.src = photoSrc;
    cardPhoto.width = window.data.PHOTO.width;
    cardPhoto.height = window.data.PHOTO.height;
    cardPhoto.classList.add('popup__photo');
    return cardPhoto;
  };

  var createPhotoList = function (photosList) {
    var fragment = document.createDocumentFragment();

    photosList.forEach(function (photo) {
      fragment.appendChild(createPhoto(photo));
    });
    return fragment;
  };

  // Функция создания карточки
  var createCard = function (cardData) {
    var advertCard = cardTemplate.cloneNode(true);

    var cardImage = advertCard.querySelector('.popup__avatar');
    var cardTitle = advertCard.querySelector('h3');
    var cardAddress = advertCard.querySelector('.popup__text--address');
    var cardPrice = advertCard.querySelector('.popup__text--price');
    var cardTypes = advertCard.querySelector('.popup__type');
    var cardCapacity = advertCard.querySelector('.popup__text--capacity');
    var cardTime = advertCard.querySelector('.popup__text--time');
    var cardFeatures = advertCard.querySelector('.popup__features');
    var cardDescription = advertCard.querySelector('.popup__description');
    var cardPhotos = advertCard.querySelector('.popup__photos');
    var cardClose = advertCard.querySelector('.popup__close');

    cardImage.src = cardData.author.avatar;
    cardTitle.textContent = cardData.offer.title;
    cardAddress.textContent = cardData.offer.address;
    cardPrice.textContent = cardData.offer.price + '₽/ночь';
    cardTypes.textContent = window.data.types[cardData.offer.type].name;
    cardCapacity.textContent = cardData.offer.rooms + ' комнаты для ' + cardData.offer.guests + ' гостей';
    cardTime.textContent = 'Заезд после ' + cardData.offer.checkin + ', выезд до ' + cardData.offer.checkout;
    cardFeatures.innerHTML = '';
    cardFeatures.appendChild(createFeaturesList(cardData.offer.features));
    cardDescription.textContent = cardData.offer.description;
    cardPhotos.innerHTML = '';
    cardPhotos.appendChild(createPhotoList(cardData.offer.photos));

    cardClose.addEventListener('click', function () {
      advertCard.remove();
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.KEYCODES.esc) {
        advertCard.remove();
      }
    });
    return advertCard;
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.data.KEYCODES.esc) {
      closePopup();
    }
  };

  var closePopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.classList.add('hidden');
    }
    document.removeEventListener('keydown', onPopupEscPress);
  };

  window.card = {
    createCard: createCard,
    closePopup: closePopup
  };

}());
