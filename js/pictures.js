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
var MAX_HASHTAGS_AMOUNT = 5;
var MAX_HASHTAG_LENGTH = 20;
var MAX_DESCRIPTION_LENGTH = 120;
var DEFAULT_PIN_POSITION = 20;
var DEFAULT_SCALE_LEVEL_POSITION = 91;

// === elements ===
var photoTemplate = document.querySelector('#picture');
var pictureLink = photoTemplate.content.querySelector('.picture__link');
var pictureContainer = document.querySelector('.pictures');

var bigPictureOverlay = document.querySelector('.big-picture');
var bigPictureCancel = bigPictureOverlay.querySelector('.big-picture__cancel');
var socialContainer = bigPictureOverlay.querySelector('.social__comments');
var bigPictureImage = bigPictureOverlay.querySelector('.big-picture__img');
var socialCommentTemplate = socialContainer.querySelector('.social__comment');
var socialCommentCount = bigPictureOverlay.querySelector('.social__comment-count');
var socialLoadMore = bigPictureOverlay.querySelector('.social__loadmore');
var uploadFile = document.querySelector('#upload-file');

var imgUpload = pictureContainer.querySelector('.img-upload');
var imgUploadForm = imgUpload.querySelector('.img-upload__form');
var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
var uploadCancel = imgUploadOverlay.querySelector('#upload-cancel');
var imgUploadResize = imgUploadOverlay.querySelector('.img-upload__resize');
var resizeControlValue = imgUploadResize.querySelector('.resize__control--value');
var resizeControlMinus = imgUploadResize.querySelector('.resize__control--minus');
var resizeControlPlus = imgUploadResize.querySelector('.resize__control--plus');
var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
var imgUploadImage = imgUploadPreview.querySelector('img');
var sizeValue = parseInt(resizeControlValue.value, 10);
var imgUploadEffects = imgUploadOverlay.querySelector('.img-upload__effects');
var effectNoneRadio = imgUploadOverlay.querySelector('#effect-none');
var imgUploadScale = imgUploadOverlay.querySelector('.img-upload__scale');
var scaleValue = imgUploadScale.querySelector('.scale__value');
var scalePin = imgUploadScale.querySelector('.scale__pin');
var scaleLine = imgUploadScale.querySelector('.scale__line');
var scaleLevel = imgUploadScale.querySelector('.scale__level');

var imgUploadText = imgUploadOverlay.querySelector('.img-upload__text');
var textHashtags = imgUploadText.querySelector('.text__hashtags');
var textDescription = imgUploadText.querySelector('.text__description');

// util
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

var clearClassList = function (element) {
  while (element.classList.length > 0) {
    element.classList.remove(element.classList[0]);
  }
};

// generate and render photos
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
  photo.querySelector('.picture__stat--comments').textContent = photoObject.comments.length;

  photo.addEventListener('click', function () {
    renderBigPicture(photoObject);
  });
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

// big picture
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

var renderBigPicture = function (photo) {
  fillBigPicture(photo);
  hideElementVisually(socialCommentCount);
  hideElementVisually(socialLoadMore);

  showBigPicture(bigPictureOverlay);
};


// scale
var setFormDefaultState = function () {
  setDefaultEffectState();
  resizeControlValue.value = IMAGE_SCALE_INITIAL_VALUE + '%';
  resizeControlValue.step = IMAGE_SCALE_STEP + '%';
  resizeControlValue.min = IMAGE_SCALE_MIN + '%';
  resizeControlValue.max = IMAGE_SCALE_MAX + '%';

  imgUploadImage.style.transform = 'scale(' + (IMAGE_SCALE_INITIAL_VALUE / 100) + ')';
  effectNoneRadio.checked = true;
  textHashtags.value = '';
  textDescription.value = '';
  textHashtags.style.outline = '';
  textDescription.style.outline = '';
  textHashtags.setCustomValidity('');
  textDescription.setCustomValidity('');
  hideElement(imgUploadScale);
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
    closeImgUpload();
  }
};


// image effects
var setImageEffect = function (effectName) {
  var newClassName = 'effects__preview--' + EFFECTS[effectName];
  imgUploadImage.classList.add(newClassName);
};

var imgUploadEffectsClickHandler = function () {
  setDefaultEffectState();
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
    case 'effect-none':
      effectValue = '';
      return 'grayscale(' + effectValue + ')';
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

// pin set intensity
// return pin retio-position from 0 till 100
var calculatePinRatio = function () {
  var lineWidth = scaleLine.offsetWidth;

  var pinLeft = scalePin.offsetLeft;
  var pinCenter = pinLeft + scalePin.offsetWidth / 2;

  var pinScalePosition = calculateRatioPercent(lineWidth, pinCenter);
  return parseInt(pinScalePosition, 10);
};

var setImageIntensity = function () {
  var effect = imgUploadEffects.querySelector('input:checked').id;
  var pinRatioValue = calculatePinRatio();

  scaleValue.value = pinRatioValue;
  imgUploadImage.style.filter = generateFilterProperty(pinRatioValue, effect);
};

var clearImageIntensity = function () {
  imgUploadImage.style.filter = '';
};

var setScaleLevel = function (level) {
  scaleLevel.style.width = level + 'px';
};

// === form validity ===
var resetCustomValidity = function (element) {
  element.style.outline = '';
  element.setCustomValidity('');
};

var doHashtagsStartWithHash = function (hashtags) {
  return hashtags.every(function (item) {
    return item[0] === '#';
  });
};

var doesHastagRepeat = function (hashtags) {
  return hashtags.some(function (hashtag) {
    var hashSymbol = '#';
    var pos = 0;
    var hashAmount = 0;

    while (true) {
      var foundPos = hashtag.indexOf(hashSymbol, pos);

      if (foundPos === -1) {
        break;
      }

      pos = foundPos + 1;
      hashAmount++;
    }

    return hashAmount > 1 ? true : false;
  });
};

var doesSomeHashtagConsistOfHashOnly = function (hashtags) {
  return hashtags.some(function (hashtag) {
    return (hashtag[0] === '#' && hashtag.length === 1) ? true : false;
  });
};

var deleteRepeatedHashtags = function (hashtags) {
  var hashtagsWithoutRepeatitions = {};

  hashtags.forEach(function (hashtag) {
    var str = hashtag.toLowerCase();
    hashtagsWithoutRepeatitions[str] = true;
  });

  var uniqueHashtags = Object.keys(hashtagsWithoutRepeatitions);
  return uniqueHashtags.join(' ');
};

var isHashtagsAmountWrong = function (hashtags) {
  return hashtags.length > MAX_HASHTAGS_AMOUNT ? true : false;
};

var areElementsLengthDoesNotMoreThanMax = function (elements, maxLength) {
  return elements.some(function (element) {
    return element.length > maxLength ? true : false;
  });
};

var imgUploadFormSubmitHandler = function () {
  textHashtags.value = textHashtags.value.trim();
};

var textHashtagsInputHandler = function () {
  if (textHashtags.value.length === 0) {
    resetCustomValidity(textHashtags);
  } else {
    textHashtags.value = deleteRepeatedHashtags(textHashtags.value.split(' '));

    var hashtags = textHashtags.value.trim().split(' ');
    if (!doHashtagsStartWithHash(hashtags)) {
      textHashtags.style.outline = '2px solid red';
      textHashtags.setCustomValidity('Хештеги должны начинаться с символа #');
    } else if (doesHastagRepeat(hashtags)) {
      textHashtags.setCustomValidity('Хештеги должны быть разделены пробелами');
    } else if (doesSomeHashtagConsistOfHashOnly(hashtags)) {
      textHashtags.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
    } else if (isHashtagsAmountWrong(hashtags)) {
      textHashtags.setCustomValidity('Количество хэш-тегов должно быть меньше 5');
    } else if (areElementsLengthDoesNotMoreThanMax(hashtags, MAX_HASHTAG_LENGTH)) {
      textHashtags.setCustomValidity('Максимальная длина одного хэш-тега не может быть более 20 символов');
    } else {
      resetCustomValidity(textHashtags);
    }
  }
};

var textDescriptionInputHandler = function () {
  if (textDescription.value.length > MAX_DESCRIPTION_LENGTH) {
    textDescription.style.outline = '2px solid red';
    textDescription.setCustomValidity('Максимальная длина комментария не может быть более 120 символов');
  } else {
    textDescription.style.outline = '';
    textDescription.setCustomValidity('');
  }
};

var uploadCancelClickHandler = function () {
  closeImgUpload();
};

var imgUploadPressEscHandler = function (evt) {
  if (document.activeElement !== textDescription && document.activeElement !== textHashtags) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      closeImgUpload();
    }
  }
};

// functions
var openImgUpload = function () {
  setFormDefaultState();
  showElement(imgUploadOverlay);
  imgUploadOverlay.addEventListener('mousedown', imgUploadOverlayClickHandler);
  uploadCancel.addEventListener('click', uploadCancelClickHandler);
  document.addEventListener('keydown', imgUploadPressEscHandler);

  imgUploadResize.addEventListener('click', initializeImageScaleHandler);
  imgUploadEffects.addEventListener('click', imgUploadEffectsClickHandler);
  scalePin.addEventListener('mousedown', scalePinMouseDownHandler);

  textHashtags.addEventListener('input', textHashtagsInputHandler);
  imgUploadForm.addEventListener('submit', imgUploadFormSubmitHandler);

  textDescription.addEventListener('input', textDescriptionInputHandler);
};

var closeImgUpload = function () {
  hideElement(imgUploadOverlay);
  setFormDefaultState();
  imgUploadOverlay.removeEventListener('mousedown', imgUploadOverlayClickHandler);
  uploadCancel.removeEventListener('click', uploadCancelClickHandler);
  document.removeEventListener('keydown', imgUploadPressEscHandler);

  imgUploadResize.removeEventListener('click', initializeImageScaleHandler);
  imgUploadEffects.removeEventListener('click', imgUploadEffectsClickHandler);
  uploadFile.value = '';
  scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);

  textHashtags.removeEventListener('input', textHashtagsInputHandler);
  imgUploadForm.removeEventListener('submit', imgUploadFormSubmitHandler);

  textDescription.removeEventListener('input', textDescriptionInputHandler);
};

var start = function () {
  var photos = generatePhotos(MAX_PHOTOS_AMOUNT);
  addElementsWithFragment(pictureContainer, photos, renderPhoto);
  uploadFile.addEventListener('change', openImgUpload);
};

// drag and drop
var setDefaultPinPosition = function () {
  scalePin.style.left = DEFAULT_PIN_POSITION + '%';
};

var setDefaultEffectState = function () {
  setDefaultPinPosition();
  setImageIntensity();
  setScaleLevel(DEFAULT_SCALE_LEVEL_POSITION);
};

var setPinPosition = function (shift) {
  if (scalePin.offsetLeft < 0) {
    scalePin.style.left = 0 + 'px';
  } else if (scalePin.offsetLeft > scaleLine.offsetWidth) {
    scalePin.style.left = scaleLine.offsetWidth + 'px';
  } else {
    scalePin.style.left = (scalePin.offsetLeft - shift) + 'px';
  }
};

var setEffectState = function (shift) {
  setPinPosition(shift);
  setImageIntensity();
  setScaleLevel(scalePin.offsetLeft);
};

var scalePinMouseDownHandler = function (downEvt) {
  downEvt.preventDefault();

  var startCoords = downEvt.clientX;

  var scalePinMouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = startCoords - moveEvt.clientX;

    startCoords = startCoords - shift;

    setEffectState(shift);
  };

  var scalePinMouseUpHandler = function (upEvt) {
    if (upEvt.target.classList.contains('img-upload__overlay')) {
      upEvt.preventDefault();
    }
    clearImageIntensity();
    setImageIntensity();
    setScaleLevel(scalePin.offsetLeft);

    document.removeEventListener('mousemove', scalePinMouseMoveHandler);
    document.removeEventListener('mouseup', scalePinMouseUpHandler);
    imgUploadOverlay.addEventListener('mousedown', imgUploadOverlayClickHandler);
  };

  document.addEventListener('mousemove', scalePinMouseMoveHandler);
  document.addEventListener('mouseup', scalePinMouseUpHandler);
  imgUploadOverlay.removeEventListener('mousedown', imgUploadOverlayClickHandler);
};

// === start ===
start();
