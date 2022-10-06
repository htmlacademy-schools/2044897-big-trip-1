import { AbstractComponent } from './abstract-view';
import { MenuItem } from '../utils';

export class TripTabs extends AbstractComponent {
  tabClickHandler = (callback) => {
    this.tripTabClick = callback;
    this.getElement.addEventListener('click', this.tripTabClickHandler);
  };

  tripTabClickHandler = (e) => {
    e.preventDefault();
    this.tripTabClick(e.target.dataset.menuItem);
  };

  get getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>`;
  }
}
