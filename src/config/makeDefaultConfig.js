function makeDefaultConfig(mode) {
	return {
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
};

export default makeDefaultConfig;