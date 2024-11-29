import eslintJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
  {
    ignores: ["**/node_modules/**", "build/**", "src/parser/*_peg_parser.ts"],
  },
  {
    // Base ESLint configuration for all files
    ...eslintJs.configs.recommended,
    ...pluginPrettierRecommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es6,
      },
    },
  },
  {
    // Specific settings for all kinds of javascript/typescript files
    files: ["**/*.{ts,tsx,cts,mts,js,cjs,mjs}"],
    extends: [...eslintTs.configs.recommended],
    plugins: {
      import: pluginImport,
      "unused-imports": pluginUnusedImports,
    },
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // Note: you must disable the base rule as it can report incorrect errors
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": [
        "warn",
        {
          ignoreTypeValueShadow: true,
          ignoreFunctionTypeParameterNameValueShadow: true,
        },
      ],
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-require-imports": [
        "error",
        {
          allow: ["@/assets/*", "../assets/*"],
        },
      ],
    },
  }
);
