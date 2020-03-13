import Config from './Config';

class ServiceConfig extends Config {
  constructor(options) {
    super(options);
    const { startDefaults, stopDefaults, start, stop } = options;

    this.handler = null;
    this.start = null;
    this.stop = null;
    this.startDefaults = () => {};
    this.stopDefaults = () => {};

    if (startDefaults) this.setStartDefaults(startDefaults);
    if (stopDefaults) this.setStopDefaults(stopDefaults);

    this.resetStartFunction();
    this.resetStopFunction();

    if (start) this.setStartFunction(start);
    if (stop) this.setStopFunction(stop);
  }

  setStartFunction(func) {
    if (typeof func !== 'function') return;
    this.start = func.bind(this);
  }

  setStopFunction(func) {
    if (typeof func !== 'function') return;
    this.stop = func.bind(this);
  }

  setStartDefaults(func) {
    if (typeof func !== 'function') return;
    this.startDefaults = func.bind(this);
  }

  setStopDefaults(func) {
    if (typeof func !== 'function') return;
    this.stopDefaults = func.bind(this);
  }

  resetStartFunction() {
    this.start = this.startDefaults;
  }

  resetStopFunction() {
    this.stop = this.stopDefaults;
  }

  resetToDefaults() {
    super.resetToDefaults();

    this.handler = null;
    this.resetStartFunction();
    this.resetStopFunction();
  }
}

export default ServiceConfig;
