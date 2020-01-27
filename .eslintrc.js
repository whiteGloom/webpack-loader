module.exports = {
  'parser': 'babel-eslint',
  'extends': 'airbnb',
  'env': {
    'browser': true,
    'node': true
  },
  'rules': {
  	'no-underscore-dangle': 'off',
    'no-console': 'off',
    'max-len': ['error', { 'code': 120 }],
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'object-curly-newline': 'off'
  }
};