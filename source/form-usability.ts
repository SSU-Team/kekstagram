// TODO add Timeout sync from timein

const adFormElement = <HTMLFormElement>document.querySelector(`.ad-form`);
const inputTitleElement = <HTMLInputElement>adFormElement.querySelector(`#title`);
const selectTypeElement = <HTMLSelectElement>adFormElement.querySelector(`#type`);
const selectPriceElement = <HTMLSelectElement>adFormElement.querySelector(`#price`);
const selectTimeinElement = <HTMLSelectElement>adFormElement.querySelector(`#timein`);
const selectTimeoutElement = <HTMLSelectElement>adFormElement.querySelector(`#timeout`);
const selectRoomNumberElement = <HTMLSelectElement>adFormElement.querySelector(`#room_number`);
const selectCapacityElement = <HTMLSelectElement>adFormElement.querySelector(`#capacity`);

const TYPE_TO_MIN_PRICE = {
  "bungalow" : 0,
  "flat"     : 1000,
  "hotel"    : 3000,
  "house"    : 5000,
  "palace"   : 10000,
}

const ROOM_NUMBER_TO_POSSIBLE_COPAPICITY = {
  1: [1,],
  2: [1,2,],
  3: [1,2,3,],
  100: [0,],
}

// ***
//
// SYNCS

//  timein & timeout
const syncTimeinToTimeout = () => selectTimeoutElement.value = selectTimeinElement.value;
const syncTimoutToTimein = () => selectTimeinElement.value = selectTimeoutElement.value;

// type & price
const syncTypeToPrice = () => {
  let minPrice;

  if (
    selectTypeElement.value === `bungalow` ||
    selectTypeElement.value === `flat` ||
    selectTypeElement.value === `hotel` ||
    selectTypeElement.value === `house` ||
    selectTypeElement.value === `palace`
  ) {

    minPrice = TYPE_TO_MIN_PRICE[selectTypeElement.value];
  }

  selectPriceElement.setAttribute(`placeholder`, `${minPrice}`);
  selectPriceElement.setAttribute(`min`, `${minPrice}`);
}

// type & price
const syncRoomsCopapicity = () => {
  const roomNumber = parseInt(selectRoomNumberElement.value);
  let possibleOptionCapacityValues: number[];

  if (roomNumber === 1 || roomNumber === 2 || roomNumber === 3 || roomNumber === 100) {
    possibleOptionCapacityValues = ROOM_NUMBER_TO_POSSIBLE_COPAPICITY[roomNumber];
  }

  const optionCapacityElementList = Array.from(selectCapacityElement.querySelectorAll(`option`));

  optionCapacityElementList.map(optionCapacityElement => {
    optionCapacityElement.disabled = false;;
  });

  optionCapacityElementList.map(optionCapacityElement => {
    const optionCapacityValue = parseInt(optionCapacityElement.value);

    if ( possibleOptionCapacityValues.indexOf(optionCapacityValue) === -1 ) {
      optionCapacityElement.disabled = true;
    } else {
      optionCapacityElement.selected = true;
    }
  });
}

// ***
//
//  INTERACTIONS

//  timein & timeout
const onSelectTimeinChange = () => syncTimeinToTimeout();
const onSelectTimeoutChange = () => syncTimoutToTimein();

const setupSelectTimeinTimeoutInteraction = () => {
  selectTimeinElement.addEventListener(`change`, onSelectTimeinChange)
  selectTimeoutElement.addEventListener(`change`, onSelectTimeoutChange)
}

// type & price
const onSelectTypeChange = () => syncTypeToPrice();
const setupSelectTypePriceInteraction = () => selectTypeElement.addEventListener(`change`, onSelectTypeChange);

// rooms & copacity
const onSelectRoomsNumberChange = () => syncRoomsCopapicity();
const setupSelectRoomsNumberCopacityInteraction = () => selectRoomNumberElement.addEventListener(`change`, onSelectRoomsNumberChange);


// ***
//
//  DEFAULT ATTRIBUTES


// title
const setInputTitleElementDefaultAttributes = () => {
  inputTitleElement.setAttribute(`required`, `required`);
  inputTitleElement.setAttribute(`minlength`, `2`,);
  inputTitleElement.setAttribute(`maxlength`, `100`,);
}

// type
const setSelectTypeElementDefaultAttributes = () => selectTypeElement.value = `flat`;

// price
const setSelectPriceElementDefaultAttributes = () => {
  selectPriceElement.setAttribute(`required`, `required`);
  selectPriceElement.setAttribute(`type`, `number`);
  selectPriceElement.setAttribute(`max`, `1_000_000`);
}

// rooms
const setSelectRoomNumberElementDefaultAttributes = () => selectRoomNumberElement.value = `1`;

// ***
//
// SETUP

const yourAvatarImgElement = <HTMLImageElement>adFormElement.querySelector(`.ad-form-header__preview img`);
const yourAvatarInputElement = <HTMLInputElement>adFormElement.querySelector(`input[name="avatar"]`);

const ALLOWED_IMAGE_TYPES = [
  `image/gif`,
  `image/png`,
  `image/jpeg`,
  `image/jpg`,
  `image/webp`,
];

const ALLOWED_IMAGE_SIZE = 1_000_000;

const handleTypeError = (type: string): void => alert(`${type} is not allowed! Use following types: ${ALLOWED_IMAGE_TYPES}`);
const handleSizeError = (size: number): void => alert(`Maximum allowed size is ${ALLOWED_IMAGE_SIZE / 1_000_000} MB. Your size is ${size / 1_000_000} MB`);

const setLastImagePreview = (inputFile: HTMLInputElement, img: HTMLImageElement) => {
  if (inputFile.files && inputFile.files.length > 0) {
    const fileIndex = inputFile.files.length - 1;
    const type = inputFile.files[fileIndex].type;
    const size = inputFile.files[fileIndex].size;

    if (ALLOWED_IMAGE_TYPES.indexOf(type) && size <= ALLOWED_IMAGE_SIZE) {
      const reader: FileReader = new FileReader();
      reader.addEventListener(`load`, () => img.src = `${reader.result}`);
      reader.readAsDataURL(inputFile.files[fileIndex]);
    } else {
      ALLOWED_IMAGE_TYPES.indexOf(type) && handleTypeError(type);
      size >= ALLOWED_IMAGE_SIZE && handleSizeError(size);
    }
  }
}

const yourAvatarInputElementOnChange = () => setLastImagePreview(yourAvatarInputElement, yourAvatarImgElement);
const setupAvatarPreview = () => yourAvatarInputElement.addEventListener(`change`, yourAvatarInputElementOnChange);

const adFormPhotoElement = <HTMLDivElement>adFormElement.querySelector(`.ad-form__photo`);
const adFormPhotoInputElement = <HTMLInputElement>adFormElement.querySelector(`input[name="images"]`);

// todo | rearchitect structure for not empty img creation.
const adFormPhotoInputElementOnChange = () => {
  const img = document.createElement(`img`);
  img.width = 70;
  adFormPhotoElement.append(img);

  setLastImagePreview(adFormPhotoInputElement, img);
}

const setupPropertyPhotoPreview = () => adFormPhotoInputElement.addEventListener(`change`, adFormPhotoInputElementOnChange);

export const setupFormAdFormUsability = (): void => {
  setInputTitleElementDefaultAttributes();
  setSelectTypeElementDefaultAttributes();
  setSelectPriceElementDefaultAttributes();
  setSelectRoomNumberElementDefaultAttributes();

  syncTypeToPrice();
  syncRoomsCopapicity();

  setupSelectTypePriceInteraction();
  setupSelectTimeinTimeoutInteraction();
  setupSelectRoomsNumberCopacityInteraction();

  setupAvatarPreview();
  setupPropertyPhotoPreview();
}
