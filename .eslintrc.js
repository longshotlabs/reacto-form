module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig-eslint.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ["@typescript-eslint", "jest", "simple-import-sort"],
  extends: [
    "standard-with-typescript",
    "plugin:react/recommended",
    "plugin:jest/recommended",
  ],
  globals: {
    FormData: false,
    fetch: false,
  },
  rules: {
    // note you must disable the base rule as it can report incorrect errors
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/prop-types": "off",
    "simple-import-sort/imports": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["!.storybook"],
};
