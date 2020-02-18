import Config from './Config';
import ServiceConfig from './ServiceConfig';

const Models = {
  models: {
    simple: Config,
    service: ServiceConfig
  },
  getModel(isService) {
    return Models.models[isService ? 'service' : 'simple'];
  }
};

export default Models;
