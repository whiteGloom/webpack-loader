<h1 id='languages'>Languages</h1>

* **[English](#what-is-it-en 'English')**
* **[Русский](#what-is-it-ru 'Русский')**

***

***

<h1 id='what-is-it-en'>What is it? [EN]</h1>

[↓ To navigation](#navigation-en '↓ To navigation-en') | **[↑ To languages](#languages '↑ To languages')**

**Webpack-loader** — the plugin for organizing work with [Webpack &#10150;](https://webpack.js.org/ 'Webpack').

**Note:** For more information check the **[Wiki &#10150;](./webpack-loader/wiki 'Wiki')**.

<h2 id='navigation-en'>Navigation</h2>

* **[What is it? [EN]](#what-is-it-en 'What is it? [EN]')**
    * _**[Wiki &#10150;](./webpack-loader/wiki 'Wiki')**_
    * **Navigation**
    * **Short instruction:**
        * **[Installation](#installation-en 'Installation')**
        * **[Import](#import-en 'Import')**
        * **[Usage](#usage-en 'Usage')**
    * **[Examples](#examples-en 'Examples')**

<h2 id='short-instruction-en'>Short instruction</h2>

<h3 id='installation-en'>Installation</h3>

To install the plugin, use command:

```
npm i -D whiteGloom/webpack-loader
```

**[↑ To navigation](#navigation-en '↑ To navigation')** 

***

<h3 id='import-en'>Import</h3>

**CommonJS:**

```
var WebpackLoader = require('webpack-loader').default;
```

**ES6+:**

```
import WebpackLoader from 'webpack-loader';
```

**[↑ To navigation](#navigation-en '↑ To navigation')** 

***

<h3 id='usage-en'>Usage</h3>

To create an instance of plugin, use commands:

```
new WebpackLoader();
```

**[↑ To navigation](#navigation-en '↑ To navigation')** 

***

<h2 id='examples-en'>Examples</h2>

```js
import WebpackLoader from 'webpack-loader';

const workspace = process.cwd();
const wl = new WebpackLoader();

wl.makeNewConfig({
  id: 'major',
  configData: {
    configs: {
      entry: `${workspace}/index.js`,
      output: {
        filename: 'production.js',
        path: `${workspace}/dist/`
      }    
    }
  }
});

wl.makeNewConfig({
  id: 'minor',
  configData: {
    configs: [
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
    ]
  }
});

wl.start({
  configs: ['major, minor'],
  serviceConfig: ['devServer']
});
```

**[↑ To navigation](#navigation-en '↑ To navigation')** 


<h2 id="end-en">End.</h2>

***

***

<h1 id='what-is-it-ru'>Шо ита? [RU]</h1>

[↓ К навигации](#navigation-ru '↓ К навигации') | **[↑ To languages](#languages '↑ To languages')** 

**Webpack-loader** — это плагин для организации работы с [Webpack &#10150;](https://webpack.js.org/ 'Webpack').

**Note:** более подробная информация находится на **[Wiki &#10150;](./webpack-loader/wiki 'Wiki')**<sup>[eng]</sup>.

<h2 id='navigation-ru'>Навигация</h2>

* **[Шо ита? [RU]](#what-is-it-ru 'Шо ита? [RU]')**
    * _**[Wiki &#10150;](./webpack-loader/wiki 'Wiki [EN]')<sup>[eng]</sup>**_
    * **Навигация**
    * **Краткая инструкция:**
        * **[Установка](#installation-ru 'Установка')**
        * **[Импорт](#import-ru 'Импорт')**
        * **[Использование](#usage-ru 'Использование')**
    * **[Примеры](#examples-ru 'Примеры')**

<h2 id='short-instruction-ru'>Краткая инструкция</h2>

<h3 id='installation-ru'>Установка</h3>

Для установки плагина используйте команду:

```
npm i -D whiteGloom/webpack-loader
```

**[↑ К навигации](#navigation-ru '↑ К навигации')**

***

<h3 id='import-ru'>Импорт</h3>

**CommonJS:**

```
var WebpackLoader = require('webpack-loader').default;
```

**ES6+:**

```
import WebpackLoader from 'webpack-loader';
```

**[↑ К навигации](#navigation-ru '↑ К навигации')**

***

<h3 id='usage-ru'>Использование</h3>

Для создания экземпляра плагина используйте:

```
new WebpackLoader();
```

**[↑ К навигации](#navigation-ru '↑ К навигации')**

***

<h2 id='examples-ru'>Примеры</h2>

```js
import WebpackLoader from 'webpack-loader';

const workspace = process.cwd();
const wl = new WebpackLoader();

wl.makeNewConfig({
  id: 'major',
  configData: {
    configs: {
      entry: `${workspace}/index.js`,
      output: {
        filename: 'production.js',
        path: `${workspace}/dist/`
      }    
    }
  }
});

wl.makeNewConfig({
  id: 'minor',
  configData: {
    configs: [
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
    ]
  }
});

wl.start({
  configs: ['major, minor'],
  serviceConfig: ['devServer']
});
```

**[↑ К навигации](#navigation-ru '↑ К навигации')**

<h2 id="end-ru">Всё.</h2>