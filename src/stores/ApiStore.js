import axios from 'axios';
import orderBy from 'lodash/orderBy';

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
  
  async createOrUpdateEvent(body) {
    const { data } = await axios.post(`${this.prefix}event/update`, body);
    return data;
  }

  async getEventsList(body, noDate) {
    const { data } = await axios.post(`${this.prefix}events${noDate ? '?noDate=true' : ''}`, body);
    return data;
  }

  async deleteEvent(body) {
    const { data } = await axios.post(`${this.prefix}event/delete`, body);
    return data;
  }

  async getChannel() {
    const { data } = await axios.get('https://api.twitch.tv/kraken/channels/happasc2', {
      headers: {'Client-ID': this.cfg.twitch.clientId },
    });
    return data;
  }

  async getStream() {
    const { data: { stream } } = await axios.get('https://api.twitch.tv/kraken/streams/happasc2', {
      headers: {'Client-ID': this.cfg.twitch.clientId },
    });
    return stream;
  }

  async getTopClips() {
    const { data: { clips } } = await axios.get('https://api.twitch.tv/kraken/clips/top?channel=happasc2', {
      headers: {
        'Client-ID': this.cfg.twitch.clientId,
        'Accept': 'application/vnd.twitchtv.v5+json',
      },
    });
    const sorted = orderBy(clips, ['views'], ['desc']);
    return sorted;
  }
}

export default ApiStore;
