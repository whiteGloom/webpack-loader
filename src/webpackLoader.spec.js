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

  describe('When the config already exist: ', () => {
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
});
