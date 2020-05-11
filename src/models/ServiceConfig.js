import Config from './Config';

class ServiceConfig extends Config {
  constructor(options) {
    super(options);
    const { startDefaultsGetter, stopDefaultsGetter, startFunction, stopFunction } = options;

    this.isRunning = false;
    this.handler = null;
    this.start = null;
    this.stop = null;
    this.startDefaults = () => {};
    this.stopDefaults = () => {};

    if (startDefaultsGetter) this.setStartDefaults({ startDefaultsGetter });
    if (stopDefaultsGetter) this.setStopDefaults({ stopDefaultsGetter });

    this.resetStartFunction();
    this.resetStopFunction();

    if (startFunction) this.setStartFunction({ startFunction });
    if (stopFunction) this.setStopFunction({ stopFunction });
  }

  setStartFunction(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { startFunction } = options;

    if (typeof startFunction !== 'function') {
      if (!isSilent) console.log(`setStartFunction: Wrong type of startFunction: ${typeof startFunction}`);
      return;
    }

    this.start = startFunction.bind(this);
  }

  setStopFunction(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { stopFunction } = options;

    if (typeof stopFunction !== 'function') {
      if (!isSilent) console.log(`setStopFunction: wrong type of stopFunction: ${typeof stopFunction}`);
      return;
    }

    this.stop = stopFunction.bind(this);
  }

  setStartDefaults(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { startDefaults } = options;

    if (typeof startDefaults !== 'function') {
      if (!isSilent) console.log(`setStartDefaults: Wrong type of setStartDefaults: ${typeof startDefaults}`);
      return;
    }

    this.startDefaults = startDefaults.bind(this);
  }

  setStopDefaults(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { stopDefaults } = options;

    if (typeof stopDefaults !== 'function') {
      if (!isSilent) console.log(`setStopDefaults: Wrong type of stopDefaults: ${typeof stopDefaults}`);
      return;
    }

    this.stopDefaults = stopDefaults.bind(this);
  }

  resetStartFunction() {
    this.start = this.startDefaults;
  }

  resetStopFunction() {
    this.stop = this.stopDefaults;
  }

  resetToDefaults() {
    this.stop();
    this.resetStartFunction();
    this.resetStopFunction();

    super.resetToDefaults();
  }
}

export default ServiceConfig;
