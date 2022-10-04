import { AbstractComponent } from './abstract-view';

export class LoadingView extends AbstractComponent {
  get getTemplate() {
    return `<p class="trip-events__msg">
    Loading...
    </p>`;
  }
}
