import { Options } from "../less";
import { ExportType, QuoteType, LogLevel } from "../typescript";

export interface MainOptions extends Options {
  pattern?: string;
  config?: string;
  lessRenderOptions?: Less.Options;
  ignore: string[];
  ignoreInitial: boolean;
  exportType: ExportType;
  exportTypeName: string;
  exportTypeInterface: string;
  listDifferent: boolean;
  quoteType: QuoteType;
  watch: boolean;
  logLevel: LogLevel;
}
