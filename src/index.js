import webpack from 'webpack';
import merge from 'webpack-merge';
import WebpackDevServer from 'webpack-dev-server';
import colors from 'colors';

import Helper from './Helper/Helper';
import Defaults from './Defaults/Defaults';

const defaults = new Defaults();

class WebpackLoader {
  constructor() {
    this.configs = {};
    this.serviceConfigs = {};

    this.devServerConfigName = defaults.devServerConfigName;
    this.watchConfigName = defaults.watchConfigName;
    this.devServer = null;
    this.watcher = null;

    this.serviceConfigs[this.devServerConfigName] = {};
    this.serviceConfigs[this.watchConfigName] = {};
  }

  makeNewConfig(id, newConfigs, mode, isForced = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.error(`Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!isForced && this._isUsed(id)) {
      console.error(`ID is already in use: ${id}`);
      return;
    }

    if (!Helper.isArr(newConfigs) && !Helper.isObj(newConfigs)) {
      console.error(`Wrong type of configs: ${typeof newConfigs}`);
      return;
    }

    this.configs[id] = defaults.getConfigDefaults(mode);

    if (!Helper.isArr(newConfigs)) newConfigs = [].push(newConfigs);

    newConfigs.forEach((config) => {
      this.configs[id] = merge([
        this.configs[id],
        config,
      ]);
    });
  }

  addToConfig(id, configs, isService = false, isForced = false) {
    const confsList = !isService ? this.configs : this.serviceConfigs;
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.error(`Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!Helper.isArr(configs) && !Helper.isObj(configs)) {
      console.error(`Wrong type of configs: ${typeof configs}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (isService || !isForced) {
        console.error(`There is no config with such ID: ${id}`);
        return;
      }

      confsList[id] = defaults.getConfigDefaults();
    }

    if (!Helper.isArr(configs)) configs = [].push(configs);

    configs.forEach((config) => {
      confsList[id] = merge([
        confsList[id],
        config,
      ]);
    });
  }

  getConfig(id, isService = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.error(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.error(`There is no config with such ID: ${id}`);
      return;
    }

    const confsList = !isService ? this.configs : this.serviceConfigs;
    return merge({}, confsList[id]);
  }

  getConfigForEdit(id, isService = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.error(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.error(`There is no config with such ID: ${id}`);
      return;
    }

    const confsList = !isService ? this.configs : this.serviceConfigs;
    return confsList[id];
  }

  getConfigs() {
    return this.configs;
  }

  resetConfig(id, mode, isService = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.error(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    const confsList = !isService ? this.configs : this.serviceConfigs;
    confsList[id] = defaults.getConfigDefaults(mode, isService, id);
  }

  removeConfig(id) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.error(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.error(`There is no config with such ID: ${id}`);
      return;
    }

    delete this.configs[id];
  }

  run({ identifiers, callback, port, isWatch = false, isDevServer = false }) {
    const webpackConfigured = webpack(this._buildConfigs(identifiers));

    function nativeHandler(err, stats) {
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
    }

    function devServerHandler(err) {
      if (!err) {
        console.log(`\n\nServer opened on http://localhost:${port}\n\n`);
      } else {
        console.error(err);
        console.log('\n\nDevServer has errors!\n\n');
      }

      if (typeof callback === 'function') callback(err);
    }

    if (isDevServer) {
      if (!Helper.isNumber(port)) port = 8080;
      this.devServer = new WebpackDevServer(webpackConfigured, this.serviceConfigs[this.devServerConfigName]);
      this.devServer.listen(port, '127.0.0.1', devServerHandler);
    } else if (isWatch) {
      this.watcher = webpackConfigured.watch(this.serviceConfigs[this.watchConfigName], nativeHandler);
    } else {
      webpackConfigured.run(nativeHandler);
    }
  }

  stop(callback) {
    if (this.devServer) {
      this.devServer.stop(callback);
      this.devServer = null;
      console.log(colors.green.underline('\n\nDevServer mode stopped.\n\n'));
    }
    if (this.watcher) {
      this.watcher.close(callback);
      this.watcher = null;
      console.log(colors.green.underline('\n\nWatch mode stopped.\n\n'));
    }
  }

  _buildConfigs(identifiers) {
    if (!Helper.isArr(identifiers)) identifiers = [].push(identifiers);

    if (!identifiers || !identifiers.length) {
      return Object.values(this.configs);
    } else {
      const result = [];
      identifiers.forEach((id) => {
        if (this.configs[id]) result.push(this.configs[id]);
      });
      return result;
    }
  }

  _isUsed(id, isService = false) {
    const confsList = !isService ? this.configs : this.serviceConfigs;
    return Object.keys(confsList).includes(id);
  }
}

export default WebpackLoader;
