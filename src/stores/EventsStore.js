import { observable } from 'mobx';
import EventModel from '../models/EventModel';

class EventsStore {
  @observable list = [];
  @observable noDateList = [];

  constructor(data, app) {
    if (app) this.app = app;
    if (data) this.setList(data);
  }
  
  setList(data, noDate) {
    if (noDate) {
      this.noDateList = data.map(i => new EventModel(i, this, this.app));
    } else {
      this.list = data.map(i => new EventModel(i, this, this.app));
    }
  }

  clearList() {
    this.list = [];
  }

  deleteEvent(eventId) {
    this.list = this.list.filter(event => event._id !== eventId);
  }
}

export default EventsStore;
