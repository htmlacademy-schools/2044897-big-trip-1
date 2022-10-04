import { remove, renderBefore, UserAction, UpdateType } from '../utils';
import { CreationForm } from '../view/creation-form';

export default class PointNewPresenter {
  pointListContainer = null;
  changeData = null;
  pointAddComponent = null;
  destinations = null;
  offers = null;

  constructor(pointListContainer, changeData) {
    this.pointListContainer = pointListContainer;
    this.changeData = changeData;
  }

  init = (destinations, offers) => {
    if (this.pointAddComponent !== null) {
      return;
    }
    this.destinations = destinations;
    this.offers = offers;
    const data = {
      tripPoint: {
        isCreationForm: true,
        destination: { photos: [] },
        type: '',
        price: '',
        timeStart: '',
        timeEnd: '',
      },
      destinations,
      offers,
    };
    console.log(data);

    this.pointAddComponent = new CreationForm(data);
    this.pointAddComponent.setFormSubmitHandler(this.handleFormSubmit);
    this.pointAddComponent.setDeleteClickHandler(this.handleDeleteClick);

    renderBefore(this.pointAddComponent, this.pointListContainer);

    document.addEventListener('keydown', this.escKeyDownHandler);
  };

  destroy = () => {
    if (this.pointAddComponent === null) {
      return;
    }

    remove(this.pointAddComponent);
    this.pointAddComponent = null;

    document.removeEventListener('keydown', this.escKeyDownHandler);
  };

  handleFormSubmit = (task) => {
    this.changeData(UserAction.ADD_POINT, UpdateType.MINOR, task);
    this.destroy();
  };

  handleDeleteClick = () => {
    this.destroy();
  };

  escKeyDownHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.destroy();
    }
  };
}
