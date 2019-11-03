function makeDefaultConfig(mode) {
	var config = {
		mode: mode,
		entry: {
		},
		output: {
		},
		module: {
			rules: []
		},
		plugins: [
		],
		optimization: {
		},
		resolve : {
		}
	};

	return config;
};

export default makeDefaultConfig;