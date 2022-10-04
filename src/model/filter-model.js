import AbstractObservable from '../abstract-observable.js';
import { FilterType } from '../utils';

export default class FilterModel extends AbstractObservable {
  filter = FilterType.EVERYTHING;

  get filter() {
    return this.filter;
  }

  setFilter = (updateType, filter) => {
    this.filter = filter;
    this.notify(updateType, filter);
  };
}
