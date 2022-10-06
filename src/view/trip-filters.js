import { AbstractComponent } from './abstract-view';

export class TripFilters extends AbstractComponent {
  setFilterTypeChangeHandler = (callback) => {
    this.filterTypeChange = callback;
    this.getElement.addEventListener('change', this.filterTypeChangeHandler);
  };

  filterTypeChangeHandler = (e) => {
    e.preventDefault();
    this.filterTypeChange(e.target.value);
  };

  get getTemplate() {
    const { filters, currentFilter } = this.state;

    return `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input
          id="filter-${filters[0]}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filters[0]}"
          ${filters[0] === currentFilter ? 'checked' : ''}
        >
        <label
          class="trip-filters__filter-label"
          for="filter-${filters[0]}"
        >
          Everything
        </label>
      </div>
      
      <div class="trip-filters__filter">
        <input
          id="filter-${filters[1]}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filters[1]}"
          ${filters[1] === currentFilter ? 'checked' : ''}
        >
        <label
          class="trip-filters__filter-label"
          for="filter-${filters[1]}"
        >
          Future
        </label>
      </div>
      
      <div class="trip-filters__filter">
        <input
          id="filter-${filters[2]}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filters[2]}"
          ${filters[2] === currentFilter ? 'checked' : ''}
        >
        <label
          class="trip-filters__filter-label"
          for="filter-${filters[2]}"
        >
          Past
        </label>
      </div>
      
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }
}
