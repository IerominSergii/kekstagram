'use strict';

(function () {
  // import
  var removeChildren = window.util.removeChildren;
  var showElement = window.util.showElement;
  var hideElement = window.util.hideElement;
  var hideElementVisually = window.util.hideElementVisually;
  var getRandomNumber = window.util.getRandomNumber;

  // constants
  var MIN_COMMENT_AVATAR = 1;
  var MAX_COMMENT_AVATAR = 6;

  // elements
  var bigPictureOverlay = document.querySelector('.big-picture');
  var bigPictureCancel = bigPictureOverlay.querySelector('.big-picture__cancel');
  var socialContainer = bigPictureOverlay.querySelector('.social__comments');
  var bigPictureImage = bigPictureOverlay.querySelector('.big-picture__img');
  var socialCommentCount = bigPictureOverlay.querySelector('.social__comment-count');
  var socialLoadMore = bigPictureOverlay.querySelector('.social__loadmore');
  var socialCommentTemplate = socialContainer.querySelector('.social__comment');

  // functions
  var addComments = function (parent, comments) {
    var commentsFragment = document.createDocumentFragment();

    comments.forEach(function (it) {
      var comment = socialCommentTemplate.cloneNode(true);
      var avatarNumber = getRandomNumber(MIN_COMMENT_AVATAR, MAX_COMMENT_AVATAR);
      var commentImage = comment.querySelector('img');
      var commentText = comment.querySelector('.social__text');

      commentImage.style.src = 'img/avatar-' + avatarNumber + '.svg';
      commentText.textContent = it;
      commentsFragment.appendChild(comment);
    });

    parent.appendChild(commentsFragment);
  };

  var fillBigPicture = function (photoData) {
    bigPictureImage.querySelector('img').src = photoData.url;
    bigPictureOverlay.querySelector('.likes-count').textContent = photoData.likes;
    bigPictureOverlay.querySelector('.comments-count').textContent = photoData.comments.length;
    bigPictureOverlay.querySelector('.social__caption').textContent = photoData.description;

    removeChildren(socialContainer);
    addComments(socialContainer, photoData.comments);
  };

  var bigPictureOverlayPressEscHandler = function () {
    closeBigPicture();
  };

  var showBigPicture = function () {
    showElement(bigPictureOverlay);
    bigPictureOverlay.addEventListener('click', closeBigPicture);
    bigPictureCancel.addEventListener('click', closeBigPicture);
    document.addEventListener('keydown', bigPictureOverlayPressEscHandler);
  };

  var closeBigPicture = function () {
    hideElement(bigPictureOverlay);
    bigPictureOverlay.removeEventListener('click', closeBigPicture);
    bigPictureCancel.removeEventListener('click', closeBigPicture);
    document.removeEventListener('keydown', bigPictureOverlayPressEscHandler);
  };

  // export
  window.picture = {
    renderBigPicture: function (photo) {
      fillBigPicture(photo);
      hideElementVisually(socialCommentCount);
      hideElementVisually(socialLoadMore);
      showBigPicture(bigPictureOverlay);
    },
  };
})();
