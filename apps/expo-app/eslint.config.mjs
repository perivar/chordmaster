import { fixupPluginRules } from "@eslint/compat";
import eslintJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactNative from "eslint-plugin-react-native";
import pluginReactJSXRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import pluginReactRecommended from "eslint-plugin-react/configs/recommended.js";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
  {
    ignores: ["babel.config.js", "metro.config.js", "dist/", "node_modules"],
  },
  {
    // Base ESLint configuration for all files
    ...eslintJs.configs.recommended,
    ...pluginPrettierRecommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.react,
        ...globals.commonjs,
        ...globals.es6,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    // React-specific settings for .js, .jsx, .ts, .tsx files
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...pluginReactRecommended,
    ...pluginReactJSXRuntime,
    rules: {
      ...pluginReactRecommended.rules,
      ...pluginReactJSXRuntime.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": "off",
      "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-native/no-raw-text": [
        "off",
        {
          skip: [
            "Header",
            "Paragraph",
            "Button",
            "Dialog.Description",
            "Dialog.Title",
          ],
        },
      ],
      "react-native/no-color-literals": "off",
      "react-native/no-inline-styles": "off",
      "jsx-a11y/html-has-lang": "off",
      "jsx-a11y/heading-has-content": "off",
    },
    languageOptions: {
      ...pluginReactRecommended.languageOptions,
      ...pluginReactJSXRuntime.languageOptions,
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      ["jsx-a11y"]: pluginJsxA11y,
      "react-native": fixupPluginRules(pluginReactNative),
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
      },
    },
  },
  {
    // TypeScript-specific settings for .ts, .tsx files
    files: ["**/*.{ts,tsx}"],
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
      // Import and TypeScript-specific rules
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
  },
  {
    // ESLint configuration for the config file itself (eslint.config.mjs)
    files: ["eslint.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);
