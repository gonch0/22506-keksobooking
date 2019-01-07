'use strict';
(function () {

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
    height: 62,
    left: 570,
    top: 375
  };

  var KEYCODES = {
    esc: 27,
    enter: 13
  };

  var adverts = [];

  window.data = {
    PIN: PIN,
    MAIN_PIN: MAIN_PIN,
    PHOTO: PHOTO,
    KEYCODES: KEYCODES,
    types: types,
    adverts: adverts
  };

})();
