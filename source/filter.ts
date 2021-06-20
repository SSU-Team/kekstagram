import { DataItem, FilterSettings, } from './model/types';

const mapFilterElement = <HTMLFormElement>document.querySelector(`.map__filters`,);

const mapFilterType = <HTMLSelectElement>mapFilterElement.querySelector(`#housing-type`);
const mapFilterPrice = <HTMLSelectElement>mapFilterElement.querySelector(`#housing-price`);
const mapFilterRooms = <HTMLSelectElement>mapFilterElement.querySelector(`#housing-rooms`);
const mapFilterGuests = <HTMLSelectElement>mapFilterElement.querySelector(`#housing-guests`);

const mapFilterWifi = <HTMLInputElement>mapFilterElement.querySelector(`#filter-wifi`);
const mapFilterDishwasher = <HTMLInputElement>mapFilterElement.querySelector(`#filter-dishwasher`);
const mapFilterParking = <HTMLInputElement>mapFilterElement.querySelector(`#filter-parking`);
const mapFilterWasher = <HTMLInputElement>mapFilterElement.querySelector(`#filter-washer`);
const mapFilterElevator = <HTMLInputElement>mapFilterElement.querySelector(`#filter-elevator`);
const mapFilterConditioner = <HTMLInputElement>mapFilterElement.querySelector(`#filter-conditioner`);

let filterSettings: FilterSettings;


const updateFilters = (): void => {
  filterSettings = {
    'housing-type': mapFilterType.value,
    'housing-price': mapFilterPrice.value,
    'housing-rooms': mapFilterRooms.value,
    'housing-guests': mapFilterGuests.value,
    'features': [],
  };

  mapFilterWifi.checked && filterSettings.features.push(`wifi`);
  mapFilterDishwasher.checked && filterSettings.features.push(`dishwasher`);
  mapFilterParking.checked && filterSettings.features.push(`parking`);
  mapFilterWasher.checked && filterSettings.features.push(`washer`);
  mapFilterElevator.checked && filterSettings.features.push(`elevator`);
  mapFilterConditioner.checked && filterSettings.features.push(`conditioner`);
}

const filter = (propertyList: Array<DataItem>,): Array<DataItem> => {
  propertyList = propertyList.slice();
  updateFilters();

  return propertyList.filter(propertyItem => {
    if (!propertyItem.offer.features) propertyItem.offer.features = [];

    const isTypeFitable = (
      (filterSettings[`housing-type`] === `any`) ||
      (propertyItem.offer.type === filterSettings[`housing-type`])
    );
    const isPriceFitable = (
      (filterSettings[`housing-price`] === `any`) ||
      (filterSettings[`housing-price`] === `low` && propertyItem.offer.price < 10000 ) ||
      (filterSettings[`housing-price`] === `middle` && propertyItem.offer.price >= 10000 && propertyItem.offer.price < 50000) ||
      (filterSettings[`housing-price`] === `high` && propertyItem.offer.price >= 50000)
    );
    const areRoomsFitable = (
      (filterSettings[`housing-rooms`] === `any`) ||
      (String(propertyItem.offer.rooms) === filterSettings[`housing-rooms`])
    );
    const areGuestsFitable = (
      (filterSettings[`housing-guests`] === `any`) ||
      (String(propertyItem.offer.guests) === filterSettings[`housing-guests`])
    );
    const areFeaturesFitable = filterSettings.features.every((feature: string) => propertyItem.offer.features.indexOf(feature) !== -1)

    return (isTypeFitable && isPriceFitable && areRoomsFitable && areGuestsFitable && areFeaturesFitable);
  });
};

const activateFilter = (handleOnFilterChange: () => void,): void => {
  mapFilterElement.addEventListener(`change`, (event: Event,) => {
    event.preventDefault();

    handleOnFilterChange();
  },);
};

export { filter, activateFilter, }
