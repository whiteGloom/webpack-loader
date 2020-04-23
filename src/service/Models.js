import Config from '../models/Config';
import ServiceConfig from '../models/ServiceConfig';

class Models {
  constructor() {
    this.simple = Config;
    this.service = ServiceConfig;
  }

  getModel(isService) {
    return this[isService ? 'service' : 'simple'];
  }
}

export default Models;
