'use strict';

(function () {
  // constants
  var MAX_PHOTOS_AMOUNT = 25;

  // global
  var addElementsWithFragment = window.util.addElementsWithFragment;
  var renderPreview = window.preview.render;
  var renderBigPicture = window.bigPicture.render;

  var loadData = window.backend.loadData;
  var showError = window.message.error;

  var renderPhotos = function (photos) {
    addElementsWithFragment(
        pictureContainer,
        photos.slice(0, MAX_PHOTOS_AMOUNT),
        renderPreview,
        renderBigPicture
    );
  };

  // elements
  var pictureContainer = document.querySelector('.pictures');

  // start
  loadData(renderPhotos, showError);
})();
