import { observable, computed, action } from 'mobx';

class UserModel {
  @observable _id;
  @observable username;
  @observable displayName;
  @observable avatar;
  @observable role;

  static createUser(user) {
    return new this(user);
  }

  constructor(user = {}, app) {
    if (user) this.setUser(user);
    if (app) this.app = app;
  }

  @action
  setUser(user) {
    Object.keys(user).forEach((key) => {
      this[key] = user[key];
    });
  }

  @computed
  get isAuth() {
    return !!this._id;
  }

  @computed
  get isAdmin() {
    return this.role === 'admin';
  }
}

export default UserModel;
