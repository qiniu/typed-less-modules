// fork form https://github.com/dancon/less-plugin-aliases

import fs from "fs";
import path from "path";
import { Aliases } from "./file-to-class-names";

const checkExtList = [".less", ".css"];

function normalizePath(filename: string) {
  if (/\.(?:less|css)$/i.test(filename)) {
    return fs.existsSync(filename) ? filename : undefined;
  }

  for (let i = 0, len = checkExtList.length; i < len; i++) {
    const ext = checkExtList[i];
    if (fs.existsSync(`${filename}${ext}`)) {
      return `${filename}${ext}`;
    }
  }
}

export class LessAliasesPlugin {
  constructor(private aliases: Aliases) {}

  install(less: LessStatic, pluginManager: Less.PluginManager) {
    const { aliases = {} } = this;

    function resolve(filename: string) {
      // 从长到短排序可以有效避免 `a` 和 `ab` 别名冲突的问题
      const aliasNames = Object.keys(aliases).sort(
        (a, b) => b.length - a.length
      );

      // 没有设置别名 -> 输出原始文件
      if (!aliasNames.length) {
        return filename;
      }

      // 匹配别名 -> 输出匹配别名
      // 有匹配项 & 未正确解析 -> 输出错误（用于处理同时设置了 '~' & '~~' 的情况）
      let isHited = false;
      let resolvedPath: string | undefined;

      for (let i = 0; i < aliasNames.length; i++) {
        const aliasName = aliasNames[i];

        if (filename.startsWith(aliasName)) {
          isHited = true;
          const targetAliasPath = aliases[aliasName];
          const targetFileRestPath = filename.substr(aliasName.length);

          // key: (filePath) => newFilePath
          if (typeof targetAliasPath === "function") {
            resolvedPath = normalizePath(targetAliasPath(filename));
            // key: path
          } else if (typeof targetAliasPath === "string") {
            resolvedPath = normalizePath(
              path.join(targetAliasPath, targetFileRestPath)
            );
            // key: [path, path]
          } else if (Array.isArray(targetAliasPath)) {
            for (let i = 0; i < targetAliasPath.length; i++) {
              resolvedPath = normalizePath(
                path.join(targetAliasPath[i], targetFileRestPath)
              );
              if (resolvedPath) {
                return resolvedPath;
              }
            }
          }

          if (resolvedPath) {
            return resolvedPath;
          }
        }
      }

      if (isHited && !resolvedPath) {
        throw new Error(`Invalid @import: ${filename}`);
      }
    }

    function resolveFile(filename: string) {
      let resolved;
      try {
        resolved = resolve(filename);
      } catch (error) {
        console.error(error);
      }
      if (!resolved) {
        throw new Error(
          `[typed-less-modules:aliases-plugin]: '${filename}' not found.`
        );
      }
      return resolved;
    }

    class AliasePlugin extends less.FileManager {
      supports(filename: string, currentDirectory: string) {
        const aliasNames = Object.keys(aliases);

        for (let i = 0; i < aliasNames.length; i++) {
          const aliasName = aliasNames[i];
          if (
            filename.indexOf(aliasName) !== -1 ||
            currentDirectory.indexOf(aliasName) !== -1
          ) {
            return true;
          }
        }
        return false;
      }

      supportsSync(filename: string, currentDirectory: string) {
        return this.supports(filename, currentDirectory);
      }

      loadFile(
        filename: string,
        currentDirectory: string,
        options: Record<string, unknown>,
        enviroment: unknown,
        callback: Function
      ) {
        return super.loadFile(
          resolveFile(filename),
          currentDirectory,
          options,
          enviroment,
          callback
        );
      }

      loadFileSync(
        filename: string,
        currentDirectory: string,
        options: Record<string, unknown>,
        enviroment: unknown,
        callback: Function
      ) {
        return super.loadFileSync(
          resolveFile(filename),
          currentDirectory,
          options,
          enviroment,
          callback
        );
      }
    }

    pluginManager.addFileManager(new AliasePlugin());
  }
}
