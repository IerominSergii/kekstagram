'use strict';

(function () {
  // constants
  var ESC_KEYCODE = 27;
  var MAX_HASHTAGS_AMOUNT = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_DESCRIPTION_LENGTH = 120;

  // global
  var hideElement = window.util.hideElement;
  var showElement = window.util.showElement;
  var error = window.message.error;
  var saveForm = window.backend.saveForm;
  var setDefaultEffectState = window.imageEffects.setDefaultEffectState;
  var setDefaultResizeControl = window.imageEffects.setDefaultResizeControl;
  var setImgUploadImageDefaultScale =
    window.imageEffects.setImgUploadImageDefaultScale;
  var setDefaultNoneEffect = window.imageEffects.setDefaultNoneEffect;
  var imgUploadEffectsClickHandler =
    window.imageEffects.imgUploadEffectsClickHandler;
  var scalePinMouseDown = window.imageEffects.scalePinMouseDown;
  var initializeImageScaleHandler =
    window.imageEffects.initializeImageScaleHandler;

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
  var imgUploadEffects = imgUploadOverlay.querySelector('.img-upload__effects');
  var scalePin = imgUploadScale.querySelector('.scale__pin');

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
      var symbol = '#';
      var hashAmount = 0;
      var position = -1;

      // начинаю искать symbol с позиции 0 (position + 1)
      // если нашел, то начинаю искать со следующей позиции,
      // каждый раз увеличивая hashAmount на единицу, если symbol был найден
      while ((position = hashtag.indexOf(symbol, position + 1) !== -1)) {
        hashAmount++;
      }

      return hashAmount > 1;
    });
  };

  var doesSomeHashtagConsistOfHashOnly = function (hashtags) {
    return hashtags.some(function (hashtag) {
      return hashtag[0] === '#' && hashtag.length === 1;
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
    setDefaultResizeControl();
    setImgUploadImageDefaultScale();
    setDefaultNoneEffect();

    textHashtags.value = '';
    textDescription.value = '';
    textHashtags.style.outline = '';
    textDescription.style.outline = '';
    textHashtags.setCustomValidity('');
    textDescription.setCustomValidity('');
    hideElement(imgUploadScale);
  };

  var submitFormHandler = function (evt) {
    if (textHashtags.validity.valid && textDescription.validity.valid) {
      evt.preventDefault();
      trimInputValue(textHashtags);
      textHashtags.value = deleteRepeatedHashtags(
          textHashtags.value.split(' ')
      );
      saveForm(new FormData(imgUploadForm), closeImgUpload, error);
    }
  };

  var imgUploadOverlayClickHandler = function (evt) {
    if (evt.target.classList.contains('img-upload__overlay')) {
      closeImgUpload();
    }
  };

  var scalePinMouseDownHandler = function (downEvt) {
    scalePinMouseDown(downEvt, imgUploadOverlayClickHandler);
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

  uploadFile.addEventListener('change', openImgUpload);
})();
