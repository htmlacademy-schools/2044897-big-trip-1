import { StatsView } from './view/chart-view';
import { TripTabs } from './view/trip-tabs';
import { render, remove, MenuItem } from './utils';
import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import ApiService from './api-service';

const AUTHORIZATION = 'Basic iHateEverything';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const pageMainElement = document.querySelector('.trip-events');
const tripControls = document.querySelector('.trip-controls');

const siteTabs = new TripTabs();

render(siteTabs, tripControls, '.trip-controls__navigation');

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const filterModel = new FilterModel();
const pointsModel = new PointsModel(apiService);

const tripPresenter = new TripPresenter(
  pageMainElement,
  pointsModel,
  filterModel,
  apiService
);
const filterPresenter = new FilterPresenter(tripControls, filterModel);

let statisticsComponent = null;
let mode = MenuItem.TABLE;

const handleTabClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      if (mode !== MenuItem.TABLE) {
        filterPresenter.init();
        tripPresenter.init();
        remove(statisticsComponent);
        mode = MenuItem.TABLE;
      }
      break;
    case MenuItem.STATS:
      if (mode !== MenuItem.STATS) {
        filterPresenter.destroy();
        tripPresenter.destroy();
        statisticsComponent = new StatsView(pointsModel.points);
        statisticsComponent.setCharts();
        render(statisticsComponent, pageMainElement);
        mode = MenuItem.STATS;
      }
      break;
  }
};

siteTabs.tabClickHandler(handleTabClick);

tripPresenter.init();
filterPresenter.init();

document
  .querySelector('.trip-main__event-add-btn')
  .addEventListener('click', (e) => {
    e.preventDefault();
    remove(statisticsComponent);
    filterPresenter.destroy();
    filterPresenter.init();
    tripPresenter.destroy();
    tripPresenter.init();
    mode = 'TABLE';
  });
