import fs from 'fs';
import WebpackLoader from '../../webpackLoader';

const npmArguments = process.argv.slice(2);
const workspace = process.cwd();

const name = 'major';
const addName = 'minor';
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
wl.makeNewConfig(name, { configs: customConfig });
wl.makeNewConfig(addName, { configs: [customConfig, additionalCustomConfig] });
wl.addToConfig('devServer', { stats: 'errors-only' }, ['isService']);

try {
  fs.rmdirSync(`${workspace}/src/spec/manualTests/testProd`, { recursive: true });
} catch (e) {
  console.log(e, '\nNo need to clear the folder.');
}

// Run method tests
if (npmArguments.includes('run')) {
  if (npmArguments.includes('byObject')) {
    const { config } = wl.getConfig(name);
    wl.run(config);
  } else if (npmArguments.includes('byClass')) {
    const config = wl.getConfig(name);
    wl.run(config);
  } else if (npmArguments.includes('multi')) {
    wl.run([name, addName], [], { callback: () => console.log('Done!') });
  } else {
    wl.run([name], [], { callback: () => console.log('Done!') });
  }
}

// Watch method tests
if (npmArguments.includes('watch')) {
  if (npmArguments.includes('byClass')) {
    const config = wl.getConfig(name);
    const serviceConfig = wl.getConfig('watch', ['isService']);
    wl.run([config], [serviceConfig], { callback: () => console.log('Done!') });
  } else if (npmArguments.includes('multi')) {
    wl.run([name, addName], ['watch'], { callback: () => console.log('Done!') });
  } else {
    wl.run([name], ['watch'], { callback: () => console.log('Done!') });
  }

  if (npmArguments.includes('stop')) {
    setTimeout(() => {
      wl.stop({ callback: () => console.log('Stopped!') });
    }, 5000);
  }
}

// devServer method tests
if (npmArguments.includes('devServer')) {
  if (npmArguments.includes('byClass')) {
    const config = wl.getConfig(name);
    const serviceConfig = wl.getConfig('devServer', ['isService']);
    wl.run([config], [serviceConfig], { callback: () => console.log('Done!') });
  } else if (npmArguments.includes('multi')) {
    wl.run([name, addName], ['devServer'], { callback: () => console.log('Done!') });
  } else {
    wl.run([name], ['devServer'], { callback: () => console.log('Done!') });
  }

  if (npmArguments.includes('stop')) {
    setTimeout(() => {
      wl.stop({ callback: () => console.log('Stopped!') });
    }, 5000);
  }
}
