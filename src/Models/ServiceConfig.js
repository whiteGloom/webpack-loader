import Config from './Config';

class ServiceConfig extends Config {
  constructor() {
    super(arguments);

    this.handler = null;
    this.stop = () => {};
    this.start = () => {};

    this._init(arguments);
  }

  setStartFunction(func) {
    if (typeof func !== 'function') return;

    this.start = func.bind(this);
  }

  setStopFunction(func) {
    if (typeof func !== 'function') return;

    this.stop = func.bind(this);
  }

  _init({ start, stop }) {
    super._init(arguments);

    this.setStopFunction(stop);
    this.setStartFunction(start);
  }
}

export default ServiceConfig;
