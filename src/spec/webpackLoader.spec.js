import WebpackLoader from '../WebpackLoader';

const gagName = 'gag.js';
const additionalConfig = {
  entry: {
    major: gagName
  }
};

const anotherAdditionalConfig = {
  entry: {
    minor: gagName
  }
};

const wl = new WebpackLoader();

describe('makeNewConfig(options, serviceOptions) method.', () => {
  describe('Default behavior: ', () => {
    const name = 'main';
    const serviceName = 'service';

    beforeEach(() => {
      wl.removeConfigs();
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it takes { id: "main" } as options, then creates new config with id "main".', () => {
      const result = wl.makeNewConfig({ id: name });

      expect(result instanceof wl.getModel(false)).toBeTruthy();
      expect(wl.getConfig({ id: name })).toEqual(result);
    });

    it('it takes { ...isService: true } in options, then creates new service config.', () => {
      const result = wl.makeNewConfig({ id: serviceName, isService: true });

      expect(result instanceof wl.getModel(true)).toBeTruthy();
    });

    it('it takes { ...configs: object config } in options, then creates config with passed config.', () => {
      const result = wl.makeNewConfig({ id: name, configData: { configs: additionalConfig } });

      expect(result.config.entry.major).toEqual(gagName);
    });

    it('it takes { ...configs: [object config] } in options, then makes config from passed configs.', () => {
      const result = wl.makeNewConfig({
        id: name,
        configData: { configs: [additionalConfig, anotherAdditionalConfig] }
      });

      expect(result.config.entry.major).toEqual(gagName);
      expect(result.config.entry.minor).toEqual(gagName);
    });

    it('it returns new config.', () => {
      const result = wl.makeNewConfig({ id: name });

      expect(wl.getConfig({ id: name })).toEqual(result);
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    beforeEach(() => {
      wl.removeConfigs();
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns undefined.', () => {
      expect(wl.makeNewConfig({ id: null }, { isSilent: true })).toBeUndefined();
      expect(wl.makeNewConfig({ id: {} }, { isSilent: true })).toBeUndefined();
      expect(wl.makeNewConfig({ id: '' }, { isSilent: true })).toBeUndefined();

      expect(Object.keys(wl._selectConfigsBranch()).length).toEqual(0);
    });
  });

  describe('When the config already exist:', () => {
    const name = 'main';

    beforeAll(() => {
      wl.makeNewConfig({ id: name });
    });

    beforeEach(() => {
      wl.getConfig({ id: name }).resetToDefaults();
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns undefined.', () => {
      const result = wl.makeNewConfig({
        id: name,
        configData: { configs: additionalConfig }
      }, { isSilent: true });

      expect(result).toBeUndefined();
    });

    it('if { ...isForced: true } in serviceOptions, it rewrites the config.', () => {
      const result = wl.makeNewConfig({
        id: name,
        configData: { configs: additionalConfig }
      }, { isForced: true });

      expect(result).toBeDefined();
      expect(result.config.entry.major).toEqual(gagName);
    });
  });
});

describe('getConfig(id, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    const serviceName = 'some';

    beforeAll(() => {
      wl.makeNewConfig({ id: name, configData: { configs: additionalConfig } });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it takes { id: "main" } as options, then return "main" config.', () => {
      const result = wl.getConfig({ id: name });
      const config = wl._selectConfigsBranch()[name];

      expect(result).toEqual(config);
    });

    it('if { ...isService: true } passed in serviceOptions, it returns service config.', () => {
      wl.makeNewConfig({ id: serviceName, isService: true });
      const config = wl._selectConfigsBranch(true)[serviceName];

      const result = wl.getConfig({ id: serviceName, isService: true });
      expect(result).toEqual(config);
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    afterAll(() => {
      wl.removeConfigs();
    });

    it('it takes null as id, then returns.', () => {
      const result = wl.getConfig({ id: NaN }, { isSilent: true });
      expect(result).toBeUndefined();
    });

    it('it takes object as id, then returns.', () => {
      const result = wl.getConfig({ id: {} }, { isSilent: true });
      expect(result).toBeUndefined();
    });
  });

  describe('When there is not config with such id:', () => {
    beforeAll(() => {
      wl.removeConfigs();
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns undefined.', () => {
      const result = wl.getConfig({ id: 'London' }, { isSilent: true });
      expect(result).toBeUndefined();
    });
  });
});

describe('getConfigs(options) method.', () => {
  describe('Default behavior:', () => {
    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns object with simple configs.', () => {
      const result = wl.getConfigs();

      expect(result).toEqual(wl._selectConfigsBranch(false));
    });

    it('it takes { isService: true } as options, returns object with service configs.', () => {
      const result = wl.getConfigs({ isService: true });

      expect(result).toEqual(wl._selectConfigsBranch(true));
    });
  });
});

describe('removeConfig(id, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const name = 'main';

    beforeEach(() => {
      wl.makeNewConfig({ id: name }, { isSilent: true });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it takes { id: "main" } as options, then removes "main" config from configs.', () => {
      wl.removeConfig({ id: name });

      expect(wl.getConfig({ id: name }, { isSilent: true })).toBeUndefined();
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    const name = 'main';

    beforeEach(() => {
      wl.makeNewConfig({ id: name }, { isSilent: true });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns.', () => {
      wl.removeConfig({ id: {} }, { isSilent: true });
      wl.removeConfig({ id: NaN }, { isSilent: true });

      expect(wl.getConfig({ id: name })).toBeDefined();
    });
  });
});

describe('removeConfigs method.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    const anotherName = 'notMain';

    beforeAll(() => {
      wl.makeNewConfig({ id: name });
      wl.makeNewConfig({ id: anotherName });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it removes all not service configs.', () => {
      wl.removeConfigs();

      expect(wl.getConfig({ id: name }, { isSilent: true })).toBeUndefined();
      expect(wl.getConfig({ id: anotherName }, { isSilent: true })).toBeUndefined();
    });
  });
});
