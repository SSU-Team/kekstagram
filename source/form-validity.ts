// TODO add capacity validation without usability

const adFormElement = <HTMLFormElement>document.querySelector(`.ad-form`);
const inputTitleElement = <HTMLInputElement>adFormElement.querySelector(`#title`);
const selectTypeElement = <HTMLSelectElement>adFormElement.querySelector(`#type`);
const selectPriceElement = <HTMLSelectElement>adFormElement.querySelector(`#price`);
const selectTimeinElement = <HTMLSelectElement>adFormElement.querySelector(`#timein`);
const selectTimeoutElement = <HTMLSelectElement>adFormElement.querySelector(`#timeout`);
const selectRoomNumberElement = <HTMLSelectElement>adFormElement.querySelector(`#room_number`);
const selectCapacityElement = <HTMLSelectElement>adFormElement.querySelector(`#capacity`);

const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 100;

const TYPE_TO_MIN_PRICE = {
    "bungalow" : 0,
    "flat"     : 1000,
    "house"    : 5000,
    "palace"   : 10000,
}

const TYPE_TO_NAME = {
    "bungalow" : `Бунгало`,
    "flat"     : `Квартира`,
    "house"    : `Дом`,
    "palace"   : `Дворец`,
}

const MAX_PRICE = 1_000_000;

const setAdFormDefaultAttributes = () => {
    adFormElement.method = `POST`;
    adFormElement.action = `https://23.javascript.pages.academy/keksobooking`;
}

// ***

const showSelectTimeoutElementValidityStatus = () => {
    const timeinValue = selectTimeinElement.value;
    const timeoutValue = selectTimeoutElement.value;

    let message = ``;

    selectTimeoutElement.setCustomValidity(message);

    if (timeinValue !== timeoutValue) {
        message = `Checkin and checkout should be the same. Checkout have to be: ${timeinValue}`;
    }

    if ( !(message === ``) ) {
        selectTimeoutElement.setCustomValidity(message);
    }

    selectTimeoutElement.reportValidity();
}

const showSelectPriceElementValidityStatus = () => {
    const typeValue = selectTypeElement.value;
    const priceValue = selectPriceElement.value;

    let typeText;
    let minPrice;

    if (typeValue === `bungalow` || typeValue === `flat` || typeValue === `house` || typeValue === `palace`) {
      typeText = TYPE_TO_NAME[typeValue];
      minPrice = TYPE_TO_MIN_PRICE[typeValue];
    }

    let message = ``;

    selectPriceElement.setCustomValidity(message);

    if (priceValue && minPrice && typeText) {
      if (Number(priceValue) < minPrice) {
          message = `Minimal price for "${typeText}" type is : ${minPrice}. You filled in: ${priceValue}.`;
      } else if (Number(priceValue) > MAX_PRICE) {
          message = `Maximum price for "${typeText}" type is: ${minPrice}. You filled in: ${priceValue}.`;
      }
    }

    if ( !(message === ``) ) {
        selectPriceElement.setCustomValidity(message);
    }

    selectPriceElement.reportValidity()
}

const showTitleElementValidityStatus = () => {
    const valueLength = inputTitleElement.value.length;

    let message = ``;

    inputTitleElement.setCustomValidity(``);

    if (valueLength < TITLE_MIN_LENGTH) {
        message = `Title is too short. Amount of symbols should not be less than ${TITLE_MIN_LENGTH}. There are ${valueLength} symbols in your title now.`;
    } else if (valueLength > TITLE_MAX_LENGTH) {
        message = `Title is too long. Amount of symbols should not be more than ${TITLE_MIN_LENGTH}. There are ${valueLength} symbols in your title now.`;
    }

    if ( !(message === ``) ) {
        inputTitleElement.setCustomValidity(message)
    }

    inputTitleElement.reportValidity();
}

const validateFormAdFormElement = () => {
    showTitleElementValidityStatus();
    showSelectPriceElementValidityStatus();
    showSelectTimeoutElementValidityStatus();
}

// ***

const onSelectPriceElementInput = () => {
    showSelectPriceElementValidityStatus();
}

const onSetupSelectTimeoutElementBlur = () => {
    showSelectTimeoutElementValidityStatus();

    selectTimeoutElement.addEventListener(`input`, onSetupSelectTimeoutElementInput);
}

const onSetupSelectTimeoutElementInput = () => {
    showSelectTimeoutElementValidityStatus();
}

const onSelectPriceElementBlur = () => {
    showSelectPriceElementValidityStatus();

    selectPriceElement.addEventListener(`input`, onSelectPriceElementInput);
}

const onInputTitleElementInput = () => {
    showTitleElementValidityStatus()
}

const onInputTitleElementBlur = () => {
    showTitleElementValidityStatus();

    inputTitleElement.addEventListener(`input`, onInputTitleElementInput);
}

const onFormAdFormElementSubmit = () => {
    validateFormAdFormElement();
}

// ***

const setupSelectTimeoutElement = () => {
    selectTimeoutElement.addEventListener(`blur`, onSetupSelectTimeoutElementBlur);
}

const setupSelectPriceElement = () => {
    selectPriceElement.addEventListener(`blur`, onSelectPriceElementBlur);
}

const setupInputTitleElement = () => {
    inputTitleElement.addEventListener(`blur`, onInputTitleElementBlur);
}

// ***

export const setupFormAdFormValidity = () => {
    setAdFormDefaultAttributes();

    setupInputTitleElement();
    setupSelectPriceElement();
    setupSelectTimeoutElement();

    adFormElement.addEventListener(`submit`, onFormAdFormElementSubmit);
}
