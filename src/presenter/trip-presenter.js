import { PointsListView } from '../view/points-list';
import { LoadingView } from '../view/loading-view';
import { Sort } from '../view/sort-waypoints';
import PointPresenter from './point-presenter';
import {
  render,
  remove,
  SortType,
  FilterType,
  sortTaskByDay,
  sortTaskByDuration,
  sortTaskByPrice,
  UpdateType,
  UserAction,
  filter,
} from '../utils';
import PointNewPresenter from './point-new-presenter';
import { EmptyListView } from '../view/empty-list';

export default class TripPresenter {
  constructor(mainElement, pointsModel, filterModel, apiService) {
    this.tripSortComponent = null;
    this.noTripPointComponent = null;
    this.loadingComponent = new LoadingView();
    this.tripEventsListElement = new PointsListView();
    this.pointNewPresenter = new PointNewPresenter(
      this.tripEventsListElement,
      this.handleViewAction
    );

    this.apiService = apiService;
    this.pointsModel = pointsModel;
    this.filterModel = filterModel;

    this.pointsModel.addObserver(this.handleModelEvent);
    this.filterModel.addObserver(this.handleModelEvent);

    this.pointPresenter = new Map();
    this.tripPointsElement = mainElement;

    this.sortType = SortType.DAY;
    this.filterType = FilterType.EVERYTHING;
    this.isLoading = true;
    this.destinations = null;
    this.offers = null;
  }

  get points() {
    this.filterType = this.filterModel.filter;
    const points = this.pointsModel.points;
    const filteredPoints = filter[this.filterType](points);

    switch (this.sortType) {
      case SortType.SORT_DAY:
        return filteredPoints.sort(sortTaskByDay);
      case SortType.SORT_TIME:
        return filteredPoints.sort(sortTaskByDuration);
      case SortType.SORT_PRICE:
        return filteredPoints.sort(sortTaskByPrice);
    }
    return filteredPoints;
  }

  init = async () => {
    this.destinations = await this.apiService.destinations;
    this.offers = await this.apiService.offers;

    this.pointsModel.init();
    this.renderMain();
  };

  createPoint = () => {
    this.sortType = SortType.SORT_DAY;
    this.filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.pointNewPresenter.init(this.destinations, this.offers);
  };

  renderNoTasks = () => {
    this.noTripPointComponent = new EmptyListView(this.filterType);
    render(this.tripPointsElement, this.noTripPointComponent);
  };

  renderTripEventsListElement = () => {
    render(this.tripEventsListElement, this.tripPointsElement);
  };

  handleModeChange = () => {
    this.pointNewPresenter.destroy();
    this.pointPresenter.forEach((presenter) => presenter.resetView());
  };

  handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  sortTasks = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.points.sort(sortTaskByDay);
        break;
      case SortType.TIME:
        this.points.sort(sortTaskByDuration);
        break;
      case SortType.PRICE:
        this.points.sort(sortTaskByPrice);
        break;
      default:
        this.points = [...this.sourcedTripPoints];
    }

    this.sortType = sortType;
  };

  handleSortTypeChange = (sortType) => {
    if (this.sortType === sortType) {
      return;
    }
    this.sortType = sortType;
    this.clearPointList();
    this.renderTripEventsList(this.points);
    this.clearMain({ resetRenderedTaskCount: true });
    this.renderMain();
  };

  handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.clearMain();
        this.renderMain();
        break;
      case UpdateType.MAJOR:
        this.clearMain({ resetRenderedTaskCount: true, sortType: true });
        this.renderMain();
        break;
      case UpdateType.INIT:
        this.isLoading = false;
        remove(this.loadingComponent);
        this.renderMain();
        break;
    }
  };

  renderSort = () => {
    this.sortComponent = new Sort(this.sortType);
    this.sortComponent.setSortTypeChangeHandler(this.handleSortTypeChange);
    render(this.sortComponent, this.tripPointsElement);
  };

  renderTripEvent = (tripPoint) => {
    const pointPresenter = new PointPresenter(
      this.tripEventsListElement,
      this.handleViewAction,
      this.handleModeChange,
      this.destinations,
      this.offers
    );
    pointPresenter.init(tripPoint);
    this.pointPresenter.set(tripPoint.id, pointPresenter);
  };

  renderTripEventsList = (points) => {
    points.forEach((point) => this.renderTripEvent(point));
  };

  renderLoading = () => {
    render(this.loadingComponent, this.tripPointsElement);
  };

  clearMain = ({ resetSortType = false } = {}) => {
    this.pointPresenter.forEach((presenter) => presenter.destroy());
    this.pointPresenter.clear();

    remove(this.sortComponent);
    remove(this.loadingComponent);

    if (resetSortType) {
      this.sortType = SortType.SORT_DAY;
    }

    if (this.noTripPointComponent) {
      remove(this.noTripPointComponent);
    }
  };

  renderMain = () => {
    if (this.isLoading) {
      this.renderLoading();
      return;
    }
    if (this.points.length === 0) {
      this.renderNoTasks();
    } else {
      this.renderSort();
      this.renderTripEventsList(this.points);
      this.renderTripEventsListElement();
    }
  };

  clearTaskList = () => {
    this.pointNewPresenter.destroy();
    this.pointPresenter.forEach((presenter) => presenter.destroy());
    this.pointPresenter.clear();

    remove(this.sortComponent);
    remove(this.tripEventsListElement);
    if (this.noTripPointComponent) {
      remove(this.noTripPointComponent);
    }
  };

  destroy = () => {
    this.clearTaskList(true);

    this.pointsModel.removeObserver(this.handleModelEvent);
    this.filterModel.removeObserver(this.handleModelEvent);
  };
}
