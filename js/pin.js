'use strict';

(function () {

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinBlock = document.querySelector('.map__pins');
  var map = document.querySelector('.map');

  var createPin = function (pinData) {
    var advertPin = pinTemplate.cloneNode(true);
    var pinImage = advertPin.querySelector('img');

    advertPin.style.left = pinData.location.x - 0.5 * window.data.PIN.width + 'px';
    advertPin.style.top = pinData.location.y - window.data.PIN.height + 'px';
    pinImage.src = pinData.author.avatar;
    pinImage.alt = pinData.offer.title;

    advertPin.addEventListener('click', function () {
      var popup = document.querySelector('.popup');
      if (popup) {
        popup.remove();
        var activePins = document.querySelectorAll('.map__pin--active');
        activePins.forEach(function (pin) {
          pin.classList.remove('map__pin--active');
        });
      }
      advertPin.classList.add('map__pin--active');
      var cardItem = window.card.createCard(pinData);
      map.insertBefore(cardItem, pinBlock);
    });

    return advertPin;
  };


  window.pin = {
    createPin: createPin
  };

})();
