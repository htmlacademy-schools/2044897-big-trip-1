import { LOREM_IPSUM, WAYPOINT_TYPES, OFFER_TYPES } from './consts';
import { nanoid } from 'nanoid';

const createRandomDestination = () => {
  const lrArray = LOREM_IPSUM.split('. ');

  const destinationStartIndex = Math.round(
    Math.random() * (lrArray.length - 1)
  );
  const destinationEndIndex =
    destinationStartIndex + 5 < lrArray.length - 1
      ? destinationStartIndex + 5
      : lrArray.length - 1;

  const newArr = [];
  for (let i = destinationStartIndex; i < destinationEndIndex; i++) {
    newArr.push(lrArray[i]);
  }

  return {
    city: 'Geneva',
    description: newArr.join('. '),
    photos: [`http://picsum.photos/248/152?r=${Math.random()}`],
  };
};

const createRandomType = () => {
  const types = WAYPOINT_TYPES;
  const randomTypeIndex = Math.round(Math.random() * (types.length - 1));

  return types[randomTypeIndex];
};

export const createOffer = ({ name, price }) => ({
  name,
  price,
});

const createOffers = () => {
  const offerTypes = OFFER_TYPES;
  const iterationsCount = Math.round(Math.random() * 5);

  const offers = [];
  for (let i = 0; i < iterationsCount; i++) {
    const name =
      offerTypes[Math.round(Math.random() * (offerTypes.length - 1))];
    const price = Math.round(Math.random() * 300);

    offers.push(
      createOffer({
        name,
        price,
      })
    );
  }

  return offers;
};

export const createWaypointModel = ({ type, destination, offers = [] }) => ({
  id: nanoid(),
  type,
  offers,
  destination,
  timeStart: '01/01/22 10:30',
  timeEnd: '02/01/22 11:30',
  isFavorite: false,
  price: Math.round(Math.random() * 300),
});

export const createRandomWaypoint = () => {
  const type = createRandomType();
  const destination = createRandomDestination();
  const offers = createOffers();

  return createWaypointModel({ type, destination, offers });
};
