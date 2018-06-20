'use strict';

// === game-data ===
var MAX_PHOTOS_AMOUNT = 25;

var MIN_COMMENTS_AMOUNT = 1;
var MAX_COMMENTS_AMOUNT = 2;

var MIN_LIKES_AMOUNT = 15;
var MAX_LIKES_AMOUNT = 200;

var DESCRIPTION_AMOUNT = 1;

var MIN_COMMENT_AVATAR = 1;
var MAX_COMMENT_AVATAR = 6;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

// === elements ===
var photoTemplate = document.querySelector('#picture');
var pictureLink = photoTemplate.content.querySelector('.picture__link');
var pictureContainer = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var socialContainer = bigPicture.querySelector('.social__comments');
var bigPictureImage = bigPicture.querySelector('.big-picture__img');
var socialCommentTemplate = socialContainer.querySelector('.social__comment');
var socialCommentCount = bigPicture.querySelector('.social__comment-count');
var socialLoadMore = bigPicture.querySelector('.social__loadmore');

// === functions ===
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var showElement = function (element) {
  element.classList.remove('hidden');
};

// var hideElement = function (element) {
//   element.classList.add('hidden');
// };

// var showElementVisually = function (element) {
//   element.classList.remove('visually-hidden');
// };

var hideElementVisually = function (element) {
  element.classList.add('visually-hidden');
};

var getRandomElementsFromArray = function (array, elementAmount) {
  if (elementAmount > array.length) {
    throw new Error('elementAmount should be less than array.length');
  }
  var newArray = array.slice();
  var finalArray = [];

  do {
    var randomIndex = getRandomNumber(0, newArray.length - 1);
    finalArray.push(newArray.splice(randomIndex, 1)[0]);
  } while (finalArray.length < elementAmount);

  return finalArray;
};

var removeChildren = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var generateRandomPhoto = function (urlNumber) {
  var photo = {};
  photo.url = 'photos/' + urlNumber + '.jpg';
  photo.likes = getRandomNumber(MIN_LIKES_AMOUNT, MAX_LIKES_AMOUNT);
  var commentsAmount = getRandomNumber(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT);
  photo.comments = [];
  photo.comments = getRandomElementsFromArray(COMMENTS, commentsAmount);
  photo.description = getRandomElementsFromArray(DESCRIPTION, DESCRIPTION_AMOUNT);

  return photo;
};

var generatePhotos = function (photoAmount) {
  var photosList = [];

  do {
    photosList.push(generateRandomPhoto(photosList.length + 1));
  } while (photosList.length < photoAmount);

  return photosList;
};

var renderPhoto = function (photoObject) {
  var photo = pictureLink.cloneNode(true);
  photo.querySelector('.picture__img').src = photoObject.url;
  photo.querySelector('.picture__stat--likes').textContent = photoObject.likes;
  photo.querySelector('.picture__stat--comments').textContent = photoObject.comments;

  return photo;
};

var addElementsWithFragment = function (parent, elements, callback) {
  var fragment = document.createDocumentFragment();
  elements.forEach(function (it) {
    fragment.appendChild(callback(it));
  });
  parent.appendChild(fragment);
};

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
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;

  removeChildren(socialContainer);
  addComments(socialContainer, photoData.comments);
};

// === start ===
var photos = generatePhotos(MAX_PHOTOS_AMOUNT);
addElementsWithFragment(pictureContainer, photos, renderPhoto);

fillBigPicture(photos[0]);
hideElementVisually(socialCommentCount);
hideElementVisually(socialLoadMore);

showElement(bigPicture);
