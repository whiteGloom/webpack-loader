import ServiceConfig from '../ServiceConfig';

const config = new ServiceConfig();

describe('setStartFunction(options, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const result = 123;
    function startFunction() { return result; }

    beforeEach(() => {
      config.resetToDefaults();
    });

    it('it takes { startFunction: function } as options, then changes start function to passed function.', () => {
      config.setStartFunction({ startFunction });

      expect(config.start()).toEqual(result);
    });
  });
});

describe('setStopFunction(options, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const result = 123;
    function stopFunction() { return result; }

    beforeEach(() => {
      config.resetToDefaults();
    });

    afterEach(() => {
      config.resetToDefaults();
    });

    it('it takes { stopFunction: function } as options, then changes stop function to passed function.', () => {
      config.setStopFunction({ stopFunction });

      expect(config.stop()).toEqual(result);
    });
  });
});

describe('setStartDefaults(options, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const result = 123;
    function startDefaults() { return result; }

    beforeEach(() => {
      config.resetToDefaults();
    });

    afterEach(() => {
      config.resetToDefaults();
    });

    it('it takes { startDefaults: function } as options, then changes start defaults function.', () => {
      config.setStartDefaults({ startDefaults });

      config.resetStartFunction();
      expect(config.start()).toEqual(result);
    });
  });
});

describe('setStopDefaults(options, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const result = 123;
    function stopDefaults() { return result; }

    beforeEach(() => {
      config.resetToDefaults();
    });

    afterAll(() => {
      config.setStopDefaults({ stopDefaults() {} });
      config.resetToDefaults();
    });

    it('it takes { startDefaults: function } as options, then changes start defaults function.', () => {
      config.setStopDefaults({ stopDefaults });

      config.resetStopFunction();
      expect(config.stop()).toEqual(result);
    });
  });
});

describe('resetStartFunction() method.', () => {
  describe('Default behavior:', () => {
    function startDefaults() { return 123; }

    beforeEach(() => {
      config.setStartDefaults({ startDefaults() {} });
      config.resetToDefaults();
    });

    afterAll(() => {
      config.setStartDefaults({ startDefaults() {} });
      config.resetToDefaults();
    });

    it('it resets start function to defaults.', () => {
      config.setStartDefaults({ startDefaults });

      config.setStartFunction({ startFunction() { return 'someWrongShit'; } });
      config.resetStartFunction();

      expect(config.start()).toEqual(123);
    });
  });
});


describe('resetStopFunction() method.', () => {
  describe('Default behavior:', () => {
    function stopDefaults() { return 123; }

    beforeEach(() => {
      config.setStopDefaults({ stopDefaults() {} });
      config.resetToDefaults();
    });

    afterAll(() => {
      config.setStopDefaults({ stopDefaults() {} });
      config.resetToDefaults();
    });

    it('it resets start function to defaults.', () => {
      config.setStopDefaults({ stopDefaults });

      config.setStopFunction({ stopFunction() { return 'someWrongShit'; } });
      config.resetStopFunction();

      expect(config.stop()).toEqual(123);
    });
  });
});
