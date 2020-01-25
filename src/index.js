import webpack from 'webpack';
import merge from 'webpack-merge';
import WebpackDevServer from 'webpack-dev-server';
import colors from 'colors';

import Helper from './Helper/Helper';
import Defaults from './Defaults/Defaults';

const defaults = new Defaults();

class WebpackLoader {
  constructor() {
    this.devServerConfigName = defaults.devServerConfigName;
    this.watchConfigName = defaults.watchConfigName;

    this.configs = {};
    this.serviceConfigs = {};

    this.serviceConfigs[this.devServerConfigName] = {};
    this.serviceConfigs[this.watchConfigName] = {};
  }

  makeNewConfig(id, newConfigs, mode, force) {
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

    if (Helper.isArr(newConfigs)) {
      newConfigs.forEach((config) => {
        this.configs[id] = merge([
          this.configs[id],
          config,
        ]);
      });
    } else {
      this.configs[id] = merge([
        this.configs[id],
        newConfigs,
      ]);
    }
  }

  addToConfig(id, configs, isService, force) {
    let isUsed = false;
    const confsList = !isService ? this.configs : this.serviceConfigs;
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.log(`Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    isUsed = this._isUsed(id, isService);

    if ((!isUsed && isService) || (!isUsed && !isService && !force)) {
      console.log(`The is no config with such ID: ${id}`);
      return;
    }

    if (!Helper.isArr(configs) && !Helper.isObj(configs)) {
      console.log(`Wrong type of configs: ${typeof configs}`);
      return;
    }

    if (!isUsed) {
      confsList[id] = defaults.getConfigDefaults();
    }


    if (Helper.isArr(configs)) {
      configs.forEach((config) => {
        confsList[id] = merge([
          confsList[id],
          config,
        ]);
      });
    } else {
      confsList[id] = merge([
        confsList[id],
        configs,
      ]);
    }
  }

  getConfig(id, isService) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.log(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.log(`The is no config with such ID: ${id}`);
      return;
    }

    const confsList = !isService ? this.configs : this.serviceConfigs;
    return merge({}, confsList[id]);
  }

  getConfigForEdit(id, isService) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      console.log(`Wrong type of identificator ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      console.log(`The is no config with such ID: ${id}`);
      return;
    }

    const confsList = !isService ? this.configs : this.serviceConfigs;
    return confsList[id];
  }

  getConfigs() {
    return this.configs;
  }

  resetConfig(id, mode, isService) {
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
      console.log(`The is no config with such ID: ${id}`);
      return;
    }

    delete this.configs[id];
  }

  run(callback, idList) {
    const webpackConfigured = webpack(this._buildConfigs(idList));

    function handler(err, stats) {
      let hasErrors = false;

      if (stats && stats.compilation && stats.compilation.errors.length !== 0) {
        console.log(stats.compilation.errors);
        console.log(colors.red.underline('\n\nCompiled with errors!\n\n'));
        hasErrors = true;
      }
      if (err) {
        console.log(err);
        console.log(colors.red.underline('\n\nCompiled with errors!\n\n'));
        hasErrors = true;
      }

      if (hasErrors !== true) {
        console.log(colors.green.underline('\n\nCompiled successfully.\n\n'));
        if (typeof callback === 'function') callback(stats);
      }
    }

    webpackConfigured.run(handler);
  }

  runWatch(idList) {
    const webpackConfigured = webpack(this._buildConfigs(idList));

    function handler(err, stats) {
      let hasErrors = false;

      if (stats && stats.compilation && stats.compilation.errors.length !== 0) {
        console.log(stats.compilation.errors);
        console.log(colors.red.underline('\n\nCompiled with errors!\n\n'));
        hasErrors = true;
      }
      if (err) {
        console.log(err);
        console.log(colors.red.underline('\n\nCompiled with errors!\n\n'));
        hasErrors = true;
      }

      if (hasErrors !== true) {
        console.log(colors.green.underline('\nCompiled successfully.'));
      }
    }

    webpackConfigured.watch(this.serviceConfigs[this.watchConfigName], handler);
  }

  runDevServer(idList, userPort) {
    let port = userPort;
    if (!Helper.isNumber(port)) port = 8080;

    const webpackConfigured = webpack(this._buildConfigs(idList));
    const devServer = new WebpackDevServer(webpackConfigured, this.serviceConfigs[this.devServerConfigName]);

    devServer.listen(port, '127.0.0.1', () => {
      console.log(`Starting server on http://localhost:${port}`);
    });
  }

  _buildConfigs(idList) {
    const prodConfigs = [];
    if (idList && idList.length > 0) {
      Object.keys(this.configs).forEach((id) => {
        if (idList.includes(id)) {
          prodConfigs.push(this.configs[id]);
        }
      });
    } else {
      this.configs.forEach((config) => {
        prodConfigs.push(config);
      });
    }
    return prodConfigs;
  }

  _isUsed(id, isService = false) {
    const confsList = !isService ? this.configs : this.serviceConfigs;
    return Object.keys(confsList).includes(id);
  }
}

export default WebpackLoader;
