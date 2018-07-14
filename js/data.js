'use strict';

(function () {
  // constants
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

  // global
  var getRandomElementsFromArray = window.util.getRandomElementsFromArray;
  var getRandomNumber = window.util.getRandomNumber;

  // functions
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

  window.data = {
    generatePhotos: function (photoAmount) {
      var photosList = [];

      do {
        photosList.push(generateRandomPhoto(photosList.length + 1));
      } while (photosList.length < photoAmount);

      return photosList;
    },
  };
})();
