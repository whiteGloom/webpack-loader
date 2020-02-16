import WebpackLoader from '../../webpackLoader';

const npmArguments = process.argv.slice(2);
const workspace = process.cwd();

const name = 'main';
const additionalConfig = {
  entry: {
    major: `${workspace}/src/spec/manualTests/source.js`
  },
  output: {
    filename: '[name].prod.js',
    path: `${workspace}/src/spec/manualTests/testProd/`
  }
};

const wl = new WebpackLoader();
wl.makeNewConfig(name, additionalConfig);
wl.addToConfig('devServer', { stats: 'errors-only' }, ['isService']);

if (npmArguments.includes('run')) {
  if (npmArguments.includes('byObject')) {
    const { config } = wl.getConfig(name);
    wl.run(config);
  } else if (npmArguments.includes('byClass')) {
    const config = wl.getConfig(name);
    wl.run(config);
  } else {
    wl.run([name], [], { callback: () => console.log('Done!') });
  }
}

if (npmArguments.includes('watch')) {
  if (npmArguments.includes('byClass')) {
    const config = wl.getConfig(name);
    const serviceConfig = wl.getConfig('watch', ['isService']);
    wl.run([config], [serviceConfig], { callback: () => console.log('Done!') });
  } else {
    wl.run([name], ['watch'], { callback: () => console.log('Done!') });
  }

  if (npmArguments.includes('stop')) {
    setTimeout(() => {
      wl.stop({ callback: () => console.log('Stopped!') });
    }, 5000);
  }
}

if (npmArguments.includes('devServer')) {
  if (npmArguments.includes('byClass')) {
    const config = wl.getConfig(name);
    const serviceConfig = wl.getConfig('devServer', ['isService']);
    wl.run([config], [serviceConfig], { callback: () => console.log('Done!') });
  } else {
    wl.run([name], ['devServer'], { callback: () => console.log('Done!') });
  }

  if (npmArguments.includes('stop')) {
    setTimeout(() => {
      wl.stop({ callback: () => console.log('Stopped!') });
    }, 5000);
  }
}
