'use strict';

// === game-data ===
var MIN_PHOTOS_AMOUNT = 1;
var MAX_PHOTOS_AMOUNT = 25;
var MIN_COMMENTS_AMOUNT = 1;
var MAX_COMMENTS_AMOUNT = 2;
var MIN_LIKES_AMOUNT = 15;
var MAX_LIKES_AMOUNT = 200;
var DESCRIPTION_AMOUNT = 1;
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
// var pictureLink = photoTemplate.content.querySelector('.picture__link');
// var pictureImage = pictureLink.querySelector('.picture__img');

// === functions ===
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomElementsFromArray = function(array, elementAmount) {
  if (elementAmount > array.length) {
    throw newError('elementAmount should be less than array.length');
  }
  var newArray = array.slice();
  var finalArray = [];

  for (var k = 1; k <= elementAmount; k++) {
    var randomIndex = getRandomNumber(0, newArray.length - 1);
    var element = newArray.splice(randomIndex, 1);
    finalArray.push(element);
  }

  return finalArray;
};

var generateRandomPhoto = function () {
  var photo = {};
  // photo.url
  photo.url = 'photos/' + getRandomNumber(MIN_PHOTOS_AMOUNT, MAX_PHOTOS_AMOUNT) + '.jpg';
  // photo.likes
  photo.likes = getRandomNumber(MIN_LIKES_AMOUNT, MAX_LIKES_AMOUNT);
  // photo.comments
  var commentsAmount = getRandomNumber(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT);
  photo.comments = [];
  photo.comments = getRandomElementsFromArray(COMMENTS, commentsAmount);
  // photo.description
  photo.description = getRandomElementsFromArray(DESCRIPTION, DESCRIPTION_AMOUNT);

  return photo;
};

var renderPhoto = function (photoObject) {
  var photo = photoTemplate.cloneNode(true);
  photo.querySelector('.picture__img').src = photoObject.url;
  photo.querySelector('.picture__stat--likes').textContent = photoObject.likes;
  photo.querySelector('.picture__stat--comments').textContent = photoObject.comments;

  return photo;
};

// === start ===
