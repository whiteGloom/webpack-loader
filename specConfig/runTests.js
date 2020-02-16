import Jasmine from 'jasmine';

const jasmine = new Jasmine();

jasmine.loadConfigFile('specConfig/support/jasmine.json');
jasmine.execute();
