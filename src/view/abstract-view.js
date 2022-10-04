import { createElement } from '../utils';

export class AbstractComponent {
  constructor(state) {
    if (new.target === AbstractComponent) {
      throw new Error('Can\'t instantiate Abstract class, only concrete one.');
    }
    this.state = state;
  }

  get getTemplate() {
    throw new Error(
      `Abstract method not implemented: ${this.getTemplate.name}`
    );
  }

  get getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate);
    }

    return this.element;
  }

  deleteElement() {
    this.element = null;
  }
}
