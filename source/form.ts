import { LatLng, } from "leaflet";

import { setupFormAdFormValidity, } from './form-validity';
import { setupFormAdFormUsability, } from './form-usability';

const form = <HTMLFormElement>document.querySelector(`.ad-form`);
const address = <HTMLInputElement>form.querySelector(`#address`);

const closePopup = () => {
  document.querySelector(`.success`)?.remove();
  document.querySelector(`.error`)?.remove();
  window.removeEventListener(`keydown`, handleWindowOnEscKeydown);
  form.reset();
}

const handleWindowOnEscKeydown = (event: KeyboardEvent): void => {
  if (event.key === `Escape`) {
    closePopup();
  }
};

const showSuccessPopup = (): void => {
  const popupTemplate = <HTMLTemplateElement>document.querySelector(`#success`);
  const popupElement = <HTMLDivElement>popupTemplate.content.cloneNode(true);
  document.body.append(popupElement);

  window.addEventListener(`keydown`, handleWindowOnEscKeydown);
}

const errorButtonOnClick = () => {
  closePopup();
}

const showErrorPopup = (status: number, statusText: string): void => {
  const popupTemplate = <HTMLTemplateElement>document.querySelector(`#error`);
  const popupElement = <HTMLDivElement>popupTemplate.content.cloneNode(true);
  const errorButton = <HTMLBaseElement>popupElement.querySelector(`.error__button`);
  errorButton.addEventListener(`click`, errorButtonOnClick);

  document.body.append(popupElement);
  window.addEventListener(`keydown`, handleWindowOnEscKeydown);
}

const disableForm = (): void => {
  form.classList.add(`ad-form--disabled`);
}

const enableForm = (): void => {
  form.classList.remove(`ad-form--disabled`);
}

const API = `https://23.javascript.pages.academy/keksobooking`;
const METHOD = `POST`;

const sendNotice = (data: FormData): any => {
  disableForm();

  fetch(API, {method: METHOD, body: data,})
    .then((response: Response) => {
      response.ok ? showSuccessPopup() : showErrorPopup(response.status, response.statusText);
      enableForm();
    })
}

const handleFormOnSubmit = (event: Event): any => {
  event.preventDefault();
  disableForm();

  sendNotice(new FormData(form))
}

const activateForm = (coords?: LatLng): void => {
  setupFormAdFormValidity();
  setupFormAdFormUsability();

  coords && setAddressValue(coords);
  form.addEventListener(`submit`, handleFormOnSubmit);
};

const setAddressValue = (coords: LatLng): void => {
  address.value = coords.lat.toFixed(4) + `, ` + coords.lng.toFixed(4);
};

export { activateForm, setAddressValue, }
