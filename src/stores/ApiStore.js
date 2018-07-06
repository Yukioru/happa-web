import axios from 'axios';

class ApiStore {
  constructor(prefix, cfg) {
    if (prefix) this.prefix = prefix;
    if (cfg) this.cfg = cfg;
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
    return await axios.get(`${this.prefix}auth/logout`);
  }
  
  async authTwitch() {
    return await axios.get(`${this.prefix}auth/twitch`);
  }

  async getChannel() {
    const { data } = await axios.get('https://api.twitch.tv/kraken/channels/happasc2', {
      headers: {'Client-ID': this.cfg.twitch.clientId },
    });
    console.log('getChannel', data);
    return data;
  }

  async getStream() {
    const { data: { stream } } = await axios.get('https://api.twitch.tv/kraken/streams/happasc2', {
      headers: {'Client-ID': this.cfg.twitch.clientId },
    });
    console.log('getStream', stream);
    return stream;
  }
}

export default ApiStore;
