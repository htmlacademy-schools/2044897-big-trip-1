import { AbstractComponent } from './abstract-view.js';

export class SmartComponent extends AbstractComponent {
  state = {};

  constructor(state) {
    super();
    this.state = state;
  }

  updateData = (update, isUpdate) => {
    if (!update) {
      return;
    }

    this.state = { ...this.state, ...update };

    if (isUpdate) {
      return;
    }

    this.updateElement();
  };

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.deleteElement();

    parent.replaceChild(this.element, prevElement);

    this.restoreHandlers();
  };

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  };
}
