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

var pinTemplate = document.querySelector('#pin').content;
var pinBlock = document.querySelector('.map__pins');
var map = document.querySelector('.map');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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

//  1. Создайте массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.

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

//  2. У блока .map уберите класс .map--faded.

map.classList.remove('map--faded');

//  3. На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговую разметку метки .map__pin можно взять из шаблона #pin.

var createPin = function (object) {
  var advertPin = pinTemplate.cloneNode(true);
  var pinButton = advertPin.querySelector('.map__pin');
  var pinImage = advertPin.querySelector('img');

  pinButton.style.left = object.location.x - 0.5 * PIN_WIDTH + 'px';
  pinButton.style.top = object.location.y - PIN_HEIGHT + 'px';
  pinImage.src = object.author.avatar;
  pinImage.alt = object.offer.title;
  return advertPin;
};

//  4. Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.

var renderPins = function (info) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < info.length; i++) {
    fragment.appendChild(createPin(info[i]));
  }
  pinBlock.appendChild(fragment);
};

renderPins(adverts);

//  5. На основе первого по порядку элемента из сгенерированного массива и шаблона #card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map перед блоком.map__filters-container

var cardTemplate = document.querySelector('#card').content;
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

  return advertCard;
};

var renderCards = function (info) {
   map.insertBefore(info, map.querySelector('.map__filters-container'));
};

var card = createCard(adverts);
renderCards(card);
