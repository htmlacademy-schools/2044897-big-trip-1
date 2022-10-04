import { Waypoint } from '../view/way-point';
import { CreationForm } from '../view/creation-form';
import { render, remove, replace, UserAction, UpdateType } from '../utils';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  constructor(
    tripPointsListElement,
    changeData,
    changeMode,
    destinations,
    offers
  ) {
    this.mode = Mode.DEFAULT;
    this.tripPointsListElement = tripPointsListElement;
    this.changeData = changeData;
    this.changeMode = changeMode;
    this.pointItemComponent = null;
    this.pointEditComponent = null;
    this.destinations = destinations;
    this.offers = offers;
  }

  init = (tripPoint) => {
    this.tripPoint = tripPoint;

    const prevPointItemComponent = this.pointItemComponent;
    const prevPointEditComponent = this.pointEditComponent;

    this.pointItemComponent = new Waypoint(tripPoint);
    this.pointEditComponent = new CreationForm({
      tripPoint,
      destination: this.destinations,
      offers: this.offers,
    });

    this.pointItemComponent.setEditClickHandler(this.handleEditClick);
    this.pointItemComponent.setFavoriteClickHandler(this.handleFavoriteClick);

    this.pointEditComponent.setRollupClickHandler(this.handleRollupClick);
    this.pointEditComponent.setFormSubmitHandler(this.handleFormSubmit);
    this.pointEditComponent.restoreHandlers();

    if (prevPointItemComponent === null || prevPointEditComponent === null) {
      return render(
        this.pointItemComponent,
        this.tripPointsListElement.getElement
      );
    }

    if (this.mode === Mode.DEFAULT) {
      replace(this.pointItemComponent, prevPointItemComponent);
    }

    if (this.mode === Mode.EDITING) {
      replace(this.pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointItemComponent);
    remove(prevPointEditComponent);
  };

  destroy() {
    remove(this.pointItemComponent);
    remove(this.pointEditComponent);
  }

  resetView() {
    if (this.mode !== Mode.DEFAULT) {
      this.replaceFormToItem();
    }
  }

  replaceItemToForm = () => {
    replace(this.pointEditComponent, this.pointItemComponent);
    document.addEventListener('keydown', this.escKeyDownHandler);
    this.changeMode();
    this.mode = Mode.EDITING;
  };

  replaceFormToItem = () => {
    replace(this.pointItemComponent, this.pointEditComponent);
    document.removeEventListener('keydown', this.escKeyDownHandler);
    this.mode = Mode.DEFAULT;
  };

  escKeyDownHandler = (e) => {
    if (
      e.key === 'Escape' &&
      this.tripPointsListElement.contains(this.pointEditComponent)
    ) {
      e.preventDefault();
      this.replaceFormToItem();
    }
  };

  handleEditClick = () => {
    this.replaceItemToForm();
  };

  handleRollupClick = () => {
    this.replaceFormToItem();
  };

  handleFavoriteClick = () => {
    this.changeData(UserAction.ADD_POINT, UpdateType.MINOR, {
      ...this.tripPoint,
      isFavorite: !this.tripPoint.isFavorite,
    });
  };

  handleFormSubmit = (point) => {
    this.changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);
    this.replaceFormToItem();
  };
}
