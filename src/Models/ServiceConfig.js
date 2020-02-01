import Config from './Config';

class ServiceConfig extends Config {
  constructor() {
    super(arguments);

    this.handler = null;
    this.stop = null;
    this.start = null;

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

    const gag = () => {};
    this.setStopFunction(stop || gag);
    this.setStartFunction(start || gag);
  }
}

export default ServiceConfig;
