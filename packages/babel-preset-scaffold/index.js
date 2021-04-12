module.exports = function (api, options) {
  const { react = true, typescript = true } = options;
  const nodeEnv = process.env.NODE_ENV;
  const isDev = nodeEnv === 'development';
  const isProd = nodeEnv === 'production';

  /** @see https://babeljs.io/docs/en/config-files#apiassertversionrange */
  api.assertVersion('^7.0.0');

  return {
    presets: [
      /** @see https://babel.dev/docs/en/babel-preset-env */
      [require('@babel/preset-env'), { useBuiltIns: 'entry', corejs: 3 }],
      /** @see https://babel.dev/docs/en/babel-preset-react */
      react && [require('@babel/preset-react'), { development: isDev }],
      /** @see https://babel.dev/docs/en/babel-preset-typescript */
      typescript && require('@babel/preset-typescript'),
    ].filter(Boolean),

    plugins: [
      /** @see https://babel.dev/docs/en/babel-plugin-transform-runtime */
      [
        require('@babel/plugin-transform-runtime'),
        { corejs: false, helpers: true, regenerator: true, version: require('@babel/runtime/package.json').version },
      ],
      /** @see https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types */
      isProd &&
        react && [require('babel-plugin-transform-react-remove-prop-types'), { mode: 'remove', removeImport: true }],
    ].filter(Boolean),
  };
};
