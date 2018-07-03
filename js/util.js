'use strict';

(function () {
  window.util = {
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },
    showElement: function (element) {
      if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
      }
    },
    hideElement: function (element) {
      if (!element.classList.contains('hidden')) {
        element.classList.add('hidden');
      }
    },
    hideElementVisually: function (element) {
      element.classList.add('visually-hidden');
    },
    getRandomElementsFromArray: function (array, elementAmount) {
      if (elementAmount > array.length) {
        throw new Error('elementAmount should be less than array.length');
      }
      var newArray = array.slice();
      var finalArray = [];

      do {
        var randomIndex = window.util.getRandomNumber(0, newArray.length - 1);
        finalArray.push(newArray.splice(randomIndex, 1)[0]);
      } while (finalArray.length < elementAmount);

      return finalArray;
    },
    removeChildren: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    clearClassList: function (element) {
      while (element.classList.length > 0) {
        element.classList.remove(element.classList[0]);
      }
    },
    addElementsWithFragment: function (parent, elements, callback, handler) {
      var fragment = document.createDocumentFragment();
      elements.forEach(function (it) {
        fragment.appendChild(callback(it, handler));
      });
      parent.appendChild(fragment);
    },
  };
})();
