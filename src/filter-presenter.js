import { TripFilters } from '../view/trip-filters';
import { render, replace, remove, UpdateType, FilterType } from '../utils';

export default class FilterPresenter {
  filterContainer = null;
  filterModel = null;
  tasksModel = null;

  filterComponent = null;

  constructor(filterContainer, filterModel, tasksModel) {
    this.filterContainer = filterContainer;
    this.filterModel = filterModel;
    this.tasksModel = tasksModel;

    this.filterModel.addObserver(this.handleModelEvent);
  }

  get filters() {
    return ['everything', 'future', 'past'];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.filterComponent;

    this.filterComponent = new TripFilters({
      filters,
      currentFilter: this.filterModel.filter,
    });
    this.filterComponent.setFilterTypeChangeHandler(
      this.handleFilterTypeChange
    );

    if (prevFilterComponent === null) {
      render(
        this.filterComponent,
        this.filterContainer,
        '.trip-controls__filters'
      );
      return;
    }

    replace(this.filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  handleModelEvent = () => {
    this.init();
  };

  handleFilterTypeChange = (filterType) => {
    if (this.filterModel.filter === filterType) {
      return;
    }

    this.filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  destroy = () => {
    remove(this.filterComponent);
    this.filterComponent = null;

    this.filterModel.removeObserver(this.handleModelEvent);

    this.filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  };
}
