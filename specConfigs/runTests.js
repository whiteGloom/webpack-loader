import Jasmine from 'jasmine';

const jasmine = new Jasmine();

jasmine.loadConfigFile('specConfigs/support/jasmine.json');
jasmine.execute();
