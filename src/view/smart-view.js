import { AbstractComponent } from './abstract-view.js';

export class SmartComponent extends AbstractComponent {
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
    const prevElement = this.getElement;
    const parent = prevElement.parentElement;
    this.deleteElement();

    const newElement = this.getElement;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  };

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  };
}
