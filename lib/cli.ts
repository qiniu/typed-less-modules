#!/usr/bin/env node

import yargs from "yargs";

import {
  nameFormatDefault,
  configFilePathDefault,
  Aliases,
  NAME_FORMATS
} from "./less";
import {
  exportTypeDefault,
  exportTypeInterfaceDefault,
  exportTypeNameDefault,
  quoteTypeDefault,
  logLevelDefault,
  EXPORT_TYPES,
  QUOTE_TYPES,
  LOG_LEVELS
} from "./typescript";
import { main } from "./main";

const { _: patterns, ...rest } = yargs
  .usage(
    "Generate .less.d.ts from CSS module .less files.\nUsage: $0 <glob pattern> [options]"
  )
  .example("$0 src", "All .less files at any level in the src directory")
  .example(
    "$0 src/**/*.less",
    "All .less files at any level in the src directory"
  )
  .example(
    "$0 src/**/*.less --watch",
    "Watch all .less files at any level in the src directory that are added or changed"
  )
  .example(
    "$0 src/**/*.less --includePaths src/core src/variables",
    'Search the "core" and "variables" directory when resolving imports'
  )
  .example(
    "$0 src/**/*.less --aliases.~name variables",
    'Replace all imports for "~name" with "variables"'
  )
  .example(
    "$0 src/**/*.less --aliases.~ ./node_modules/",
    'Replace all imports for "~" with "./node_modules/"'
  )
  .example(
    "$0 src/**/*.less --ignore **/secret.less",
    'Ignore any file names "secret.less"'
  )
  .example(
    "$0 src/**/*.less -e default --quoteType double",
    "Use double quotes around class name definitions rather than single quotes."
  )
  .example("$0 src/**/*.less --logLevel error", "Output only errors")

  .option("config", {
    string: true,
    alias: "c",
    default: configFilePathDefault,
    describe: `Specify the configuration file. default: ${configFilePathDefault}.`
  })
  .option("aliases", {
    coerce: (obj): Aliases => obj,
    alias: "a",
    describe: "Alias any import to any other value."
  })
  .option("nameFormat", {
    choices: NAME_FORMATS,
    default: nameFormatDefault,
    alias: "n",
    describe: "The name format that should be used to transform class names."
  })
  .option("exportType", {
    choices: EXPORT_TYPES,
    default: exportTypeDefault,
    alias: "e",
    describe: "The type of export used for defining the type definitions."
  })
  .option("exportTypeName", {
    string: true,
    default: exportTypeNameDefault,
    describe:
      'Set a custom type name for styles when --exportType is "default."'
  })
  .option("exportTypeInterface", {
    string: true,
    default: exportTypeInterfaceDefault,
    describe:
      'Set a custom interface name for styles when --exportType is "default."'
  })
  .option("watch", {
    boolean: true,
    default: false,
    alias: "w",
    describe:
      "Watch for added or changed files and (re-)generate the type definitions."
  })
  .option("ignoreInitial", {
    boolean: true,
    default: false,
    describe: "Skips the initial build when passing the watch flag."
  })
  .option("listDifferent", {
    boolean: true,
    default: false,
    alias: "l",
    describe:
      "List any type definitions that are different than those that would be generated."
  })
  .option("includePaths", {
    array: true,
    string: true,
    alias: "i",
    describe: "Additional paths to include when trying to resolve imports."
  })
  .option("ignore", {
    string: true,
    array: true,
    default: [],
    describe: "Add a pattern or an array of glob patterns to exclude matches."
  })
  .options("quoteType", {
    string: true,
    choices: QUOTE_TYPES,
    default: quoteTypeDefault,
    alias: "q",
    describe:
      "Specify the quote type so that generated files adhere to your TypeScript rules."
  })
  .option("logLevel", {
    string: true,
    choices: LOG_LEVELS,
    default: logLevelDefault,
    alias: "L",
    describe: "Verbosity level of console output"
  }).argv;

main(patterns[0], { ...rest });
