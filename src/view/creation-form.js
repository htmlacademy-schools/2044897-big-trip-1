import { SmartComponent } from './smart-view';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

export class CreationForm extends SmartComponent {
  setFormSubmitHandler = (callback) => {
    this.formSubmit = callback;
    this.getElement
      .querySelector('form')
      .addEventListener('submit', this.formSubmitHandler);
  };

  setRollupClickHandler = (callback) => {
    this.rollupClick = callback;
    this.getElement
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.rollupClickHandler);
  };

  formSubmitHandler = (e) => {
    e.preventDefault();
    this.formSubmit(this.state.tripPoint);
  };

  rollupClickHandler = (e) => {
    e.preventDefault();
    this.rollupClick();
  };

  typeGroupClickHandler = (e) => {
    e.preventDefault();
    this.updateData(
      {
        type: e.target.value,
      },
      false
    );
  };

  startTimeChangeHandler = ([userDate]) => {
    this.updateData(
      {
        timeStart: userDate.toISOString(),
      },
      true
    );
  };

  endTimeChangeHandler = ([userDate]) => {
    this.updateData(
      {
        timeEnd: userDate.toISOString(),
      },
      true
    );
  };

  basePriceChangeHandler = (e) => {
    e.preventDefault();
    this.updateData(
      {
        price: parseInt(e.target.value, 10),
      },
      true
    );
  };

  destinationChangeHandler = (e) => {
    e.preventDefault();
    this.updateData(
      {
        destination: this.getChangedDestination(e.target.value),
      },
      false
    );
  };

  getChangedDestination = (destinationName) => {
    const allDestinations = [];
    const foundDestination = allDestinations.find(
      (destination) => destination.name === destinationName
    );
    return (
      foundDestination || {
        description: null,
        name: '',
        pictures: [],
      }
    );
  };

  restoreHandlers = () => {
    this.setInnerHandlers();
    this.setRollupClickHandler(this.rollupClick);
    this.setFormSubmitHandler(this.formSubmit);
    this.setDatepicker();
  };

  setDatepicker = () => {
    this.datepickerFrom = flatpickr(
      this.getElement.querySelector(
        '.event__input--time[name=event-start-time]'
      ),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this.state.tripPoint.timeStart,
        onChange: this.startTimeChangeHandler,
      }
    );

    this.datepickerTo = flatpickr(
      this.getElement.querySelector('.event__input--time[name=event-end-time]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this.state.tripPoint.timeEnd,
        onChange: this.endTimeChangeHandler,
      }
    );
  };

  setInnerHandlers = () => {
    this.getElement
      .querySelector('.event__type-group')
      .addEventListener('change', this.typeGroupClickHandler);
    this.getElement
      .querySelector('.event__input--destination')
      .addEventListener('change', this.destinationChangeHandler);
    this.getElement
      .querySelector('.event__input--price')
      .addEventListener('change', this.basePriceChangeHandler);
  };

  setDeleteClickHandler = () => {};

  createPointTypesMarkup = (offers, chosenPointType) => {
    const createTypeMarkup = (offer) => {
      const isChecked = offer.type === chosenPointType ? 'checked=""' : '';
      const label = offer.type.charAt(0).toUpperCase() + offer.type.slice(1);

      return `<div class="event__type-item">
        <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${isChecked}>
        <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${label}</label>
        </div>`;
    };
    return offers.map(createTypeMarkup).join('');
  };

  createOffersSectionMarkup = (offersByTypes, pointType) => {
    const createOfferMarkup = (offer) => `<div class="event__available-offers">
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${pointType}-1" type="checkbox" name="event-offer-${pointType}">
        <label class="event__offer-label" for="event-offer-name-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;

    let offersByCurrentType = [];
    for (let i = 0; i < offersByTypes.length; i++) {
      if (offersByTypes[i].type === pointType) {
        offersByCurrentType = offersByTypes[i].offers;
      }
    }

    const offersMarkup = offersByCurrentType.map(createOfferMarkup).join('');
    if (offersByCurrentType.length !== 0) {
      return `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        ${offersMarkup}</section>`;
    }
    return '';
  };

  get getTemplate() {
    const { isCreationForm, destination, type, price, timeStart, timeEnd } =
      this.state.tripPoint;
    const destinations = this.state.destination;
    const pointOffers = this.state.offers;

    const pointTypesMarkup = this.createPointTypesMarkup(pointOffers, type);
    const editedOffersMarkup = this.createOffersSectionMarkup(
      pointOffers,
      type
    );
    const destinationOptions = destinations
      .map((x) => `<option value="${x.name}"></option>`)
      .join('');

    return `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type?.toLowerCase()}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
              
              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${pointTypesMarkup}
                </fieldset>
              </div>
            </div>
            
            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${type}
              </label>
              <input
                class="event__input event__input--destination"
                id="event-destination-1"
                type="text"
                name="event-destination"
                value="${destination.city}"
                list="destination-list-1"
              >
              <datalist id="destination-list-1">
                ${destinationOptions}
              </datalist>
            </div>
            
            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeStart}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeEnd}">
            </div>
            
            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
            </div>
            
            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            
            <button
              class="event__reset-btn"
              type="reset"
            >
              ${isCreationForm ? 'Cancel' : 'Delete'}
            </button>
            
            ${
              isCreationForm
                ? ''
                : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'
            }
          </header>
          
          <section class="event__details">
            ${editedOffersMarkup}
            
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">
                ${destination.description}
              </p>
              
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${destination.pictures
                    .map(
                      (photo) =>
                        `<img class="event__photo" src="${photo.src}" alt="Event photo">`
                    )
                    .join('')}
                </div>
              </div>
            </section>
          </section>
        </form>
      </li>`;
  }
} 
