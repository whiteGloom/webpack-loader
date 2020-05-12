import Config from '../Config';

const config = new Config();

describe('addToConfig(options, serviceOptions method).', () => {
  describe('Default behavior:', () => {
    const gagNameOne = 'some.js';
    const gagNameTwo = 'someAnother.js';

    beforeEach(() => {
      config.resetToDefaults();
    });

    afterAll(() => {
      config.resetToDefaults();
    });

    it('Takes { configs: object config } as options, then merges passed config into config.', () => {
      config.addToConfig({ configs: { entry: gagNameOne } });

      expect(config.config.entry).toEqual(gagNameOne);
    });

    it('Takes { config: [object config] } as options, then merges passed configs into config.', () => {
      config.addToConfig({
        configs: [
          { entry: { major: gagNameOne } },
          { entry: { minor: gagNameTwo } }
        ]
      });

      expect(config.config.entry.major).toEqual(gagNameOne);
      expect(config.config.entry.minor).toEqual(gagNameTwo);
    });
  });
});

describe('setConfigDefaultsGetter(options, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const entry = 'main.js';
    const getterFunc = () => ({ entry });

    beforeEach(() => {
      config.resetToDefaults();
      config.addToConfig({ configs: { entry: 'someWrongShit' } });
    });

    afterAll(() => {
      config.resetToDefaults();
    });

    it('Takes { configDefaultsGetter: func } as options, then changes getter to passed function.', () => {
      config.setConfigDefaultsGetter({ configDefaultsGetter: getterFunc });
      config.resetConfig();

      expect(config.config.entry).toEqual(entry);
    });
  });
});


describe('resetConfig() method.', () => {
  describe('Default behavior:', () => {
    const entry = 'main.js';

    beforeEach(() => {
      config.resetToDefaults();
      config.setConfigDefaultsGetter({ configDefaultsGetter() { return { entry }; } });
      config.addToConfig({ configs: { entry: 'someWrongShit' } });
    });

    afterAll(() => {
      config.resetToDefaults();
    });

    it('Resets config.', () => {
      config.resetConfig();

      expect(config.config.entry).toEqual(entry);
    });
  });
});
