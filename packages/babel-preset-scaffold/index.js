module.exports = function (api, options) {
  const { react = true, typescript = true } = options;

  api.assertVersion("^7.0.0");

  return {
    presets: [
      /** @see https://babel.dev/docs/en/babel-preset-env */
      [require("@babel/preset-env"), { useBuiltIns: "entry", corejs: 3 }],
      /** @see https://babel.dev/docs/en/babel-preset-react */
      react && require("@babel/preset-react"),
      /** @see https://babel.dev/docs/en/babel-preset-typescript */
      typescript && require("@babel/preset-typescript"),
    ].filter(Boolean),
    plugins: [
      /** @see https://babel.dev/docs/en/babel-plugin-transform-runtime */
      [
        require("@babel/plugin-transform-runtime"),
        { version: require("@babel/runtime/package.json").version },
      ],
    ],
  };
};
