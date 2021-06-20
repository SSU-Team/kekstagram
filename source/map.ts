import * as L from 'leaflet';
import { DataItem, } from './model/types';

const TILE_URL_TEMPLATE = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`;
const VECTOR_TILE_REFERENCE =  `mapbox/streets-v8`;
const TILE_LAYER_OPTIONS: L.TileLayerOptions = {
  attribution: `Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
  maxZoom: 18,
  id: VECTOR_TILE_REFERENCE,
  tileSize: 512,
  zoomOffset: -1,
  accessToken: `pk.eyJ1IjoiZnVja2h0bWwiLCJhIjoiY2twcDJraTIxMDM5bzJwazlvMnF3Yng4OCJ9.x-hPV70C-_OyBR4Qy6cZQg`,
};

const TOKIO_CENTER_LAT = 35.682747;
const TOKIO_CENTER_LNG = 139.75914;
const MAP_VIEW_CENTER = new L.LatLng(TOKIO_CENTER_LAT, TOKIO_CENTER_LNG,);
const MAP_VIEW_ZOOM = 13;


const MAIN_MARKER_ICON_URL = `./img/map/main-pin.svg`;
const MAIN_MARKER_ICON_SIZE_X = 50;
const MAIN_MARKER_ICON_SIZE_Y = 82;
const MAIN_MARKER_ICON_ANCHOR_X = 12;
const MAIN_MARKER_ICON_ANCHOR_Y = 41;

const MAIN_MARKER_OPTIONS: L.MarkerOptions = {
  icon: L.icon({
    iconUrl: MAIN_MARKER_ICON_URL,
    iconSize: [MAIN_MARKER_ICON_SIZE_X, MAIN_MARKER_ICON_SIZE_Y,],
    iconAnchor: [MAIN_MARKER_ICON_ANCHOR_X, MAIN_MARKER_ICON_ANCHOR_Y,],
  }),
  riseOnHover: true,
  draggable: true,
};


const MARKER_ICON_URL = `./img/map/pin.svg`;
const MARKER_ICON_SIZE_X = 50;
const MARKER_ICON_SIZE_Y = 82;
const MARKER_ICON_ANCHOR_X = 12;
const MARKER_ICON_ANCHOR_Y = 41;

const MARKER_OPTIONS: L.MarkerOptions = {
  icon: L.icon({
    iconUrl: MARKER_ICON_URL,
    iconSize: [MARKER_ICON_SIZE_X, MARKER_ICON_SIZE_Y,],
    iconAnchor: [MARKER_ICON_ANCHOR_X, MARKER_ICON_ANCHOR_Y,],
  }),
  riseOnHover: true,
};


let mymap: L.Map;
let markers: L.LayerGroup<L.Marker>;
let mainMarker: L.Marker;




const renderMap = () => {
  mymap = L.map(`map-canvas`,).setView(MAP_VIEW_CENTER, MAP_VIEW_ZOOM,);
  markers = new L.LayerGroup();
  markers.addTo(mymap);

  L.tileLayer(TILE_URL_TEMPLATE, TILE_LAYER_OPTIONS,).addTo(mymap,);
}

const renderMainMarker = (handleOnMainMarkerDragEnd: (value: L.LatLng) => void) => {
  mainMarker = L.marker(MAP_VIEW_CENTER, MAIN_MARKER_OPTIONS);

  mainMarker.on(`dragstart`, () => {
    mainMarker.setOpacity(0.8);
    markers && markers.eachLayer((marker: any): void => marker.setOpacity(0.3));
  });

  mainMarker.on(`dragend`, (): void => {
    mainMarker.setOpacity(1);
    markers && markers.eachLayer((marker: any) => marker.setOpacity(1));

    handleOnMainMarkerDragEnd(mainMarker.getLatLng());
  });

  mymap && mainMarker.addTo(mymap);
};

const getMainMarkerCoords = (): L.LatLng => {
  return mainMarker.getLatLng();
}

const createPopupTemplate = (property: DataItem): string => {
  let featuresTemplate = ``;
  let photosTemplate = ``;

  if (property.offer.features.length !== 0) {
    featuresTemplate += `<ul class="popup__features">`;
    property.offer.features.forEach((feature,) => featuresTemplate += `<li class="popup__feature popup__feature--${feature}"></li>`);
    featuresTemplate += `</ul>`;
  }

  if (property.offer.photos.length !== 0) {
    photosTemplate += `<div class="popup__photos">`;
    property.offer.photos.forEach(photo => photosTemplate += `<img src="${photo}" class="popup__photo" width="45" height="40" alt="Photo of the appartment">`)
    photosTemplate += `</div>`;
  }

  return `
    <article class="popup">
      <img src="${property.author.avatar}" class="popup__avatar" width="70" height="70" alt="User avatar">
      <h3 class="popup__title">${property.offer.title}</h3>
      <p class="popup__text popup__text--address">${property.offer.address}</p>
      <p class="popup__text popup__text--price">${property.offer.price} <span>for a night</span></p>
      <h4 class="popup__type">${property.offer.type}</h4>
      <p class="popup__text popup__text--capacity">${property.offer.rooms} rooms for ${property.offer.guests} guests</p>
      <p class="popup__text popup__text--time">Check in after ${property.offer.checkin}, check out till ${property.offer.checkout}</p>
      ${featuresTemplate}
      <p class="popup__description">${property.offer.description}</p>
      ${photosTemplate}
    </article>
  `;
}

const renderMarkers = (propertyList: Array<DataItem>,): void => {
  markers && markers.clearLayers();

  propertyList.forEach((property: DataItem) => {
    const coords = new L.LatLng(property.location.lat, property.location.lng,);
    const marker = L.marker(coords, MARKER_OPTIONS,).bindPopup(createPopupTemplate(property));
    markers && markers.addLayer(marker);
  });
};

const activateMap = (handleOnMainMarkerDragEnd: (value: L.LatLng) => void, propertyList: Array<DataItem>): void => {
  renderMap();
  renderMarkers(propertyList);
  renderMainMarker(handleOnMainMarkerDragEnd);
}

const API = `https://23.javascript.pages.academy/keksobooking/data`;

const handleError = (err: Error): void => {
  throw new Error(`Error occured fetching data: ${err.message}`);
}

const formatData = (dataList: any): any => {
  return dataList.map((item: any) => {
    !item.offer.photos && Object.assign(item.offer, { photos: [], });
    !item.offer.features && Object.assign(item.offer, { features: [], });

    return item;
  });
}

const fetchData = (): Promise<Array<DataItem>> => {
  return fetch(API)
      .then(data => data.json())
      .then(data => formatData(data))
      .catch(handleError)
};

export { fetchData, activateMap, renderMarkers, getMainMarkerCoords, };
