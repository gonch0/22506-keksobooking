'use strict';

(function () {

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinBlock = document.querySelector('.map__pins');
  var map = document.querySelector('.map');

  var createPin = function (object) {
    var advertPin = pinTemplate.cloneNode(true);
    var pinImage = advertPin.querySelector('img');

    advertPin.style.left = object.location.x - 0.5 * window.data.PIN.width + 'px';
    advertPin.style.top = object.location.y - window.data.PIN.height + 'px';
    pinImage.src = object.author.avatar;
    pinImage.alt = object.offer.title;


    advertPin.addEventListener('click', function () {
      var popup = document.querySelector('.popup');
      if (popup) {
        popup.remove();
      }
      console.log('PIN NUM = ' + advertPin.getAttribute('pin-num'));
      var cardItem = window.card.createCard(window.data.adverts[advertPin.getAttribute('pin-num')]);

      map.insertBefore(cardItem, pinBlock);
    });

    return advertPin;
  };


  window.pin = {
    createPin: createPin
  };

})();


