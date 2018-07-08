'use strict';

(function () {
  // constants
  var MAX_PHOTOS_AMOUNT = 25;

  // global
  var addElementsWithFragment = window.util.addElementsWithFragment;
  var generatePhotos = window.data.generatePhotos;
  var renderPreview = window.preview.render;
  var renderBigPicture = window.bigPicture.render;

  // elements
  var pictureContainer = document.querySelector('.pictures');

  // start
  var photos = generatePhotos(MAX_PHOTOS_AMOUNT);
  addElementsWithFragment(pictureContainer, photos, renderPreview, renderBigPicture);
})();
