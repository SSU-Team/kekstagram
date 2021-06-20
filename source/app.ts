import { debounce, } from './utils';
import { DataItem, } from './model/types';

import { fetchData, activateMap, getMainMarkerCoords, renderMarkers, } from './map';
import { activateFilter, filter, } from './filter';
import { activateForm, setAddressValue, } from './form';
import { LatLng, } from 'leaflet';

const activateApp = (data: Array<DataItem>,) => {
  const handleOnFilterChange = debounce(() => {
    renderMarkers(filter(data,),);
  }, 1000);

  const handleOnMainMarkerDragEnd = (coords: LatLng,) => {
    setAddressValue(coords,);
  };

  activateMap(handleOnMainMarkerDragEnd, filter(data,),);
  activateFilter(handleOnFilterChange,);
  activateForm(getMainMarkerCoords());
}

const deactivateApp = (err: Error,) => {
  console.log(err,);
}

const startApp = (): void => {
  fetchData()
  .then((apartaments,) => activateApp(apartaments,),)
  .catch((err,) => deactivateApp(err,),);
}

export { startApp, };
