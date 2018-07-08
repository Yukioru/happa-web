import { observable, action } from 'mobx';

class EventModel {
  @observable _id;
  @observable title;
  @observable date;
  @observable description;
  @observable startTime;
  @observable finishTime;

  constructor(data, store, app) {
    this.setData(data);
    if (store) this.store = store;
    if (app) this.app = app;
  }

  @action
  setData(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  @action
  clearData() {
    ['_id', 'title', 'date', 'description', 'startTime', 'finishTime']
      .forEach((key) => {
        this[key] = null;
      });
  }
}

export default EventModel;
