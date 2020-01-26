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

    this.serviceConfigs[this.devServerConfigName] = {};
    this.serviceConfigs[this.watchConfigName] = {};
  }

  makeNewConfig(id, newConfigs, mode, force = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.log(`Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!force && this._isUsed(id)) {
      console.log(`ID is already in use: ${id}`);
      return;
    }

    if (!Helper.isArr(newConfigs) && !Helper.isObj(newConfigs)) {
      console.log(`Wrong type of configs: ${typeof newConfigs}`);
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

  addToConfig(id, configs, isService = false, force = false) {
    const confsList = !isService ? this.configs : this.serviceConfigs;
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.log(`Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!Helper.isArr(configs) && !Helper.isObj(configs)) {
      console.log(`Wrong type of configs: ${typeof configs}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (isService || !force) {
        console.log(`There is no config with such ID: ${id}`);
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
      console.log(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.log(`There is no config with such ID: ${id}`);
      return;
    }

    const confsList = !isService ? this.configs : this.serviceConfigs;
    return merge({}, confsList[id]);
  }

  getConfigForEdit(id, isService = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.log(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.log(`There is no config with such ID: ${id}`);
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
      console.log(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    const confsList = !isService ? this.configs : this.serviceConfigs;
    confsList[id] = defaults.getConfigDefaults(mode, isService, id);
  }

  removeConfig(id) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.log(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.log(`There is no config with such ID: ${id}`);
      return;
    }

    delete this.configs[id];
  }

  run(identifiers, callback, isWatch = false) {
    const webpackConfigured = webpack(this._buildConfigs(identifiers));

    function handler(err, stats) {
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

    if (isWatch) {
      webpackConfigured.run(handler);
    } else {
      this.watcher = webpackConfigured.watch(this.serviceConfigs[this.watchConfigName], handler);
    }
  }

  runDevServer(identifiers, userPort, callback) {
    let port = userPort;
    if (!Helper.isNumber(port)) port = 8080;

    const webpackConfigured = webpack(this._buildConfigs(identifiers));
    this.devServer = new WebpackDevServer(webpackConfigured, this.serviceConfigs[this.devServerConfigName]);

    this.devServer.listen(port, '127.0.0.1', (err) => {
      if (!err) {
        console.log(`\n\nStarting server on http://localhost:${port}\n\n`);
      } else {
        console.log(err);
        console.log('\n\nDevServer has errors!\n\n');
      }

      if (typeof callback === 'function') callback(err);
    });
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
    const result = [];
    if (identifiers && identifiers.length > 0) {
      identifiers.forEach((id) => {
        if (this.configs[id]) result.push(this.configs[id]);
      });
    } else {
      this.configs.forEach((config) => {
        result.push(config);
      });
    }
    return result;
  }

  _isUsed(id, isService = false) {
    const confsList = !isService ? this.configs : this.serviceConfigs;
    return Object.keys(confsList).includes(id);
  }
}

export default WebpackLoader;
