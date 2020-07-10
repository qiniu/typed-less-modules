# 🎁 typed-less-modules

[![GitHub stars](https://img.shields.io/github/stars/qiniu/typed-less-modules.svg?style=for-the-badge)](https://github.com/qiniu/typed-less-modules/stargazers)

[![npm](https://img.shields.io/npm/v/@qiniu/typed-less-modules?color=%23c7343a&label=npm&style=for-the-badge)](https://www.npmjs.com/package/@qiniu/typed-less-modules)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](https://github.com/qiniu/typed-less-modules/blob/master/LICENSE)

[![Build Status](https://travis-ci.com/qiniu/typed-less-modules.svg?branch=master)](https://travis-ci.com/qiniu/typed-less-modules)
[![npm version](https://img.shields.io/npm/v/typed-less-modules.svg?style=flat)](https://www.npmjs.com/package/typed-less-modules)

Generate TypeScript definitions (`.d.ts`) files for CSS Modules that are written in LESS (`.less`).

**typed-less-modules** 用于将 `.less` 转换为对应的 `.d.ts` TypeScript 类型声明文件。

![Example](/docs/typed-less-modules-example.gif)

For example, given the following LESS:

```less
@import "variables";

.text {
  color: @blue;

  &-highlighted {
    color: @yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

## Basic Usage

Run with npm package runner:

```bash
npx tlm src
```

Or, install globally:

```bash
yarn global add typed-less-modules
tlm src
```

Or, install and run as a `devDependency`:

```bash
yarn add -D typed-less-modules
yarn tlm src
```

## Advanced Usage

For all possible commands, run `tlm --help`.

The only required argument is the directory where all LESS files are located (`config.pattern`). Running `tlm src` will search for all files matching `src/**/*.less`. This can be overridden by providing a [glob](https://github.com/isaacs/node-glob#glob-primer) pattern instead of a directory. For example, `tlm src/*.less`

### `--watch` (`-w`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --watch`

Watch for files that get added or are changed and generate the corresponding type definitions.

### `--ignoreInitial`

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --watch --ignoreInitial`

Skips the initial build when passing the watch flag. Use this when running concurrently with another watch, but the initial build should happen first. You would run without watch first, then start off the concurrent runs after.

### `--ignore`

- **Type**: `string[]`
- **Default**: `[]`
- **Example**: `tlm src --watch --ignore "**/secret.less"`

A pattern or an array of glob patterns to exclude files that match and avoid generating type definitions.

### `--includePaths` (`-i`)

- **Type**: `string[]`
- **Default**: `[]`
- **Example**: `tlm src --includePaths src/core`

An array of paths to look in to attempt to resolve your `@import` declarations. This example will search the `src/core` directory when resolving imports.

### `--aliases` (`-a`)

- **Type**: `object`
- **Default**: `{}`
- **Example**: `tlm src --aliases.~some-alias src/core/variables`

An object of aliases to map to their corresponding paths. This example will replace any `@import '~alias'` with `@import 'src/core/variables'`.

### `--nameFormat` (`-n`)

- **Type**: `"camel" | "kebab" | "param" | "dashes" | "none"`
- **Default**: `"camel"`
- **Example**: `tlm src --nameFormat camel`

The class naming format to use when converting the classes to type definitions.

- **camel**: convert all class names to camel-case, e.g. `App-Logo` => `appLogo`.
- **kebab**/**param**: convert all class names to kebab/param case, e.g. `App-Logo` => `app-logo` (all lower case with '-' separators).
- **dashes**: only convert class names containing dashes to camel-case, leave others alone, e.g. `App` => `App`, `App-Logo` => `appLogo`. Matches the webpack [css-loader camelCase 'dashesOnly'](https://github.com/webpack-contrib/css-loader#camelcase) option.
- **none**: do not modify the given class names (you should use `--exportType default` when using `--nameFormat none` as any classes with a `-` in them are invalid as normal variable names).
  Note: If you are using create-react-app v2.x and have NOT ejected, `--nameFormat none --exportType default` matches the class names that are generated in CRA's webpack's config.

### `--listDifferent` (`-l`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `tlm src --listDifferent`

List any type definition files that are different than those that would be generated. If any are different, exit with a status code `1`.

### `--exportType` (`-e`)

- **Type**: `"named" | "default"`
- **Default**: `"named"`
- **Example**: `tlm src --exportType default`

The export type to use when generating type definitions.

#### `named`

Given the following LESS:

```less
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

#### `default`

Given the following LESS:

```less
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export type Styles = {
  text: string;
  textHighlighted: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
```

This export type is useful when using kebab (param) cased class names since variables with a `-` are not valid variables and will produce invalid types or when a class name is a TypeScript keyword (eg: `while` or `delete`). Additionally, the `Styles` and `ClassNames` types are exported which can be useful for properly typing variables, functions, etc. when working with dynamic class names.

### `--exportTypeName`

- **Type**: `string`
- **Default**: `"ClassNames"`
- **Example**: `tlm src --exportType default --exportTypeName ClassesType`

Customize the type name exported in the generated file when `--exportType` is set to `"default"`.
Only default exports are affected by this command. This example will change the export type line to:

```typescript
export type ClassesType = keyof Styles;
```

### `--exportTypeInterface`

- **Type**: `string`
- **Default**: `"Styles"`
- **Example**: `tlm src --exportType default --exportTypeInterface IStyles`

Customize the interface name exported in the generated file when `--exportType` is set to `"default"`.
Only default exports are affected by this command. This example will change the export interface line to:

```typescript
export type IStyles = {
  // ...
};
```

### `--quoteType` (`-q`)

- **Type**: `"single" | "double"`
- **Default**: `"single"`
- **Example**: `tlm src --exportType default --quoteType double`

Specify a quote type to match your TypeScript configuration. Only default exports are affected by this command. This example will wrap class names with double quotes (").

### `--logLevel` (`-l`)

- **Type**: `"verbose" | "error" | "info" | "silent"`
- **Default**: `"verbose"`
- **Example**: `tlm src --logLevel error`

Sets verbosity level of console output.

### `--config` (`-c`)

- **Type**: `string`
- **Default**: `tlm.config.js`
- **Example**: `tlm --config ./path/to/tlm.config.js`

指定配置文件的路径，配置文件可代替所有的命令行参数，默认读取 `process.cwd() + tlm.config.js` 文件。

```js
// tlm.config.js
const path = require("path");

module.exports = {
  pattern: "./src/**/*.m.less",
  watch: true,
  aliases: {
    "~": [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "src")
    ]
  },
  lessRenderOptions: {
    javascriptEnabled: true
  }
  // ...
};
```

#### `verbose`

Print all messages

#### `error`

Print only errors

#### `info`

Print only some messages

#### `silent`

Print nothing

## Examples

For examples, see the `examples` directory:

- [Basic Example](/examples/basic)
- [Default Export Example](/examples/default-export)

## Alternatives

This package was forked from [typed-scss-modules](https://github.com/skovy/typed-scss-modules).

This package is currently used as a CLI. There are also [packages that generate types as a webpack loader](https://github.com/Jimdo/typings-for-css-modules-loader).
