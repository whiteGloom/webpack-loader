import WebpackLoader from './webpackLoader';
import Config from './Models/Config';
import defaults from './defaults/defaults';

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

describe('makeNewConfig method.', () => {
  describe('Default behavior {id, config[s], serviceOptions}: ', () => {
    const name = 'main';
    beforeEach(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('It takes "main", then makes new config with id "main".', () => {
      const result = wl.makeNewConfig(name, {});
      expect(result instanceof Config).toBeTruthy();
      expect(wl.getConfig(name)).toEqual(result);
    });

    it('It takes config, then makes config from passed config.', () => {
      const result = wl.makeNewConfig(name, additionalConfig);
      expect(result.config.entry.major).toEqual(gagName);
    });

    it('It takes array of configs, then makes config from passed configs array.', () => {
      const result = wl.makeNewConfig(name, [additionalConfig, anotherAdditionalConfig]);
      expect(result.config.entry.major).toEqual(gagName);
      expect(result.config.entry.minor).toEqual(gagName);
    });

    it('Returns new config.', () => {
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

    it('Takes null, returns undefined.', () => {
      const result = wl.makeNewConfig(null, null, ['isSilent']);
      expect(result).toBeUndefined();
      expect(Object.keys(wl._selectConfigsTree()).length).toEqual(0);
    });

    it('Takes object, returns undefined.', () => {
      const result = wl.makeNewConfig({}, null, ['isSilent']);
      expect(result).toBeUndefined();
      expect(Object.keys(wl._selectConfigsTree()).length).toEqual(0);
    });

    it('Takes NaN, returns undefined.', () => {
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

    it('It returns, if isForced flag is not passed.', () => {
      const result = wl.makeNewConfig(name, additionalConfig, ['isSilent']);
      expect(result).toBeUndefined();
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });

    it('If isForced flag is passed, rewrites the config.', () => {
      const result = wl.makeNewConfig(name, additionalConfig, ['isForced']);
      expect(result).toBeDefined();
      expect(result.config.entry.major).toEqual(gagName);
    });
  });
});

describe('addToConfig method.', () => {
  describe('Default behavior {id, config[s], serviceOptions}:', () => {
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

    it('It takes configs, then adds them to config.', () => {
      wl.addToConfig(name, additionalConfig);
      expect(wl.getConfig(name).config.entry.major).toEqual(gagName);
    });

    it('It takes array of configs, then adds them to config.', () => {
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

    it('Takes null, returns.', () => {
      wl.addToConfig(NaN, additionalConfig, ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });

    it('Takes object, returns.', () => {
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

    it('Takes string, returns.', () => {
      wl.addToConfig(name, 'someString', ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });

    it('Takes null, returns.', () => {
      wl.addToConfig(name, null, ['isSilent']);
      expect(wl.getConfig(name).config.entry.major).toBeUndefined();
    });
  });

  describe('When there is not config with such id:', () => {
    const name = 'main';
    beforeEach(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('If the isForced flag is passed, rewrite config.', () => {
      wl.addToConfig(name, additionalConfig, ['isSilent', 'isForced']);
      expect(wl.getConfig(name).config.entry.major).toEqual(gagName);
    });

    it('If the isForced flag is not passed, returns.', () => {
      wl.addToConfig(name, additionalConfig, ['isSilent']);
      expect(wl.getConfig(name, ['isSilent'])).toBeUndefined();
    });

    it('If the selected config is service, returns.', () => {
      wl.addToConfig(name, additionalConfig, ['isSilent']);
      expect(wl.getConfig(name, ['isService', 'isSilent'])).toBeUndefined();
    });
  });
});

describe('getConfig method.', () => {
  describe('Default behavior {id, serviceOptions}:', () => {
    const name = 'main';
    const wName = defaults.watchConfigId;
    beforeAll(() => {
      wl.makeNewConfig(name, additionalConfig);
    });

    it('It returns config with passed id.', () => {
      const result = wl.getConfig(name);
      const conf = wl._selectConfigsTree()[name];
      expect(result).toEqual(conf);
    });

    it('If the isService flag passed, returns service config.', () => {
      const result = wl.getConfig(wName, ['isService']);
      const conf = wl._selectConfigsTree(true)[wName];
      expect(result).toEqual(conf);
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('Takes null, returns.', () => {
      const result = wl.getConfig(NaN, ['isSilent']);
      expect(result).toBeUndefined();
    });

    it('Takes object, returns.', () => {
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

    it('It returns.', () => {
      const result = wl.getConfig('abrakadabra', ['isSilent']);
      expect(result).toBeUndefined();
    });
  });
});

describe('getConfigs method.', () => {
  afterAll(() => {
    wl.removeAllConfigs();
  });

  describe('Default behavior:', () => {
    it('Reruns object of configs.', () => {
      const result = wl.getConfigs();
      expect(result).toEqual(wl.configs);
    });
  });
});
