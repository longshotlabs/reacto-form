// See https://babeljs.io/docs/en/config-files#root-babelconfigjs-files
module.exports = function getBabelConfig(api) {
  const isTest = api.env("test");

  // Config for when running Jest tests
  if (isTest) {
    return {
      plugins: ["@babel/plugin-proposal-class-properties"],
      presets: ["@babel/env", "@babel/preset-react"],
    };
  }

  // We set this in the `build:modules` package.json script
  const esmodules = process.env.BABEL_MODULES === "1";

  const babelEnvOptions = {
    modules: esmodules ? false : "auto",
    // https://babeljs.io/docs/en/babel-preset-env#targets
    targets: {
      // 'browsers' target is ignored when 'esmodules' is true
      esmodules,
    },
  };

  return {
    ignore: ["**/*.test.js", "__snapshots__"],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      [
        "@babel/plugin-transform-runtime",
        {
          useESModules: esmodules,
        },
      ],
    ],
    presets: [["@babel/env", babelEnvOptions], "@babel/preset-react"],
    sourceMaps: true,
  };
};
