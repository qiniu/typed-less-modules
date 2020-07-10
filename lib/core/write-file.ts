import fs from "fs";

import { alerts } from "./alerts";
import {
  getTypeDefinitionPath,
  classNamesToTypeDefinitions
} from "../typescript";
import { fileToClassNames } from "../less";
import { MainOptions } from "./types";

/**
 * Given a single file generate the proper types.
 *
 * @param file the LESS file to generate types for
 * @param options the CLI options
 */
export const writeFile = (
  file: string,
  options: MainOptions
): Promise<void> => {
  return fileToClassNames(file, options)
    .then(classNames => {
      const typeDefinition = classNamesToTypeDefinitions({
        classNames: classNames,
        ...options
      });

      if (!typeDefinition) {
        alerts.notice(`[NO GENERATED TYPES] ${file}`);
        return;
      }

      const path = getTypeDefinitionPath(file);

      fs.writeFileSync(path, typeDefinition);
      alerts.success(`[GENERATED TYPES] ${path}`);
    })
    .catch(({ message, filename, line, column }: Less.RenderError) => {
      const location = filename ? `(${filename}[${line}:${column}])` : "";
      alerts.error(`${message} ${location}`);
    });
};
