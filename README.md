# Languages
* **[Русский](#шо-ита-ru 'Русский')**

------------

# Шо ита? [RU]

[↓ К навигации](#навигация '↓ К навигации') | **[↑ To languages](#languages '↑ To languages')**

**Webpack-loader** — это плагин для организации работы с [Webpack](https://webpack.js.org/ 'Webpack').

## Навигация

* **[Шо ита? [RU]](#шо-ита-ru 'Шо ита? [RU]')**
    * **Навигация**
    * **[Wiki](https://github.com/whiteGloom/webpack-loader/wiki 'Wiki')**
    * **[Краткая инструкция](#краткая-инструкция 'Краткая инструкция')**
        * **[Установка](#установка 'Установка')**
        * **[Импорт](#импорт 'Импорт')**
        * **[Использование](#использование 'Использование')**
    * **[Примеры](#примеры 'Примеры')**
    * **[Всё.](#всё 'Всё.')**

## Краткая инструкция

### Установка

Для установки плагина используйте команду:

```
npm i -D whiteGloom/webpack-loader
```

[↑ К навигации](#навигация '↑ К навигации')

------------

### Импорт

**CommonJS:**

```
var WebpackLoader = require('webpack-loader').default;
```

**ES6+:**

```
import WebpackLoader from 'webpack-loader';
```

[↑ К навигации](#навигация '↑ К навигации')

------------

### Использование

Для создания экземпляра плагина используйте:

```
new WebpackLoader();
```

[↑ К навигации](#навигация '↑ К навигации')

------------

### Примеры

```js
const workspace = process.cwd();
const wl = new WebpackLoader();

wl.makeNewConfig('major', {
  entry: `${workspace}/index.js`,
  output: {
    filename: 'production.js',
    path: `${workspace}/dist/`
  }
});

wl.makeNewConfig('minor', [
  {
    entry: `${workspace}/index.js`,
    output: {
      filename: 'test.js',
      path: `${workspace}/tests/` 
    } 
  },
  {
    entry: `${workspace}/test.js`
  }
]);

wl.start(['major, minor'], ['devServer'])
```

[↑ К навигации](#навигация '↑ К навигации')

------------

## Всё.

**-whiteGloom**