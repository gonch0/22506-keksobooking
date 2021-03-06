'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 5;
  var lastTimeout;
  window.debounce = function (fn) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fn, DEBOUNCE_INTERVAL);
  };
})();
