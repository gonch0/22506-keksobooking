'use strict';

(function () {

  var mapFilters = document.querySelector('.map__filters');

  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');

  var PRICE_RANGE = {
    low: 10000,
    high: 50000
  };

  // Фильтры и вспомогательные функции
  var checkTypesMatch = function (data) {
    return (
      housingType.value === 'any' || data.offer.type === housingType.value
    );
  };

  var checkPricesMatch = function (data) {
    var priceMatch = true;
    if (housingPrice.value !== 'any') {
      switch (housingPrice.value) {
        case 'low':
          priceMatch = data.offer.price < PRICE_RANGE.low;
          break;
        case 'middle':
          priceMatch = data.offer.price >= PRICE_RANGE.low && data.offer.price < PRICE_RANGE.high;
          break;
        case 'high':
          priceMatch = data.offer.price >= PRICE_RANGE.high;
          break;
      }
    }
    return priceMatch;
  };

  var checkRoomsMatch = function (data) {
    return (
      housingRooms.value === 'any' || data.offer.rooms === +housingRooms.value
    );
  };

  var checkGuestsMatch = function (data) {
    return (
      housingGuests.value === 'any' || data.offer.guests === +housingGuests.value
    );
  };

  var checkFeaturesMatch = function (data) {
    var featuresMatch = true;
    var checkedFeaturesElements = housingFeatures.querySelectorAll('input:checked');
    checkedFeaturesElements.forEach(function (feature) {
      if (data.offer.features.indexOf(feature.value) === -1) {
        featuresMatch = false;
      }
    });
    return featuresMatch;
  };

  var applyFilters = function (ads) {
    var filteredAds = ads.filter(function (ad) {

      return (
        checkTypesMatch(ad) &&
        checkPricesMatch(ad) &&
        checkRoomsMatch(ad) &&
        checkGuestsMatch(ad) &&
        checkFeaturesMatch(ad)
      );
    });
    return filteredAds;
  };

  window.filter = {
    applyFilters: applyFilters
  };

})();
