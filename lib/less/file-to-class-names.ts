import fs from "fs";
import path from "path";
import less from "less";
import camelcase from "camelcase";
import { paramCase } from "param-case";

import { sourceToClassNames } from "./source-to-class-names";
import { LessAliasesPlugin } from "./aliases-plugin";
import { MainOptions } from "../core";

export type ClassName = string;
export type ClassNames = ClassName[];

type AliasesFunc = (filePath: string) => string;
export type Aliases = Record<string, string | string[] | AliasesFunc>;

export type NameFormat = "camel" | "kebab" | "param" | "dashes" | "none";

export interface Options {
  includePaths?: string[];
  aliases?: Aliases;
  nameFormat?: NameFormat;
}

export const NAME_FORMATS: NameFormat[] = [
  "camel",
  "kebab",
  "param",
  "dashes",
  "none"
];

export const nameFormatDefault: NameFormat = "camel";
export const configFilePathDefault: string = "tlm.config.js";

// Options 这里实际上传递的是 MainOptions
export const fileToClassNames = async (
  file: string,
  options: Options = {} as MainOptions
): Promise<ClassNames> => {
  // options
  const aliases = options.aliases || {};
  const includePaths = options.includePaths || [];
  const nameFormat = options.nameFormat || "camel";
  const lessRenderOptions = (options as MainOptions).lessRenderOptions || {};

  // less render
  const transformer = classNameTransformer(nameFormat);
  const fileContent = fs.readFileSync(file, "UTF-8");
  const result = await less.render(fileContent, {
    filename: path.resolve(file),
    paths: includePaths,
    syncImport: true,
    plugins: [new LessAliasesPlugin(aliases)],
    ...lessRenderOptions
  });

  // get classnames
  const { exportTokens } = await sourceToClassNames(result.css);
  const classNames = Object.keys(exportTokens);
  const transformedClassNames = classNames.map(transformer);
  return transformedClassNames;
};

interface Transformer {
  (className: string): string;
}

const classNameTransformer = (nameFormat: NameFormat): Transformer => {
  switch (nameFormat) {
    case "kebab":
    case "param":
      return className => paramCase(className);
    case "camel":
      return className => camelcase(className);
    case "dashes":
      return className =>
        /-/.test(className) ? camelcase(className) : className;
    case "none":
      return className => className;
  }
};
