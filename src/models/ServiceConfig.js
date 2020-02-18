import Config from './Config';

class ServiceConfig extends Config {
  constructor(options) {
    super(options);

    this.handler = null;
    this.stop = () => {};
    this.start = () => {};

    this._init(options);
  }

  setStartFunction(func) {
    if (typeof func !== 'function') return;

    this.start = func.bind(this);
  }

  setStopFunction(func) {
    if (typeof func !== 'function') return;

    this.stop = func.bind(this);
  }

  _init(options = {}) {
    super._init(options);
    const { start, stop } = options;

    this.setStopFunction(stop);
    this.setStartFunction(start);
  }
}

export default ServiceConfig;
