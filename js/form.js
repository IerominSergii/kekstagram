'use strict';

(function () {
  // constants
  var ESC_KEYCODE = 27;
  var MAX_HASHTAGS_AMOUNT = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_DESCRIPTION_LENGTH = 120;

  var IMAGE_SCALE_INITIAL_VALUE = 100;
  var IMAGE_SCALE_STEP = 25;
  var IMAGE_SCALE_MIN = 25;
  var IMAGE_SCALE_MAX = 100;

  var EFFECTS = {
    'effect-none': 'none',
    'effect-chrome': 'chrome',
    'effect-sepia': 'sepia',
    'effect-marvin': 'marvin',
    'effect-phobos': 'phobos',
    'effect-heat': 'heat'
  };
  var EFFECTS_MIN_MAX = {
    chrome: {
      min: 0,
      max: 1
    },
    sepia: {
      min: 0,
      max: 1
    },
    marvin: {
      min: 0,
      max: 100
    },
    phobos: {
      min: 0,
      max: 3
    },
    heat: {
      min: 1,
      max: 3
    }
  };
  var DEFAULT_PIN_POSITION = 20;
  var DEFAULT_SCALE_LEVEL_POSITION = 91;

  // global
  var hideElement = window.util.hideElement;
  var clearClassList = window.util.clearClassList;
  var showElement = window.util.showElement;
  var error = window.message.error;
  var saveForm = window.backend.saveForm;

  // elements
  var pictureContainer = document.querySelector('.pictures');
  var imgUpload = pictureContainer.querySelector('.img-upload');
  var imgUploadForm = imgUpload.querySelector('.img-upload__form');
  var imgUploadSubmit = imgUploadForm.querySelector('.img-upload__submit');
  var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
  var imgUploadText = imgUploadOverlay.querySelector('.img-upload__text');
  var textHashtags = imgUploadText.querySelector('.text__hashtags');
  var textDescription = imgUploadText.querySelector('.text__description');

  var uploadFile = document.querySelector('#upload-file');

  var imgUploadScale = imgUploadOverlay.querySelector('.img-upload__scale');
  var uploadCancel = imgUploadOverlay.querySelector('#upload-cancel');
  var imgUploadResize = imgUploadOverlay.querySelector('.img-upload__resize');
  var resizeControlValue = imgUploadResize.querySelector(
      '.resize__control--value'
  );
  var resizeControlMinus = imgUploadResize.querySelector(
      '.resize__control--minus'
  );
  var resizeControlPlus = imgUploadResize.querySelector(
      '.resize__control--plus'
  );
  var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
  var imgUploadImage = imgUploadPreview.querySelector('img');
  var sizeValue = parseInt(resizeControlValue.value, 10);
  var imgUploadEffects = imgUploadOverlay.querySelector('.img-upload__effects');
  var effectNoneRadio = imgUploadOverlay.querySelector('#effect-none');

  var scaleValue = imgUploadScale.querySelector('.scale__value');
  var scalePin = imgUploadScale.querySelector('.scale__pin');
  var scaleLine = imgUploadScale.querySelector('.scale__line');
  var scaleLevel = imgUploadScale.querySelector('.scale__level');

  // functions
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
      return hashtag[0] === '#' && hashtag.length === 1 ? true : false;
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

  var trimInputValue = function (input) {
    input.value = input.value.trim();
  };

  var textHashtagsInputHandler = function () {
    if (textHashtags.value.length === 0) {
      resetCustomValidity(textHashtags);
    } else {
      textHashtags.value = deleteRepeatedHashtags(
          textHashtags.value.split(' ')
      );

      var hashtags = textHashtags.value.trim().split(' ');
      if (!doHashtagsStartWithHash(hashtags)) {
        textHashtags.style.outline = '2px solid red';
        textHashtags.setCustomValidity('Хештеги должны начинаться с символа #');
      } else if (doesHastagRepeat(hashtags)) {
        textHashtags.setCustomValidity(
            'Хештеги должны быть разделены пробелами'
        );
      } else if (doesSomeHashtagConsistOfHashOnly(hashtags)) {
        textHashtags.setCustomValidity(
            'Хеш-тег не может состоять только из одной решётки'
        );
      } else if (isHashtagsAmountWrong(hashtags)) {
        textHashtags.setCustomValidity(
            'Количество хэш-тегов должно быть меньше 5'
        );
      } else if (
        areElementsLengthDoesNotMoreThanMax(hashtags, MAX_HASHTAG_LENGTH)
      ) {
        textHashtags.setCustomValidity(
            'Максимальная длина одного хэш-тега не может быть более 20 символов'
        );
      } else {
        resetCustomValidity(textHashtags);
      }
    }
  };

  var textDescriptionInputHandler = function () {
    if (textDescription.value.length > MAX_DESCRIPTION_LENGTH) {
      textDescription.style.outline = '2px solid red';
      textDescription.setCustomValidity(
          'Максимальная длина комментария не может быть более 120 символов'
      );
    } else {
      textDescription.style.outline = '';
      textDescription.setCustomValidity('');
    }
  };

  var uploadCancelClickHandler = function () {
    closeImgUpload();
  };

  var imgUploadPressEscHandler = function (evt) {
    if (
      document.activeElement !== textDescription &&
      document.activeElement !== textHashtags
    ) {
      if (evt.keyCode === ESC_KEYCODE) {
        evt.preventDefault();
        closeImgUpload();
      }
    }
  };

  var setFormDefaultState = function () {
    setDefaultEffectState();
    resizeControlValue.value = IMAGE_SCALE_INITIAL_VALUE + '%';
    resizeControlValue.step = IMAGE_SCALE_STEP + '%';
    resizeControlValue.min = IMAGE_SCALE_MIN + '%';
    resizeControlValue.max = IMAGE_SCALE_MAX + '%';

    imgUploadImage.style.transform =
      'scale(' + IMAGE_SCALE_INITIAL_VALUE / 100 + ')';
    effectNoneRadio.checked = true;
    textHashtags.value = '';
    textDescription.value = '';
    textHashtags.style.outline = '';
    textDescription.style.outline = '';
    textHashtags.setCustomValidity('');
    textDescription.setCustomValidity('');
    hideElement(imgUploadScale);
  };

  // scale
  var setInputScaleValue = function (scale) {
    resizeControlValue.value = scale + '%';
  };

  var setImageScale = function (scale) {
    imgUploadImage.style.transform = 'scale(' + scale / 100 + ')';
  };

  var increaseControlValue = function () {
    sizeValue =
      sizeValue <= 75 ? +sizeValue + IMAGE_SCALE_STEP : IMAGE_SCALE_MAX;
  };

  var decreaseControlValue = function () {
    sizeValue =
      sizeValue >= 50 ? +sizeValue - IMAGE_SCALE_STEP : IMAGE_SCALE_MIN;
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
    return (partValue * 100) / totalValue;
  };

  var calculateEffectValue = function (value, min, max) {
    return (value * (max - min)) / 100 + min;
  };

  var generateFilterProperty = function (pin, effect) {
    var effectValue = '';

    switch (effect) {
      case 'effect-none':
        effectValue = '';
        return 'grayscale(' + effectValue + ')';
      case 'effect-chrome':
        effectValue = calculateEffectValue(
            pin,
            EFFECTS_MIN_MAX.chrome.min,
            EFFECTS_MIN_MAX.chrome.max
        );
        return 'grayscale(' + effectValue + ')';
      case 'effect-sepia':
        effectValue = calculateEffectValue(
            pin,
            EFFECTS_MIN_MAX.sepia.min,
            EFFECTS_MIN_MAX.sepia.max
        );
        return 'sepia(' + effectValue + ')';
      case 'effect-marvin':
        effectValue = calculateEffectValue(
            pin,
            EFFECTS_MIN_MAX.marvin.min,
            EFFECTS_MIN_MAX.marvin.max
        );
        return 'invert(' + effectValue + '%)';
      case 'effect-phobos':
        effectValue = calculateEffectValue(
            pin,
            EFFECTS_MIN_MAX.phobos.min,
            EFFECTS_MIN_MAX.phobos.max
        );
        return 'blur(' + effectValue + 'px)';
      case 'effect-heat':
        effectValue = calculateEffectValue(
            pin,
            EFFECTS_MIN_MAX.heat.min,
            EFFECTS_MIN_MAX.heat.max
        );
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

  var submitFormHandler = function (evt) {
    if (textHashtags.validity.valid && textDescription.validity.valid) {
      evt.preventDefault();
      trimInputValue(textHashtags);
      saveForm(new FormData(imgUploadForm), closeImgUpload, error);
    }
  };

  // functions
  var openImgUpload = function () {
    setFormDefaultState();
    showElement(imgUploadOverlay);
    imgUploadOverlay.addEventListener(
        'mousedown',
        imgUploadOverlayClickHandler
    );
    uploadCancel.addEventListener('click', uploadCancelClickHandler);
    document.addEventListener('keydown', imgUploadPressEscHandler);

    imgUploadResize.addEventListener('click', initializeImageScaleHandler);
    imgUploadEffects.addEventListener('click', imgUploadEffectsClickHandler);
    scalePin.addEventListener('mousedown', scalePinMouseDownHandler);

    textHashtags.addEventListener('input', textHashtagsInputHandler);
    // imgUploadForm.addEventListener('submit', imgUploadFormSubmitHandler);
    imgUploadSubmit.addEventListener('click', submitFormHandler);

    textDescription.addEventListener('input', textDescriptionInputHandler);
  };

  var closeImgUpload = function () {
    hideElement(imgUploadOverlay);
    setFormDefaultState();
    imgUploadOverlay.removeEventListener(
        'mousedown',
        imgUploadOverlayClickHandler
    );
    uploadCancel.removeEventListener('click', uploadCancelClickHandler);
    document.removeEventListener('keydown', imgUploadPressEscHandler);

    imgUploadResize.removeEventListener('click', initializeImageScaleHandler);
    imgUploadEffects.removeEventListener('click', imgUploadEffectsClickHandler);
    uploadFile.value = '';
    scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);

    textHashtags.removeEventListener('input', textHashtagsInputHandler);
    // imgUploadForm.removeEventListener('submit', imgUploadFormSubmitHandler);
    imgUploadSubmit.removeEventListener('click', submitFormHandler);

    textDescription.removeEventListener('input', textDescriptionInputHandler);
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
      scalePin.style.left = scalePin.offsetLeft - shift + 'px';
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
      imgUploadOverlay.addEventListener(
          'mousedown',
          imgUploadOverlayClickHandler
      );
    };

    document.addEventListener('mousemove', scalePinMouseMoveHandler);
    document.addEventListener('mouseup', scalePinMouseUpHandler);
    imgUploadOverlay.removeEventListener(
        'mousedown',
        imgUploadOverlayClickHandler
    );
  };

  uploadFile.addEventListener('change', openImgUpload);
})();
