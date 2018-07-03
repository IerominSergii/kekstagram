'use strict';

(function () {
  // import
  var addElementsWithFragment = window.util.addElementsWithFragment;
  var generatePhotos = window.data.generatePhotos;
  var renderPhoto = window.preview.renderPhoto;
  var renderBigPicture = window.picture.renderBigPicture;

  // constants
  var MAX_PHOTOS_AMOUNT = 25;

  // elements
  var pictureContainer = document.querySelector('.pictures');

  // start
  var photos = generatePhotos(MAX_PHOTOS_AMOUNT);
  addElementsWithFragment(pictureContainer, photos, renderPhoto, renderBigPicture);
})();
