# Languages
* **[Русский](#шо-ита-ru "Русский")**


------------


# Шо ита? [RU]

[↓ К навигации](#навигация "↓ К навигации") | **[↑ To languages](#languages "↑ To languages")**

**Webpack-loader** — это плагин для упрощения работы с [Webpack](https://webpack.js.org/ "Webpack").

## Навигация

* **[Шо ита? [RU]](#шо-ита-ru "Шо ита? [RU]")**
	+ **Навигация**
	+ **[Инструкция](#инструкция "Инструкция")**
		- **[Установка](#установка "Установка")**
		- **[Импорт](#импорт "Импорт")**
		- **[Использование](#использование "Использование")**
		- **[Команды](#команды "Команды")**
			* **[makeNewConfig method](#makeNewConfig-method "makeNewConfig method")**
			* **[addToConfig method](#addToConfig-method "addToConfig method")**
			* **[getConfigForEdit method](#getConfigForEdit-method "getConfigForEdit method")**
			* **[getConfig method](#getConfig-method "getConfig method")**
			* **[getConfigs method](#getConfigs-method "getConfigs method")**
			* **[removeConfig method](#removeConfig-method "removeConfig method")**
			* **[addToDevServerConfig method](#addToDevServerConfig-method "addToDevServerConfig method")**
			* **[getDevServerConfig method](#getDevServerConfig-method "getDevServerConfig method")**
			* **[getDevServerConfigForEdit method](#getDevServerConfigForEdit-method "getDevServerConfigForEdit method")**
			* **[addToWatchConfig method](#addToWatchConfig-method "addToWatchConfig method")**
			* **[getWatchConfig method](#getWatchConfig-method "getWatchConfig method")**
			* **[getWatchConfigForEdit method](#getWatchConfigForEdit-method "getWatchConfigForEdit method")**
			* **[run method](#run-method "run method")**
			* **[runWatch method](#runWatch-method "runWatch method")**
			* **[runDevServer method](#runDevServer-method "runDevServer method")**
	+ **[Всё.](#всё "Всё.")**

## Инструкция

### Установка
Для установки плагина в проект выполните команду:

```
npm i -D whiteGloom/webpack-loader
```

[↑ К навигации](#навигация "↑ К навигации")

------------


### Импорт
Для импорта используйте:

```
var webpackLoader = require("webpack-loader").default;
```
Или, если вы используете **ES6+**:
```
import webpackLoader from "webpack-loader";
```

[↑ К навигации](#навигация "↑ К навигации")

------------

### Использование
Для создания экземпляра, используйте:


```
new webpackLoader();
```

[↑ К навигации](#навигация "↑ К навигации")

------------

### Команды

#### makeNewConfig method

Создаёт новый конфиг с указанным идентификатором.

```
.makeNewConfig(id, config, mode)
```

*Arguments:*
* **id** - type: string. Идентификатор нового конфига
* **config** - type: object. Конфиг.
* **mode** - type: string. Default: "development". Мод конфига

[↑ К навигации](#навигация "↑ К навигации")

------------


#### addToConfig method

Расширяет конфиг.

```
.addToConfig(id, config)
```

*Arguments:*
* **id** - type: string. Идентификатор конфига
* **config** - type: object. Конфиг для встраивания

[↑ К навигации](#навигация "↑ К навигации")

------------


#### getConfigForEdit method

Возвращает **объект-ссылку** для прямого редактирования конфига.

```
.getConfigForEdit(id)
```

*Arguments:*
* **id** - type: string. Идентификатор конфига

*Returns:*
* **Object**

[↑ К навигации](#навигация "↑ К навигации")

------------


#### getConfig method

Возвращает копию конфига.

```
.getConfig(id)
```

*Arguments:*
* **id** - type: string. Идентификатор конфига

*Returns:*
* **Object**

[↑ К навигации](#навигация "↑ К навигации")

------------


#### getConfigs method

Возвращает копию всех конфигов.

```
.getConfigs()
```

*Returns:*
* **Object**

[↑ К навигации](#навигация "↑ К навигации")

------------


#### removeConfig method

Удаляет конфиг.

```
.removeConfig(id)
```

*Arguments:*
* **id** - type: string. Идентификатор конфига

[↑ К навигации](#навигация "↑ К навигации")

------------


#### addToDevServerConfig method

Расширяет конфиг для плагина **webpack-dev-server**.

```
.addToDevServerConfig(config)
```

*Arguments:*
* **config** - type: object. Конфиг для расширения

[↑ К навигации](#навигация "↑ К навигации")

------------


#### getDevServerConfig method

Возвращает копию конфига для плагина **webpack-dev-server**.

```
.getDevServerConfig()
```

*Returns:*
* **Object**

[↑ К навигации](#навигация "↑ К навигации")

------------


#### getDevServerConfigForEdit method

Возвращает **объект-ссылку** для прямого редактирования конфига для плагина **webpack-dev-server**.

```
.getDevServerConfigForEdit()
```

*Returns:*
* **Object**

[↑ К навигации](#навигация "↑ К навигации")

------------


#### addToWatchConfig method

Расширяет конфиг для режима **watch**.

```
.addToWatchConfig(config)
```

*Arguments:*
* **config** - type: object. Конфиг для расширения

[↑ К навигации](#навигация "↑ К навигации")

------------


#### getWatchConfig method

Возвращает копию конфига для режима **watch**.

```
.getWatchConfig()
```

*Returns:*
* **Object**

[↑ К навигации](#навигация "↑ К навигации")

------------


#### getWatchConfigForEdit method

Возвращает **объект-ссылку** для прямого редактирования конфига для режима **watch**.

```
.getWatchConfigForEdit()
```

*Returns:*
* **Object**

[↑ К навигации](#навигация "↑ К навигации")

------------


#### run method

Запускает сборку.

```
.run(callback)
```

*Arguments:*
* **callback** - type: function. Функция, которая запустится после успешной сборки проекта.

[↑ К навигации](#навигация "↑ К навигации")

------------


#### runWatch method

Запускает сборку проекта в режиме **watch**.

```
.runWatch()
```

[↑ К навигации](#навигация "↑ К навигации")

------------


#### runDevServer method

Запускает сборку, используя плагин **webpack-dev-server**.

```
.runDevServer(port)
```

*Arguments:*
* **port** - type: number. Default: 8080. Порт, используемый при создании локального сервера

[↑ К навигации](#навигация "↑ К навигации")

## Всё.

**-whiteGloom**