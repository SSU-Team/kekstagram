export type DataItem = {
  author: {
    avatar: string,
  },
  location: {
    lat: number,
    lng: number,
  },
  offer: {
    title: string,
    description: string,
    photos: Array<string>,
    address: string,
    type: string,
    features: Array<string>,
    guests: number,
    price: number,
    rooms: 6,
    checkin: string,
    checkout: string,
  },
};

export type FilterSettings = {
  'housing-type': string,
  'housing-price': string,
  'housing-rooms': string,
  'housing-guests': string,
  'features': Array<string>,
}
