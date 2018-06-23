'use strict';

// === game-data ===
var ESC_KEYCODE = 27;

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
var IMAGE_SCALE_STEP = 25;
var IMAGE_SCALE_MIN = 25;
var IMAGE_SCALE_MAX = 100;
var IMAGE_SCALE_INITIAL_VALUE = 100;

var EFFECTS = {
  'effect-none': 'none',
  'effect-chrome': 'chrome',
  'effect-sepia': 'sepia',
  'effect-marvin': 'marvin',
  'effect-phobos': 'phobos',
  'effect-heat': 'heat',
};

var EFFECTS_MIN_MAX = {
  chrome: {
    min: 0,
    max: 1,
  },
  sepia: {
    min: 0,
    max: 1,
  },
  marvin: {
    min: 0,
    max: 100,
  },
  phobos: {
    min: 0,
    max: 3,
  },
  heat: {
    min: 1,
    max: 3,
  },
};

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
var uploadFile = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancel = imgUploadOverlay.querySelector('#upload-cancel');
var imgUploadResize = imgUploadOverlay.querySelector('.img-upload__resize');
var resizeControlValue = imgUploadResize.querySelector('.resize__control--value');
var resizeControlMinus = imgUploadResize.querySelector('.resize__control--minus');
var resizeControlPlus = imgUploadResize.querySelector('.resize__control--plus');
var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
var imgUploadImage = imgUploadPreview.querySelector('img');
var sizeValue = parseInt(resizeControlValue.value, 10);
var imgUploadEffects = imgUploadOverlay.querySelector('.img-upload__effects');
var imgUploadScale = imgUploadOverlay.querySelector('.img-upload__scale');
var scaleValue = imgUploadScale.querySelector('.scale__value');
var scalePin = imgUploadScale.querySelector('.scale__pin');
var scaleLine = imgUploadScale.querySelector('.scale__line');

// === functions ===
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var showElement = function (element) {
  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
  }
};

var hideElement = function (element) {
  if (!element.classList.contains('hidden')) {
    element.classList.add('hidden');
  }
};

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

// === handlers ===
var uploadCancelClickHandler = function () {
  closeImgUpload();
};

var imgUploadPressEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.preventDefault();
    closeImgUpload();
  }
};

// === functions ===
// scale
var setInputScaleDefaultState = function () {
  resizeControlValue.value = IMAGE_SCALE_INITIAL_VALUE + '%';
  resizeControlValue.step = IMAGE_SCALE_STEP + '%';
  resizeControlValue.min = IMAGE_SCALE_MIN + '%';
  resizeControlValue.max = IMAGE_SCALE_MAX + '%';

  imgUploadImage.style.transform = 'scale(' + (IMAGE_SCALE_INITIAL_VALUE / 100) + ')';
};

var setInputScaleValue = function (scale) {
  resizeControlValue.value = scale + '%';
};

var setImageScale = function (scale) {
  imgUploadImage.style.transform = 'scale(' + (scale / 100) + ')';
};

var increaseControlValue = function () {
  sizeValue = sizeValue <= 75 ? +sizeValue + IMAGE_SCALE_STEP : IMAGE_SCALE_MAX;
};

var decreaseControlValue = function () {
  sizeValue = sizeValue >= 50 ? +sizeValue - IMAGE_SCALE_STEP : IMAGE_SCALE_MIN;
};

var initializeImageScaleHandler = function (evt) {
  if (evt.target === resizeControlMinus) {
    decreaseControlValue();
  }
  if (evt.target === resizeControlPlus) {
    increaseControlValue();
  }

  setInputScaleValue(sizeValue);
  setImageScale(sizeValue);
};

var imgUploadOverlayClickHandler = function (evt) {
  if (evt.target.classList.contains('img-upload__overlay')) {
    hideElement(imgUploadOverlay);
  }
};

var openImgUpload = function () {
  setInputScaleDefaultState();
  showElement(imgUploadOverlay);
  imgUploadOverlay.addEventListener('click', imgUploadOverlayClickHandler);
  uploadCancel.addEventListener('click', uploadCancelClickHandler);
  document.addEventListener('keydown', imgUploadPressEscHandler);

  imgUploadResize.addEventListener('click', initializeImageScaleHandler);
  imgUploadEffects.addEventListener('click', imgUploadEffectsClickHandler);
  scalePin.addEventListener('mouseup', scalePinMouseUpHandler);
};

var closeImgUpload = function () {
  hideElement(imgUploadOverlay);
  imgUploadOverlay.removeEventListener('click', imgUploadOverlayClickHandler);
  uploadCancel.removeEventListener('click', uploadCancelClickHandler);
  document.removeEventListener('keydown', imgUploadPressEscHandler);

  imgUploadResize.removeEventListener('click', initializeImageScaleHandler);
  imgUploadEffects.removeEventListener('click', imgUploadEffectsClickHandler);
  uploadFile.value = '';
  scalePin.removeEventListener('mouseup', scalePinMouseUpHandler);
};

// image effects
var setImageEffect = function (effectName) {
  var newClassName = 'effects__preview--' + EFFECTS[effectName];
  imgUploadImage.classList.add(newClassName);
};

var clearClassList = function (element) {
  while (element.classList.length > 0) {
    element.classList.remove(element.classList[0]);
  }
};

var imgUploadEffectsClickHandler = function () {
  clearImageIntensity();
  var effect = imgUploadEffects.querySelector('input:checked').id;
  clearClassList(imgUploadImage);

  if (EFFECTS[effect] !== EFFECTS['effect-none']) {
    showElement(imgUploadScale);
    setImageEffect(effect);
  } else {
    hideElement(imgUploadScale);
  }
};

var calculateRatioPercent = function (totalValue, partValue) {
  return partValue * 100 / totalValue;
};

var calculateEffectValue = function (value, min, max) {
  return (value * (max - min) / 100) + min;
};

var generateFilterProperty = function (pin, effect) {
  var effectValue = '';

  switch (effect) {
    case 'effect-chrome':
      effectValue = calculateEffectValue(pin, EFFECTS_MIN_MAX.chrome.min, EFFECTS_MIN_MAX.chrome.max);
      return 'grayscale(' + effectValue + ')';
    case 'effect-sepia':
      effectValue = calculateEffectValue(pin, EFFECTS_MIN_MAX.sepia.min, EFFECTS_MIN_MAX.sepia.max);
      return 'sepia(' + effectValue + ')';
    case 'effect-marvin':
      effectValue = calculateEffectValue(pin, EFFECTS_MIN_MAX.marvin.min, EFFECTS_MIN_MAX.marvin.max);
      return 'invert(' + effectValue + '%)';
    case 'effect-phobos':
      effectValue = calculateEffectValue(pin, EFFECTS_MIN_MAX.phobos.min, EFFECTS_MIN_MAX.phobos.max);
      return 'blur(' + effectValue + 'px)';
    case 'effect-heat':
      effectValue = calculateEffectValue(pin, EFFECTS_MIN_MAX.heat.min, EFFECTS_MIN_MAX.heat.max);
      return 'brightness(' + effectValue + ')';
    default:
      throw new Error('Wrong effect type');
  }
};

// return pin retio-position from 0 till 100
var calculatePinRatio = function () {
  var lineWidth = scaleLine.offsetWidth;

  var pinLeft = scalePin.offsetLeft;
  var pinCenter = pinLeft + scalePin.offsetWidth / 2;

  var pinScalePosition = calculateRatioPercent(lineWidth, pinCenter);
  return parseInt(pinScalePosition, 10);
};

var setImageIntensity = function (effectType) {
  var pinRatioValue = calculatePinRatio();

  scaleValue.value = pinRatioValue;
  var filter = generateFilterProperty(pinRatioValue, effectType);
  imgUploadImage.style.filter = filter;
};

var clearImageIntensity = function () {
  imgUploadImage.style.filter = '';
};

var scalePinMouseUpHandler = function () {
  clearImageIntensity();
  var effect = imgUploadEffects.querySelector('input:checked').id;
  setImageIntensity(effect);
};

var start = function () {
  var photos = generatePhotos(MAX_PHOTOS_AMOUNT);
  addElementsWithFragment(pictureContainer, photos, renderPhoto);

  fillBigPicture(photos[0]);
  hideElementVisually(socialCommentCount);
  hideElementVisually(socialLoadMore);

  uploadFile.addEventListener('change', openImgUpload);
};

// === start ===
start();
