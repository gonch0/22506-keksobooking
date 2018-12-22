'use strict';

(function () {

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');

  var createFeature = function (feature) {
    var cardFeature = document.createElement('li');
    cardFeature.classList.add('popup__feature');
    var cardFeatureClass = 'popup__feature--' + feature;
    cardFeature.classList.add(cardFeatureClass);
    return cardFeature;
  };

  var createFeaturesList = function (featuresList) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < featuresList.length; i++) {
      fragment.appendChild(createFeature(featuresList[i]));
    }
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
    for (var i = 0; i < photosList.length; i++) {
      fragment.appendChild(createPhoto (photosList[i]));
    }
    return fragment;
  };

  var createCard = function (firstCard) {

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

    cardImage.src = firstCard.author.avatar;
    cardTitle.textContent = firstCard.offer.title;
    cardAddress.textContent = firstCard.offer.address;
    cardPrice.textContent = firstCard.offer.price+'₽/ночь';
    cardTypes.textContent = window.data.types[firstCard.offer.type].name;
    cardCapacity.textContent = firstCard.offer.rooms + ' комнаты для ' + firstCard.offer.guests + ' гостей';
    cardTime.textContent = 'Заезд после ' + firstCard.offer.checkin + ', выезд до ' + firstCard.offer.checkout;
    cardFeatures.innerHTML = '';
    cardFeatures.appendChild(createFeaturesList(firstCard.offer.features));
    cardDescription.textContent = firstCard.offer.description;
    cardPhotos.innerHTML = '';
    cardPhotos.appendChild(createPhotoList(firstCard.offer.photos));

    cardClose.addEventListener('click', function() {
      advertCard.remove();
    });

    return advertCard;
  };


  window.card = {
    createCard: createCard
  }

}());


