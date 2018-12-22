'use strict';

(function () {

  var AD_AMOUNT = 8;
  var AD_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];

  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  var CHECKS = ['12:00', '13:00', '14:00'];

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var types = {
    bungalo: {
      name: 'Бунгало',
      price: 0
    },

    flat: {
      name: 'Квартира',
      price: 1000
    },

    house: {
      name: 'Дом',
      price: 5000
    },

    palace: {
      name: 'Дворец',
      price: 10000
    }
  };

  var PRICE = {
    min: 1000,
    max: 1000000
  }

  var ROOMS_MAX = 5;
  var GUESTS_MAX = 10;

  var PIN = {
    x: {
      min: 50,
      max: 1200
    },

    y: {
      min: 130,
      max: 630
    },
    width: 50,
    height: 70
  };

  var PHOTO = {
    width: 45,
    height: 40
  };

  var MAIN_PIN = {
    width: 62,
    height: 62
  }

  var KEYCODES = {
    esc: 27,
    enter: 13
  }

  var createAdvert = function (num) {

    var x = window.utils.getRandomInt(PIN.x.min, PIN.x.max);
    var y = window.utils.getRandomInt(PIN.y.min, PIN.y.max);

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
        price: window.utils.getRandomInt(PRICE.min, PRICE.max),
        type: Object.keys(types)[window.utils.getRandomInt(0, Object.keys(types).length - 1)],
        rooms: window.utils.getRandomInt (1, ROOMS_MAX + 1),
        guests: window.utils.getRandomInt (1, GUESTS_MAX),
        checkin: window.utils.getRandomValue (CHECKS),
        checkout: window.utils.getRandomValue (CHECKS),
        features: window.utils.getCutList (window.utils.getRandomList (FEATURES)),
        description: '',
        photos: window.utils.getRandomList (PHOTOS)
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

  window.data = {
    adverts: adverts,
    PIN: PIN,
    MAIN_PIN: MAIN_PIN,
    PHOTO: PHOTO,
    types: types
  };

  /*window.data = {
    AD_AMOUNT: AD_AMOUNT,
    AD_NUMS: AD_NUMS,
    TITLES: TITLES,
    CHECKS: CHECKS,
    FEATURES: FEATURES,
    PHOTOS: PHOTOS,
    TYPES: TYPES,
    PRICE: PRICE,
    ROOMS_MAX: ROOMS_MAX,
    GUESTS_MAX: GUESTS_MAX,
    PIN: PIN,
    PHOTO: PHOTO,
    MAIN_PIN: MAIN_PIN,
    KEYCODES: KEYCODES,
    adverts: adverts
  };*/

})();
