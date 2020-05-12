import fs from 'fs';
import WebpackLoader from '../../src/WebpackLoader';

const npmArguments = process.argv.slice(2);
const workspace = process.cwd();

const name = 'major';
const addName = 'minor';
const serviceConfName = 'service';


const customConfig = {
  entry: {
    major: `${workspace}/src/spec/manualTests/source.js`
  },
  output: {
    filename: '[name].prod.js',
    path: `${workspace}/src/spec/manualTests/testProd/`
  }
};

const additionalCustomConfig = {
  entry: {
    minor: `${workspace}/src/spec/manualTests/source.js`
  }
};


const wl = new WebpackLoader();

wl.makeNewConfig({ id: name, configData: { configs: customConfig } });

wl.makeNewConfig({
  id: addName,
  configData: { configs: [customConfig, additionalCustomConfig] }
});

wl.makeNewConfig({
  id: serviceConfName,
  isService: true,
  configData: {
    configs: { stats: 'errors-only' },
    startFunction() {
      this.handler = { a: 123 };
      this.isRunning = true;
    },
    stopFunction() {
      this.handler = null;
      this.isRunning = false;
    }
  }
});


try {
  fs.rmdirSync(`${workspace}/src/spec/manualTests/testProd`, { recursive: true });
} catch (e) {
  console.log('\nNo need to clear the folder.');
}


// Run method tests
if (npmArguments.includes('byObject')) {
  const { config } = wl.getConfig({ id: name });
  wl.start({ configs: config });
} else if (npmArguments.includes('byClass')) {
  const config = wl.getConfig({ id: name });
  wl.start({ configs: config });
} else if (npmArguments.includes('multi')) {
  wl.start({ configs: [name, addName] });
} else if (npmArguments.includes('withService')) {
  wl.start({ configs: [name, addName], serviceConfigs: [serviceConfName] });
  setTimeout(() => wl.stop({ configs: [name, addName], serviceConfigs: [serviceConfName] }), 5000);
} else {
  wl.start({ configs: [name] });
}
