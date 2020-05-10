import WebpackLoader from '../WebpackLoader';
import defaults from '../service/Defaults';

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
wl.init();

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
      const result = wl.makeNewConfig({ id: name, configs: additionalConfig });

      expect(result.config.entry.major).toEqual(gagName);
    });

    it('it takes { ...configs: [object config] } in options, then makes config from passed configs.', () => {
      const result = wl.makeNewConfig({ id: name, configs: [additionalConfig, anotherAdditionalConfig] });

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
      wl.resetConfig({ id: name });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns undefined.', () => {
      const result = wl.makeNewConfig({ id: name, configs: additionalConfig }, { isSilent: true });

      expect(result).toBeUndefined();
    });

    it('if { ...isForced: true } in serviceOptions, it rewrites the config.', () => {
      const result = wl.makeNewConfig({ id: name, configs: additionalConfig }, { isForced: true });

      expect(result).toBeDefined();
      expect(result.config.entry.major).toEqual(gagName);
    });
  });
});

describe('addToConfig(options, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const name = 'main';

    beforeAll(() => {
      wl.makeNewConfig({ id: name });
    });

    beforeEach(() => {
      wl.resetConfig({ id: name });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it takes { id: "main", configs: object config } as options, then adds them to "main" config.', () => {
      wl.addToConfig({ id: name, configs: additionalConfig });

      expect(wl.getConfig({ id: name }).config.entry.major).toEqual(gagName);
    });

    it('it takes { id: "main", configs: [object config] } as options, then adds configs to "main" config.', () => {
      wl.addToConfig({ id: name, configs: [additionalConfig, anotherAdditionalConfig] });

      const entries = wl.getConfig({ id: name }).config.entry;
      expect(entries.major).toEqual(gagName);
      expect(entries.minor).toEqual(gagName);
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    const name = 'main';

    beforeAll(() => {
      wl.makeNewConfig({ id: name });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns undefined.', () => {
      expect(wl.addToConfig({ id: NaN, configs: additionalConfig }, { isSilent: true })).toBeUndefined();
      expect(wl.addToConfig({ id: null, configs: additionalConfig }, { isSilent: true })).toBeUndefined();
      expect(wl.addToConfig({ id: {}, configs: additionalConfig }, { isSilent: true })).toBeUndefined();

      expect(wl.getConfig({ id: name }).config.entry.major).toBeUndefined();
    });
  });

  describe('When you try to pass not object or array as configs to add:', () => {
    const name = 'main';

    beforeAll(() => {
      wl.makeNewConfig({ id: name });
    });

    beforeEach(() => {
      wl.resetConfig({ id: name });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns undefined.', () => {
      wl.addToConfig({ id: name, configs: 'someString' }, { isSilent: true });
      wl.addToConfig({ id: name, configs: 0 }, { isSilent: true });

      expect(wl.getConfig({ id: name }).config.entry.major).toBeUndefined();
    });
  });

  describe('When there is no config with such id:', () => {
    const name = 'main';

    beforeEach(() => {
      wl.removeConfigs();
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns undefined.', () => {
      wl.addToConfig({ id: name, configs: additionalConfig }, { isSilent: true });

      expect(wl.getConfig({ id: name }, { isSilent: true })).toBeUndefined();
    });

    it('if { ...isForced: true } passed in serviceConfigs, creates new config.', () => {
      wl.addToConfig({ id: name, configs: additionalConfig }, { isSilent: true, isForced: true });

      expect(wl.getConfig({ id: name }).config.entry.major).toEqual(gagName);
    });
  });
});

describe('getConfig(id, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    const serviceName = 'some';

    beforeAll(() => {
      wl.makeNewConfig({ id: name, configs: additionalConfig });
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

describe('resetConfig(id, serviceOptions) method.', () => {
  describe('Default behavior:', () => {
    const name = 'main';

    beforeAll(() => {
      wl.makeNewConfig({ id: name });
    });

    beforeEach(() => {
      wl.addToConfig({ id: name, configs: additionalConfig });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it takes { id: "main" } as options, then resets "main" config to default.', () => {
      wl.resetConfig({ id: name });

      expect(wl.getConfig({ id: name }).config.entry.major).toBeUndefined();
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    const name = 'main';

    beforeAll(() => {
      wl.makeNewConfig({ id: name });
      wl.addToConfig({ id: name, configs: additionalConfig });
    });

    afterAll(() => {
      wl.removeConfigs();
    });

    it('it returns.', () => {
      wl.resetConfig({ id: {} }, { isSilent: true });
      wl.resetConfig({ id: NaN }, { isSilent: true });

      expect(wl.getConfig({ id: name }).config.entry.major).toEqual(gagName);
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
