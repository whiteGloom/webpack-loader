import WebpackLoader from './webpackLoader';
import Config from './Models/Config';

const additionalConfig = {
  entry: {
    major: 'gag.js'
  }
};

const anotherAdditionalConfig = {
  entry: {
    minor: 'gag.js'
  }
};

const wl = new WebpackLoader();

describe('makeNewConfig method.', () => {
  describe('Default behavior: ', () => {
    beforeEach(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('It makes new config with id "main".', () => {
      const result = wl.makeNewConfig('main', {});
      expect(result instanceof Config).toBeTruthy();
      expect(wl.getConfig('main')).toEqual(result);
    });

    it('It makes config from passed config.', () => {
      const result = wl.makeNewConfig('main', additionalConfig);
      expect(result.config.entry.major).toEqual('gag.js');
    });

    it('It makes config from passed configs array.', () => {
      const result = wl.makeNewConfig('main', [additionalConfig, anotherAdditionalConfig]);
      expect(result.config.entry.major).toEqual('gag.js');
      expect(result.config.entry.minor).toEqual('gag.js');
    });

    it('Returns new config.', () => {
      const result = wl.makeNewConfig('main', {});
      expect(wl.getConfig('main')).toEqual(result);
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
    beforeAll(() => {
      wl.makeNewConfig('main');
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('It returns, if isForced flag is not passed.', () => {
      const result = wl.makeNewConfig('main', additionalConfig, ['isSilent']);
      expect(result).toBeUndefined();
      expect(wl.getConfig('main').config.entry.major).toBeUndefined();
    });

    it('If isForced flag is passed, rewrites the config.', () => {
      const result = wl.makeNewConfig('main', additionalConfig, ['isForced']);
      expect(result).toBeDefined();
      expect(result.config.entry.major).toEqual('gag.js');
    });
  });
});

describe('addToConfig method.', () => {
  describe('Default behavior:', () => {
    beforeAll(() => {
      wl.makeNewConfig('main');
    });

    beforeEach(() => {
      wl.resetConfig('main');
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('It adds config to config.', () => {
      wl.addToConfig('main', additionalConfig);
      expect(wl.getConfig('main').config.entry.major).toEqual('gag.js');
    });

    it('It adds configs to config.', () => {
      wl.addToConfig('main', [additionalConfig, anotherAdditionalConfig]);
      expect(wl.getConfig('main').config.entry.major).toEqual('gag.js');
      expect(wl.getConfig('main').config.entry.minor).toEqual('gag.js');
    });
  });

  describe('When you try to pass not number or string as id:', () => {
    beforeAll(() => {
      wl.makeNewConfig('main');
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('Takes null, returns.', () => {
      wl.addToConfig(NaN, additionalConfig, ['isSilent']);
      expect(wl.getConfig('main').config.entry.major).toBeUndefined();
    });

    it('Takes object, returns.', () => {
      wl.addToConfig({}, additionalConfig, ['isSilent']);
      expect(wl.getConfig('main').config.entry.major).toBeUndefined();
    });
  });

  describe('When you try to pass not object or array as configs to add:', () => {
    beforeAll(() => {
      wl.makeNewConfig('main');
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('Takes string, returns undefined.', () => {
      wl.addToConfig('main', 'someString', ['isSilent']);
      expect(wl.getConfig('main').config.entry.major).toBeUndefined();
    });

    it('Takes null, returns undefined.', () => {
      wl.addToConfig('main', null, ['isSilent']);
      expect(wl.getConfig('main').config.entry.major).toBeUndefined();
    });
  });

  describe('When there is not config with such id:', () => {
    beforeEach(() => {
      wl.removeAllConfigs();
    });

    afterAll(() => {
      wl.removeAllConfigs();
    });

    it('If the isForced flag is passed, rewrite config.', () => {
      wl.addToConfig('main', additionalConfig, ['isSilent', 'isForced']);
      expect(wl.getConfig('main').config.entry.major).toEqual('gag.js');
    });

    it('If the isForced flag is not passed, returns.', () => {
      wl.addToConfig('main', additionalConfig, ['isSilent']);
      expect(wl.getConfig('main', ['isSilent'])).toBeUndefined();
    });

    it('If the selected config is service, returns.', () => {
      wl.addToConfig('watch', additionalConfig, ['isSilent']);
      expect(wl.getConfig('watch', ['isService', 'isSilent'])).toBeUndefined();
    });
  });
});
