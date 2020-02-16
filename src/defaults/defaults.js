import WebpackDevServer from 'webpack-dev-server';
import colors from 'colors';
import helper from '../helper/helper';

const defaults = {
  devServerConfigId: 'devServer',
  watchConfigId: 'watch',
  getSimpleConfigDefaults() {
    return () => ({
      mode: 'development',
      entry: {},
      output: {},
      module: {
        rules: []
      },
      plugins: [],
      optimization: {},
      resolve: {}
    });
  },
  getNativeHandler(options = {}) {
    const { callback } = options;
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
      start(configured, options = {}) {
        const { callback } = options;
        this.handler = configured.watch(this.config, defaults.getNativeHandler({ callback }));
      },
      stop(options = {}) {
        let { callback } = options;
        if (typeof callback !== 'function') callback = () => {};
        this.handler.close(callback);
        this.handler = null;
      }
    };
  },
  getDevServerServicePreset() {
    return {
      start(configured, options = {}) {
        const { port = 8080, callback } = options;
        function devServerHandler(err) {
          if (!err) {
            console.log(colors.green.underline(`\n\nServer opened on http://localhost:${port}\n\n`));
          } else {
            console.error(err);
            console.log(colors.red.underline('\n\nDevServer has errors!\n\n'));
          }
          if (typeof callback === 'function') callback(err);
        }
        this.handler = new WebpackDevServer(configured, this.config);
        this.handler.listen(port, '127.0.0.1', devServerHandler);
      },
      stop(options = {}) {
        let { callback } = options;
        if (typeof callback !== 'function') callback = () => {};
        this.handler.stop(callback);
        this.handler = null;
      }
    };
  }
};

export default defaults;
