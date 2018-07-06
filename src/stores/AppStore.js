import UserModel from '../models/UserModel';
import ApiStore from './ApiStore';

class AppStore {
  constructor({ user, config } = { user: {}, config: {} }) {
    this.api = new ApiStore('/api/', config);
    this.user = new UserModel(user, this);
  }
}

export default AppStore;
