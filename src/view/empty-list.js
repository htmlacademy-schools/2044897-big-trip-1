import { AbstractComponent } from './abstract-view';
import { FilterType } from '../utils';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

export class EmptyListView extends AbstractComponent {
  get getTemplate() {
    return `<p class="trip-events__msg">${NoPointsTextType[this.state]}</p>`;
  }
}
