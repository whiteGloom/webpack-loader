import WebpackDevServer from 'webpack-dev-server';
import colors from 'colors';

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
    const { callback, processName = 'Webpack' } = options;
    return (err, stats) => {
      let hasErrors = false;
      let hasWarnings = false;

      if (err) {
        console.error(err.stack || err);
        if (err.details) console.error(err.details);
        hasErrors = true;
      } else {
        const info = stats.toJson();

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
          hasWarnings = true;
        }
        if (stats.hasErrors()) {
          console.error(info.errors);
          hasErrors = true;
        }
      }

      if (!hasErrors) {
        if (hasWarnings) {
          console.log(colors.red.underline(`\n${processName}: compiled with warnings!\n`));
        } else {
          console.log(colors.green.underline(`\n${processName}: compiled successfully.\n`));
        }
        if (typeof callback === 'function') callback(stats, true);
      } else {
        if (hasErrors) console.log(colors.red.underline(`\n${processName}: compilation failed!\n`));
        if (this.watcher) this.watcher = null;
        if (typeof callback === 'function') callback(stats, false);
      }
    };
  },
  getWatchServicePreset() {
    return {
      start(configured, options = {}) {
        const { callback } = options;
        this.handler = configured.watch(this.config, defaults.getNativeHandler({
          processName: defaults.watchConfigId,
          callback
        }));
      },
      stop(options = {}) {
        let { callback } = options;
        if (typeof callback !== 'function') callback = () => {};
        this.handler.close(callback);
        console.log(colors.yellow.underline(`\n${defaults.watchConfigId}: compilation was stopped.\n`));
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
            console.log(colors.green.underline(`\nDevServer: opened on http://localhost:${port}\n`));
          } else {
            console.error(err);
            console.log(colors.red.underline('\nDevServer: can not be opened!\n'));
          }
          if (typeof callback === 'function') callback(err);
        }
        this.handler = new WebpackDevServer(configured, this.config);
        this.handler.listen(port, '127.0.0.1', devServerHandler);
      },
      stop(options = {}) {
        let { callback } = options;
        if (typeof callback !== 'function') callback = () => {};
        this.handler.close(callback);
        console.log(colors.yellow.underline(`\n${defaults.devServerConfigId}: compilation was stopped.\n`));
        this.handler = null;
      }
    };
  }
};

export default defaults;
