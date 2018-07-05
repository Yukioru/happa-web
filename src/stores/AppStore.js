import UserModel from '../models/UserModel';
import ApiStore from './ApiStore';

class AppStore {
  constructor({ user } = { user: {} }) {
    this.api = new ApiStore('/api/');
    this.user = new UserModel(user, this);
  }
}

export default AppStore;
