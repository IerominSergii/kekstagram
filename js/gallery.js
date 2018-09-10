'use strict';

(function () {
  // constants
  var MAX_PHOTOS_AMOUNT = 25;
  var NEW_PHOTOS_AMOUNT = 10;

  var addElementsWithFragment = window.util.addElementsWithFragment;
  var renderPreview = window.preview.render;
  var renderBigPicture = window.bigPicture.render;
  var getRandomElementsFromArray = window.util.getRandomElementsFromArray;

  var loadData = window.backend.loadData;
  var showError = window.message.error;

  // elements
  var pictureContainer = document.querySelector('.pictures');
  var filterPanelContainer = document.querySelector('.img-filters');
  var filterPanel = filterPanelContainer.querySelector('.img-filters__form');
  var filterPopular = filterPanel.querySelector('#filter-popular');
  var filterNew = filterPanel.querySelector('#filter-new');
  var filterDiscussed = filterPanel.querySelector('#filter-discussed');
  var originalPhotos = [];

  var renderPhotos = function (photos) {
    addElementsWithFragment(
        pictureContainer,
        photos.slice(0, MAX_PHOTOS_AMOUNT),
        renderPreview,
        renderBigPicture
    );
  };

  var showFilters = function () {
    if (filterPanelContainer.classList.contains('img-filters--inactive')) {
      filterPanelContainer.classList.remove('img-filters--inactive');
    }
  };

  var successLoadData = function (photos) {
    originalPhotos = photos;
    showFilters();
    renderPhotos(originalPhotos);
  };

  var toggleSortButtonHandler = function (evt) {
    evt.preventDefault();
    var clickedElement = evt.target;

    for (var i = 0; i < filterPanel.children.length; i++) {
      if (clickedElement !== filterPanel.children[i]) {
        filterPanel.children[i].classList.remove('img-filters__button--active');
      }
    }

    if (clickedElement.classList.contains('img-filters__button')) {
      clickedElement.classList.add('img-filters__button--active');
    }
  };

  var resetPhotos = function () {
    for (var j = pictureContainer.children.length - 1; j > 0; j--) {
      if (pictureContainer.children[j].classList.contains('picture__link')) {
        pictureContainer.removeChild(pictureContainer.children[j]);
      }
    }
  };

  var sortPhotosDiscussedFirst = function (photos) {
    return photos.slice().sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });
  };

  var newPhotosFirstHandler = window.debounce(function () {
    resetPhotos();
    renderPhotos(getRandomElementsFromArray(originalPhotos, NEW_PHOTOS_AMOUNT));
  });

  var discussedPhotosFirstHandler = window.debounce(function () {
    resetPhotos();
    var discussedPhotos = sortPhotosDiscussedFirst(originalPhotos);
    renderPhotos(discussedPhotos);
  });

  var originalPhotosHandler = window.debounce(function () {
    resetPhotos();
    renderPhotos(originalPhotos);
  });

  // start
  filterPanelContainer.addEventListener('click', toggleSortButtonHandler);

  filterPopular.addEventListener('click', originalPhotosHandler);
  filterNew.addEventListener('click', newPhotosFirstHandler);
  filterDiscussed.addEventListener('click', discussedPhotosFirstHandler);

  loadData(successLoadData, showError);
})();
