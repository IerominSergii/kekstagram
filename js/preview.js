'use strict';

(function () {
  // elements
  var photoTemplate = document.querySelector('#picture');
  var pictureLink = photoTemplate.content.querySelector('.picture__link');

  // export
  window.preview = {
    renderPhoto: function (photoObject, renderBigPictureHandler) {
      var photo = pictureLink.cloneNode(true);
      photo.querySelector('.picture__img').src = photoObject.url;
      photo.querySelector('.picture__stat--likes').textContent = photoObject.likes;
      photo.querySelector('.picture__stat--comments').textContent = photoObject.comments.length;

      photo.addEventListener('click', function () {
        renderBigPictureHandler(photoObject);
      });
      return photo;
    },
  };
})();
