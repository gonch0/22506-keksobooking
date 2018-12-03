'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AD_AMOUNT = 8;
var AD_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];

var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MAX = 5;
var GUESTS_MAX = 10;

var PIN_X_MIN = 50;
var PIN_X_MAX = 1150;
var PIN_Y_MIN = 130;
var PIN_Y_MAX = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;

var MAIN_PIN_WIDTH = 40;
var MAIN_PIN_HEIGHT = 44;

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var pinTemplate = document.querySelector('#pin').content;

var pinBlock = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapPinMain = document.querySelector('.map__pin--main');
var mapFilters = map.querySelector('.map__filters');

var mainPinCenterX =  parseInt(mapPinMain.style.left, 10) + Math.floor(0.5*mapPinMain.offsetWidth, 1);
var mainPinCenterY =  parseInt(mapPinMain.style.top, 10) + Math.floor(0.5*mapPinMain.offsetHeight, 1);

var adForm = document.querySelector('.ad-form');
var pageFieldsets = document.querySelectorAll('fieldset');

var formSelects = mapFilters.querySelectorAll('select');

var housingType = mapFilters.querySelector('#housing-type');
var housingPrice = mapFilters.querySelector('#housing-price');
var housingRooms = mapFilters.querySelector('#housing-rooms');
var housingGuests = mapFilters.querySelector('#housing-guests');
var filterWifi = mapFilters.querySelector('#filter-wifi');
var filterDishwasher = mapFilters.querySelector('#filter-dishwasher');
var filterParking = mapFilters.querySelector('#filter-parking');
var filterWasher = mapFilters.querySelector('#filter-washer');
var filterElevator = mapFilters.querySelector('#filter-elevator');
var filterConditioner = mapFilters.querySelector('#filter-conditioner');

var addressInput = document.querySelector('input[name="address"]');

var conformInputAddress = function () {
  var mainPinX =  parseInt(mapPinMain.style.left, 10) + Math.floor(0.5*mapPinMain.offsetWidth, 1);
  var mainPinY =  parseInt(mapPinMain.style.top, 10) + Math.floor(0.5*(mapPinMain.offsetHeight + MAIN_PIN_HEIGHT), 1);
  addressInput.value = coords.x + ', ' + coords.y;
}

var removeDisable = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('disabled');
  }
};

var enablePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('ad-form--disabled');

  removeDisable(Array.from(formSelects));
  removeDisable(Array.from(pageFieldsets));
  renderPins(adverts);

  addressInput.value = mainPinCenterX + ', ' + mainPinCenterY;

};

//var showCard = function () {
//  var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
//};


var onPopupEscPress = function(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function() {
  var popup = document.querySelector('.popup')
  popup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomValue = function (values) {
  var value = values[getRandomInt(0, values.length)];
  return value;
};

var getRandomList = function (list) {
  var sourceList = list.slice(0);
  var randomList = [];
  for (var i = 0; i < list.length; i++) {
    var randomInt = getRandomInt(0, sourceList.length);
    randomList[i] = sourceList[randomInt];
    sourceList.splice(randomInt, 1);
  }
  return randomList;
};

var getCutList = function (list) {
  return list.splice(0, getRandomInt(0, list.length));
};


var createAdvert = function (num) {

  var x = getRandomInt(PIN_X_MIN, PIN_X_MAX);
  var y = getRandomInt(PIN_Y_MIN, PIN_Y_MAX);

  var advert = {

    author: {
      avatar: 'img/avatars/user0' + AD_NUMS[num] + '.png',
    },

    location: {
      x: x,
      y: y
    },

    offer: {
      title: TITLES[num],
      address: x + ', ' + y,
      price: getRandomInt(PRICE_MIN, PRICE_MAX),
      type: getRandomValue(TYPES),
      rooms: getRandomInt (1, ROOMS_MAX + 1),
      guests: getRandomInt (1, GUESTS_MAX),
      checkin: getRandomValue (CHECKS),
      checkout: getRandomValue (CHECKS),
      features: getCutList (getRandomList (FEATURES)),
      description: '',
      photos: getRandomList (PHOTOS)
    }
  };
  return advert;
};

var compileElements = function () {
  var elements = [];
  for (var i = 0; i < AD_AMOUNT; i++) {
    elements[i] = createAdvert(i);
  }
  return elements;
};

var adverts = compileElements();




var createPin = function (object) {
  var advertPin = pinTemplate.cloneNode(true);
  var pinButton = advertPin.querySelector('.map__pin');
  var pinImage = advertPin.querySelector('img');
  var card = createCard(adverts);

  pinButton.style.left = object.location.x - 0.5 * PIN_WIDTH + 'px';
  pinButton.style.top = object.location.y - PIN_HEIGHT + 'px';
  pinImage.src = object.author.avatar;
  pinImage.alt = object.offer.title;

  pinButton.addEventListener('click', function() {
    renderCard(card);
  });

  return advertPin;
};

var renderPins = function (info) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < info.length; i++) {
    fragment.appendChild(createPin(info[i]));
  }
  pinBlock.appendChild(fragment);
};



var conformTypes = function (type) {
  switch (type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return'Дом';
    case 'palace': return 'Дворец';
  }
};

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
  cardPhoto.width = PHOTO_WIDTH;
  cardPhoto.height = PHOTO_HEIGHT;
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

var createCard = function (data) {
  var firstCard = data[0];
  var advertCard = cardTemplate.cloneNode(true);

  var cardImage = advertCard.querySelector('img');
  var cardTitle = advertCard.querySelector('h3');
  var cardAddress = advertCard.querySelector('.popup__text--address');
  var cardPrice = advertCard.querySelector('.popup__text--price');
  var cardTypes = advertCard.querySelector('h4');
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
  cardTypes.textContent = conformTypes(firstCard.offer.type);
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

var renderCard = function (info) {
   map.insertBefore(info, map.querySelector('.map__filters-container'));
};


mapPinMain.addEventListener('mouseup', function() {
  enablePage();
});





