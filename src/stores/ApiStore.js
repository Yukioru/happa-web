import axios from 'axios';

class ApiStore {
  constructor(prefix) {
    if (prefix) this.prefix = prefix;
  }
  
  async signIn(body) {
    const { data } = await axios.post(`${this.prefix}auth/signin`, body);
    return data;
  }
  
  async signUp(body) {
    const { data } = await axios.post(`${this.prefix}auth/signup`, body);
    return data;
  }
  
  async logOut() {
    return await axios.post(`${this.prefix}auth/logout`);
  }
}

export default ApiStore;
