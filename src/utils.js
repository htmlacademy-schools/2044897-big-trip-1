import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const sortTaskByDay = (pointA, pointB) =>
  dayjs(pointA.startDate).diff(dayjs(pointB.startDate));

export const sortTaskByDuration = (pointA, pointB) => {
  const durationPointA = dayjs(pointA.endDate).diff(dayjs(pointA.startDate));
  const durationPointB = dayjs(pointB.endDate).diff(dayjs(pointB.startDate));

  if (durationPointB - durationPointA !== 0) {
    return durationPointB - durationPointA;
  } else {
    return dayjs(pointA.startDate).diff(dayjs(pointB.startDate));
  }
};

export const sortTaskByPrice = (pointA, pointB) => {
  if (pointB.price - pointA.price !== 0) {
    return pointB.price - pointA.price;
  } else {
    return dayjs(pointA.startDate).diff(dayjs(pointB.startDate));
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (component, container, place) => {
  const containerChild = container.getElement || container;
  const fragment = place ? containerChild.querySelector(place) : containerChild;
  const renderComponent = component.getElement || component;

  fragment.append(renderComponent);
};

export const renderBefore = (component, container, place) => {
  const containerChild = container.getElement || container;
  const fragment = place ? containerChild.querySelector(place) : containerChild;
  const renderComponent = component.getElement || component;

  fragment.prepend(renderComponent);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }
  component.getElement.remove();
  component.deleteElement();
};

export const replace = (newElement, oldElement) => {
  const newChild = newElement.getElement || newElement;
  const oldChild = oldElement.getElement || oldElement;
  const parent = oldChild.parentElement;

  parent.replaceChild(newChild, oldChild);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};

export const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points].filter((point) => point),
  [FilterType.FUTURE]: (points) =>
    [...points].filter((point) => new Date(point.timeStart) > new Date()),
  [FilterType.PAST]: (points) =>
    [...points].filter((point) => new Date(point.timeEnd) < new Date()),
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

dayjs.extend(duration);

export const TYPES = [
  'TAXI',
  'BUS',
  'TRAIN',
  'SHIP',
  'DRIVE',
  'FLIGHT',
  'CHECK-IN',
  'SIGHTSEEING',
  'RESTAURANT',
];

export const countPricesByType = (points, types) => {
  const pricesByTypes = {
    TAXI: 0,
    BUS: 0,
    TRAIN: 0,
    SHIP: 0,
    DRIVE: 0,
    FLIGHT: 0,
    'CHECK-IN': 0,
    SIGHTSEEING: 0,
    RESTAURANT: 0,
  };
  for (const type of types) {
    points.map((trip) => {
      if (trip.type.toUpperCase() === type) {
        pricesByTypes[type] += trip.price;
      }
    });
  }
  return pricesByTypes;
};

export const countTypes = (points, types) => {
  const countTypesNumber = {
    TAXI: 0,
    BUS: 0,
    TRAIN: 0,
    SHIP: 0,
    DRIVE: 0,
    FLIGHT: 0,
    'CHECK-IN': 0,
    SIGHTSEEING: 0,
    RESTAURANT: 0,
  };
  for (const type of types) {
    points.map((trip) => {
      if (trip.type.toUpperCase() === type) {
        countTypesNumber[type] += 1;
      }
    });
  }
  return countTypesNumber;
};

export const countTimeSpend = (countTypesInMs) => {
  let differenceInDays = parseInt(countTypesInMs / 86400000, 10);
  let differenceInHours = parseInt(countTypesInMs / 3600000, 10);
  let differenceInMinutes =
    parseInt(countTypesInMs / 60000, 10) - differenceInHours * 60;
  let timeSpend = '';

  if (differenceInDays > 0) {
    differenceInHours = differenceInHours - differenceInDays * 24;
  }

  if (differenceInDays === 0 && differenceInHours === 0) {
    differenceInDays =
      differenceInDays.toString().length === 1 ? `0${differenceInDays}` : '';
    differenceInHours =
      differenceInHours.toString().length === 1 ? `0${differenceInHours}` : '';
    differenceInMinutes =
      differenceInMinutes.toString().length === 1
        ? `0${differenceInMinutes}`
        : '';
    timeSpend = `${differenceInMinutes}M`;
  } else if (differenceInDays === 0) {
    differenceInDays =
      differenceInDays.toString().length === 1 ? `0${differenceInDays}` : '';
    differenceInHours =
      differenceInHours.toString().length === 1 ? `0${differenceInHours}` : '';
    differenceInMinutes =
      differenceInMinutes.toString().length === 1
        ? `0${differenceInMinutes}`
        : '';
    timeSpend = `${differenceInHours}H ${differenceInMinutes}M`;
  } else {
    differenceInDays =
      differenceInDays.toString().length === 1 ? `0${differenceInDays}` : '';
    differenceInHours =
      differenceInHours.toString().length === 1 ? `0${differenceInHours}` : '';
    differenceInMinutes =
      differenceInMinutes.toString().length === 1
        ? `0${differenceInMinutes}`
        : '';
    timeSpend = `${differenceInDays}D ${differenceInHours}H ${differenceInMinutes}M`;
  }
  return timeSpend;
};

export const countTimeSpendInMs = (trips, types) => {
  const countTypesInMs = {
    TAXI: 0,
    BUS: 0,
    TRAIN: 0,
    SHIP: 0,
    DRIVE: 0,
    FLIGHT: 0,
    'CHECK-IN': 0,
    SIGHTSEEING: 0,
    RESTAURANT: 0,
  };
  for (const type of types) {
    trips.map((trip) => {
      if (trip.type.toUpperCase() === type) {
        countTypesInMs[type] += dayjs(trip.timeEnd).diff(dayjs(trip.timeStart));
      }
    });
  }
  return countTypesInMs;
};
