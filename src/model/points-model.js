import AbstractObservable from '../abstract-observable';
import { UpdateType } from '../utils';

export default class PointsModel extends AbstractObservable {
  apiService = null;
  points = [];

  constructor(apiService) {
    super();
    this.apiService = apiService;
  }

  set points(points) {
    this.points = [...points];
  }

  get points() {
    return this.points;
  }

  init = async () => {
    const points = await this.apiService.points;
    this.points = points.map(this.adaptToClient);

    this.notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error("Can't update unexisting point");
    }

    try {
      const response = await this.apiService.updatePoint(update);
      const updatedPoint = this.adaptToClient(response);
      this.points = [
        ...this.points.slice(0, index),
        updatedPoint,
        ...this.points.slice(index + 1),
      ];
      this.notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error("Can't update task");
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const response = await this.apiService.addPoint(update);
      const newPoint = this.adaptToClient(response);
      this.points = [newPoint, ...this.points];
      this.notify(updateType, newPoint);
    } catch (err) {
      throw new Error("Can't add point");
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error("Can't delete unexisting point");
    }

    try {
      await this.apiService.deletePoint(update);
      this.points = [
        ...this.points.slice(0, index),
        ...this.points.slice(index + 1),
      ];
      this.notify(updateType);
    } catch (err) {
      throw new Error("Can't delete point");
    }
  };

  adaptToClient = (point) => {
    const adaptedPoint = {
      id: point['id'],
      city: point['destination']['name'],
      price: point['base_price'],
      timeStart: point['date_from'],
      timeEnd: point['date_to'],
      isFavorite: point['is_favorite'],
      destination: point['destination'],
      offers: point['offers'],
      type: point['type'],
    };

    return adaptedPoint;
  };
}
