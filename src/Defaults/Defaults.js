import colors from 'colors';
import Helper from '../Helper/Helper';

const Defaults = {
  devServerConfigName: 'devServer',
  watchConfigName: 'watch',
  getSimpleConfigDefaults(mode) {
    if (!Helper.isString(mode)) mode = 'development';
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
  getNativeHandler(callback, err, stats) {
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
  },
};

export default Defaults;
