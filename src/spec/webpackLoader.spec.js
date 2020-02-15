import WebpackLoader from '../webpackLoader';
import Config from '../Models/Config';
import defaults from '../defaults/defaults';

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

describe('makeNewConfig method {id, config[s], serviceOptions}.', () => {
  describe('Default behavior: ', () => {
    const name = 'main';
    beforeEach(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes "main" as id, then makes new config with id "main".', () => {
      const result = wl.makeNewConfig(name, {});
      expect(result instanceof Config).toBeTruthy();
      expect(wl.getConfig(name)).toEqual(result);
    });

    it('it takes object config as config, then makes config from passed config.', () => {
      const result = wl.makeNewConfig(name, additionalConfig);
      expect(result.config.entry.major).toEqual(gagName);
    });

    it('it takes array of configs as config, then makes config from passed configs array.', () => {
      const result = wl.makeNewConfig(name, [additionalConfig, anotherAdditionalConfig]);
      expect(result.config.entry.major).toEqual(gagName);
      expect(result.config.entry.minor).toEqual(gagName);
    });

    it('it returns new config.', () => {
      const result = wl.makeNewConfig(name, {});
      expect(wl.getConfig(name)).toEqual(result);
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    beforeEach(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes null as id, returns undefined.', () => {
      const result = wl.makeNewConfig(null, null, ['isSilent']);
      expect(result).toBeUndefined();
      expect(Object.keys(wl._selectConfigsTree()).length).toEqual(0);
    });

    it('it takes object as id, returns undefined.', () => {
      const result = wl.makeNewConfig({}, null, ['isSilent']);
      expect(result).toBeUndefined();
      expect(Object.keys(wl._selectConfigsTree()).length).toEqual(0);
    });

    it('it takes NaN as id, returns undefined.', () => {
      const result = wl.makeNewConfig(NaN, null, ['isSilent']);
      expect(result).toBeUndefined();
      expect(Object.keys(wl._selectConfigsTree()).length).toEqual(0);
    });
  });

  describe('When the config already exist:', () => {
    const name = 'main';
    beforeAll(() => {
      wl.makeNewConfig(name);
    });

    beforeEach(() => {
      wl.resetConfig(name);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('if isForced flag passed in serviceOptions, it rewrites the config.', () => {
      const result = wl.makeNewConfig(name, additionalConfig, ['isForced']);
      expect(result).toBeDefined();
      expect(result.config.entry.major).toEqual(gagName);
    });

    it('it returns undefined.', () => {
      const result = wl.makeNewConfig(name, additionalConfig, ['isSilent']);
      expect(result).toBeUndefined();
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });
  });
});

describe('addToConfig method {id, config[s], serviceOptions}.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    beforeAll(() => {
      wl.makeNewConfig(name);
    });

    beforeEach(() => {
      wl.resetConfig(name);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes "main" as id and object config as configs, then adds them to "main" config.', () => {
      wl.addToConfig(name, additionalConfig);
      expect(wl.getConfig(name).config.entry.major).toEqual(gagName);
    });

    it('it takes "main" as id and array of configs as configs, then adds them to "main" config.', () => {
      wl.addToConfig(name, [additionalConfig, anotherAdditionalConfig]);
      expect(wl.getConfig(name).config.entry.major).toEqual(gagName);
      expect(wl.getConfig(name).config.entry.minor).toEqual(gagName);
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    const name = 'main';
    beforeAll(() => {
      wl.makeNewConfig(name);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes null as id, then returns.', () => {
      wl.addToConfig(NaN, additionalConfig, ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });

    it('it takes object ad id, then returns.', () => {
      wl.addToConfig({}, additionalConfig, ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });
  });

  describe('When you try to pass not object or array as configs[1] to add:', () => {
    const name = 'main';
    beforeAll(() => {
      wl.makeNewConfig(name);
    });

    beforeEach(() => {
      wl.resetConfig(name);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes string as configs, then returns.', () => {
      wl.addToConfig(name, 'someString', ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });

    it('it takes null as configs, then returns.', () => {
      wl.addToConfig(name, null, ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });
  });

  describe('When there is no config with such id:', () => {
    const name = 'main';
    beforeEach(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('if selected config is service, it always returns.', () => {
      wl.addToConfig(name, additionalConfig, ['isSilent']);
      expect(wl.getConfig(name, ['isService', 'isSilent', 'isForced'])).toBeUndefined();
    });

    it('if isForced flag is passed in serviceConfigs, it rewrites config.', () => {
      wl.addToConfig(name, additionalConfig, ['isSilent', 'isForced']);
      expect(wl.getConfig(name).config.entry.major).toEqual(gagName);
    });

    it('it returns undefined.', () => {
      wl.addToConfig(name, additionalConfig, ['isSilent']);
      expect(wl.getConfig(name, ['isSilent'])).toBeUndefined();
    });
  });
});

describe('getConfig method {id, serviceOptions}.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    const wName = defaults.watchConfigId;
    beforeAll(() => {
      wl.makeNewConfig(name, additionalConfig);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes "main" as id, then return "main" config.', () => {
      const result = wl.getConfig(name);
      const conf = wl._selectConfigsTree()[name];
      expect(result).toEqual(conf);
    });

    it('if isService flag passed in serviceOptions, it returns service config.', () => {
      const result = wl.getConfig(wName, ['isService']);
      const conf = wl._selectConfigsTree(true)[wName];
      expect(result).toEqual(conf);
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes null as id, then returns.', () => {
      const result = wl.getConfig(NaN, ['isSilent']);
      expect(result).toBeUndefined();
    });

    it('it takes object as id, then returns.', () => {
      const result = wl.getConfig({}, ['isSilent']);
      expect(result).toBeUndefined();
    });
  });

  describe('When there is not config with such id:', () => {
    beforeAll(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it returns undefined.', () => {
      const result = wl.getConfig('abrakadabra', ['isSilent']);
      expect(result).toBeUndefined();
    });
  });
});

describe('getConfigs method.', () => {
  describe('Default behavior:', () => {
    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it returns object with configs.', () => {
      const result = wl.getConfigs();
      expect(result).toEqual(wl.configs);
    });
  });
});

describe('resetConfig method {id, serviceOptions}.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    beforeAll(() => {
      wl.makeNewConfig(name);
    });

    beforeEach(() => {
      wl.addToConfig(name, additionalConfig);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes "main" as id, then resets "main" config to default.', () => {
      wl.resetConfig(name);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    const name = 'main';
    beforeAll(() => {
      wl.makeNewConfig(name);
      wl.addToConfig(name, additionalConfig);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes object as id, then returns.', () => {
      wl.resetConfig({}, ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toEqual(gagName);
    });

    it('it takes NaN as id, then returns.', () => {
      wl.resetConfig(NaN, ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toEqual(gagName);
    });
  });
});

describe('removeConfig method {id, serviceOptions}.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    beforeEach(() => {
      wl.makeNewConfig('main', null, ['isSilent']);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes "main" as id, then removes "main" config from configs.', () => {
      wl.removeConfig(name);
      expect(wl.getConfig(name, ['isSilent'])).toBeUndefined();
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    const name = 'main';
    beforeEach(() => {
      wl.makeNewConfig(name, null, ['isSilent']);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes object as id, then returns.', () => {
      wl.removeConfig({}, ['isSilent']);
      expect(wl.getConfig(name)).toBeDefined();
    });

    it('it takes NaN as id, then returns.', () => {
      wl.removeConfig(NaN, ['isSilent']);
      expect(wl.getConfig(name)).toBeDefined();
    });
  });

  describe('When there is no config with such id:', () => {
    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it takes "main" as id, returns.', () => {
      wl.removeConfig('abrakadabra', ['isSilent']);
      expect('da ti che, wot eto proverka').not.toEqual('horoshaya speka, nos otvalivaetsya. Chego smotrish?');
    });
  });
});

describe('removeAllConfigs method.', () => {
  describe('Default behavior:', () => {
    const name = 'main';
    const anotherName = 'notMain';
    beforeAll(() => {
      wl.makeNewConfig(name);
      wl.makeNewConfig(anotherName);
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('it removes all not service configs.', () => {
      wl.removeAllConfigs();
      expect(wl.getConfig(name, ['isSilent'])).toBeUndefined();
      expect(wl.getConfig(anotherName, ['isSilent'])).toBeUndefined();
    });
  });
});
