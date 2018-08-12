'use strict';

(function () {
  // constants
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
  var clearClassList = window.util.clearClassList;
  var hideElement = window.util.hideElement;
  var showElement = window.util.showElement;

  // elements
  var pictureContainer = document.querySelector('.pictures');
  var imgUpload = pictureContainer.querySelector('.img-upload');
  var imgUploadForm = imgUpload.querySelector('.img-upload__form');
  var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
  var imgUploadScale = imgUploadOverlay.querySelector('.img-upload__scale');
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

  // image effects
  var setImageEffect = function (effectName) {
    var newClassName = 'effects__preview--' + EFFECTS[effectName];
    imgUploadImage.classList.add(newClassName);
  };

  var calculateRatioPercent = function (totalValue, partValue) {
    return (partValue * 100) / totalValue;
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

  window.imageEffects = {
    setDefaultEffectState: function () {
      setDefaultPinPosition();
      setImageIntensity();
      setScaleLevel(DEFAULT_SCALE_LEVEL_POSITION);
    },
    initializeImageScaleHandler: function (evt) {
      if (evt.target === resizeControlMinus) {
        decreaseControlValue();
      }
      if (evt.target === resizeControlPlus) {
        increaseControlValue();
      }

      setInputScaleValue(sizeValue);
      setImageScale(sizeValue);
    },
    scalePinMouseDown: function (downEvt, handler) {
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
        imgUploadOverlay.addEventListener('mousedown', handler);
      };

      document.addEventListener('mousemove', scalePinMouseMoveHandler);
      document.addEventListener('mouseup', scalePinMouseUpHandler);
      imgUploadOverlay.removeEventListener('mousedown', handler);
    },
    setImgUploadImageDefaultScale: function () {
      imgUploadImage.style.transform =
        'scale(' + IMAGE_SCALE_INITIAL_VALUE / 100 + ')';
    },
    setDefaultNoneEffect: function () {
      effectNoneRadio.checked = true;
    },
    setDefaultResizeControl: function () {
      resizeControlValue.value = IMAGE_SCALE_INITIAL_VALUE + '%';
      resizeControlValue.step = IMAGE_SCALE_STEP + '%';
      resizeControlValue.min = IMAGE_SCALE_MIN + '%';
      resizeControlValue.max = IMAGE_SCALE_MAX + '%';
    },
    imgUploadEffectsClickHandler: function () {
      setDefaultEffectState();
      var effect = imgUploadEffects.querySelector('input:checked').id;
      clearClassList(imgUploadImage);

      if (EFFECTS[effect] !== EFFECTS['effect-none']) {
        showElement(imgUploadScale);
        setImageEffect(effect);
      } else {
        hideElement(imgUploadScale);
      }
    }
  };
})();
