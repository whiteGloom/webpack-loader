import WebpackLoader from './index';
import Config from './Models/Config';

const wl = new WebpackLoader();

describe('makeNewConfig method', () => {
  it('should makes new config', () => {
    const result = wl.makeNewConfig('main', {});
    expect(result instanceof Config).toBeTruthy();
  });
});
