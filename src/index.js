import webpack from "Webpack";
import merge from "webpack-merge";
import webpackDevServer from "webpack-dev-server";
import colors from "colors";

import makeDefaultConfig from "./config/defaultConfig.js";

class WebpackLoader {
	constructor(options) {
		options = typeof options === "object" ? options : {};

		this.configs = {};
		this.devServerConfig = {};
		this.watchConfig = {};
	}

	makeNewConfig(id, config, mode) {
		if (typeof id !== "number" && typeof id !== "string") { console.log("Wrong identificator: " + id); return; }
		if (typeof config !== "object") { console.log("Wrong config: " + config); return; }
		if (typeof mode !== "string") { mode = "development" }
		
		this.configs[id] = merge([
			makeDefaultConfig(mode),
			config
		]);
	}

	addToConfig(id, config) {
		if (typeof id !== "number" && typeof id !== "string") { console.log("Wrong identificator: " + id); return; }
		if (typeof config !== "object") { console.log("Wrong config: " + config); return; }

		this.configs[id] = merge([
			this.configs[id],
			config
		]);
	}

	removeFromConfig(id, config) {
		if (typeof id !== "number" && typeof id !== "string") { console.log("Wrong identificator: " + id); return; }
		if (typeof config !== "object") { console.log("Wrong config: " + config); return; }

		delete this.configs[id][config];
	}

	getConfigForEdit(id) {
		if (typeof id !== "number" && typeof id !== "string") { console.log("Wrong identificator: " + id); return; }

		return this.configs[id];
	}

	getConfig(id) {
		if (typeof id !== "number" && typeof id !== "string") { console.log("Wrong identificator: " + id); return; }

		return Object.assign({}, this.configs[id]);
	}

	getConfigs() {
		return Object.assign({}, this.configs);
	}

	removeConfig(id) {
		if (typeof id !== "number" && typeof id !== "string") { console.log("Wrong identificator: " + id); return; }

		delete this.configs[id];
	}

	addToDevServerConfig(config) {
		if (typeof config !== "object") { console.log("Wrong config: " + config); return; }

		this.devServerConfig = merge([
			this.devServerConfig,
			config
		]);
	}

	removeFromDevServerConfig(config) {
		if (typeof config !== "object") { console.log("Wrong config: " + config); return; }

		delete this.devServerConfig[config];
	}

	getDevServerConfig() {
		return Object.assign({}, this.devServerConfig);
	}

	getDevServerConfigForEdit() {
		return this.devServerConfig;
	}

	addToWatchConfig(config) {
		if (typeof config !== "object") { console.log("Wrong config: " + config); return; }

		this.watchConfig = merge([
			this.watchConfig,
			config
		]);
	}

	removeFromWatchConfig(config) {
		if (typeof config !== "object") { console.log("Wrong config: " + config); return; }

		delete this.watchConfig[config];
	}

	getWatchConfig() {
		return Object.assign({}, this.watchConfig);
	}

	getWatchConfigForEdit() {
		return this.watchConfig;
	}

	_buildConfigs() {
		var prodConfigs = [];
		for(var config in this.configs) {
			prodConfigs.push(this.configs[config]);
		}
		return prodConfigs;
	}

	run(callback) {
		var webpackConfigured = webpack(this._buildConfigs());

		webpackConfigured.run(handler);

		function handler(err, stats) {
			var hasErrors = false;

			if (stats && stats.compilation && stats.compilation.errors.length !== 0) {
				console.log(stats.compilation.errors);
				console.log(colors.red.underline("\n\nCompiled with errors!\n\n"));
				hasErrors = true;
			}
			if (err) {
				console.log(err)
				console.log(colors.red.underline("\n\nCompiled with errors!\n\n"));
				hasErrors = true;
			}

			if (hasErrors !== true) {
				console.log(colors.green.underline("\n\nCompiled successfully.\n\n"));
				if (typeof callback === "function") callback(stats);
			}
		}
	}

	runWatch() {
		var webpackConfigured = webpack(this._buildConfigs());

		webpackConfigured.watch(this.watchConfig, handler);

		function handler(err, stats) {
			var hasErrors = false;

			if (stats && stats.compilation && stats.compilation.errors.length !== 0) {
				console.log(stats.compilation.errors);
				console.log(colors.red.underline("\n\nCompiled with errors!\n\n"));
				hasErrors = true;
			}
			if (err) {
				console.log(err)
				console.log(colors.red.underline("\n\nCompiled with errors!\n\n"));
				hasErrors = true;
			}

			if (hasErrors !== true) {
				console.log(colors.green.underline("\nCompiled successfully."));
				if (typeof callback == "function") callback(stats);
			}
		}
	}

	runDevServer(port) {
		if (typeof port !== "number") port = 8080;

		var webpackConfigured = webpack(this._buildConfigs());
		var devServer = new webpackDevServer(webpackConfigured, this.devServerConfig);

		devServer.listen(port, "127.0.0.1", () => {
			console.log("Starting server on http://localhost:" + port);
		});
	}
}

export default WebpackLoader;