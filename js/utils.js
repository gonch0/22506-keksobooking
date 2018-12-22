'use strict';

(function () {

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

  window.utils = {
    getRandomInt: getRandomInt,
    getRandomValue: getRandomValue,
    getRandomList: getRandomList,
    getCutList: getCutList
  };

})();
