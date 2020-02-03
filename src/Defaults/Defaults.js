import colors from 'colors';
import helper from '../helper/helper';
import WebpackDevServer from 'webpack-dev-server';

const Defaults = {
  devServerConfigName: 'devServer',
  watchConfigName: 'watch',
  getSimpleConfigDefaults({ mode }) {
    if (!helper.isString(mode)) mode = 'development';
    return {
      mode,
      entry: {},
      output: {},
      module: {
        rules: [],
      },
      plugins: [],
      optimization: {},
      resolve: {},
    };
  },
  getNativeHandler({ callback }) {
    return (err, stats) => {
      let hasErrors = false;

      if (err) {
        console.error(err.stack || err);
        if (err.details) console.error(err.details);
        hasErrors = true;
      } else {
        const info = stats.toJson();

        if (stats.hasWarnings()) console.warn(info.warnings);
        if (stats.hasErrors()) {
          console.error(info.errors);
          hasErrors = true;
        }
      }

      if (hasErrors !== true) {
        console.log(colors.green.underline('\n\nCompiled successfully.\n\n'));
        if (typeof callback === 'function') callback(stats, true);
      } else {
        console.log(colors.red.underline('\n\nCompiled with errors!\n\n'));
        if (this.watcher) this.watcher = null;
        if (typeof callback === 'function') callback(stats, false);
      }
    };
  },
  getWatchServicePreset() {
    return {
      defaults: () => ({}),
      start: (conf, configured, { callback }) => {
        conf.handler = configured.watch(conf.config, helper.getNativeHandler({ callback }));
      },
      stop: (conf, { callback }) => {
        if (typeof callback !== 'function') callback = () => {};
        conf.handler.close(callback);
        conf.handler = null;
      },
    };
  },
  getDevServerServicePreset() {
    return {
      defaults: () => ({}),
      start: (conf, configured, { port, callback }) => {
        function devServerHandler(err) {
          if (!err) {
            console.log(`\n\nServer opened on http://localhost:${port}\n\n`);
          } else {
            console.error(err);
            console.log('\n\nDevServer has errors!\n\n');
          }
          if (typeof callback === 'function') callback(err);
        }
        conf.handler = new WebpackDevServer(configured, conf.config);
        conf.handler.listen(port, '127.0.0.1', devServerHandler);
      },
      stop: (conf, { callback }) => {
        if (typeof callback !== 'function') callback = () => {};
        conf.handler.stop(callback);
        conf.handler = null;
      },
    };
  },
};

export default Defaults;
