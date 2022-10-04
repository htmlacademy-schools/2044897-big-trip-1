import { AbstractComponent } from './abstract-view';

export class PointsListView extends AbstractComponent {
  get getTemplate() {
    return '<ul class="trip-events__list"></ul>';
  }
}
