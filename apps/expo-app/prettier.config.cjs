/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: "avoid",
  bracketSpacing: true,
  bracketSameLine: true,
  singleQuote: false,
  trailingComma: "es5",
  tabWidth: 2,
  endOfLine: "auto",
  semi: true,

  importOrder: [
    "^react(-native)?$", // React and react-native stuff goes at the top
    "", // use empty strings to separate groups with empty lines
    "<THIRD_PARTY_MODULES>", // Third party modules (this is a plugin keyword)
    "",
    "^../lib/(.*)$",
    "^../hooks/(.*)$",
    "^../components/(.*)$",
    "^../utils/(.*)$",
    "",
    "^../types$",
    "^../types/(.*)$",
    "^../constants/(.*)$",
    "^../config/(.*)$",

    "^../(.*)$", // Local imports in parent directories
    "^./(.*)$", // Local imports in current directory
  ],
  // these only works with https://github.com/trivago/prettier-plugin-sort-imports
  // importOrderSeparation: false,
  // importOrderSortSpecifiers: true,
  // importOrderBuiltinModulesToTop: true,
  // importOrderMergeDuplicateImports: true,
  // importOrderCombineTypeAndValueImports: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
