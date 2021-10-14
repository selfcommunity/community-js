const path = require('path')
const { plugins, rules } = require('webpack-atoms')

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'; // dev mode by default
  return {
    mode,
    devtool: 'eval-source-map',
    entry: {
      'core': './src/index.js',
    },
    output: {
      path: path.join(__dirname, './lib/umd'),
      filename: '[name].js',
      library: 'SelfCommunityCore',
      libraryTarget: 'umd',
    },
    module: {
      rules: [{ ...rules.js({ rootMode: 'upward' }), test: /\.(j|t)sx?$/ }],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
    },
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
      },
    },
    plugins: [
      plugins.define({
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      // plugins.uglify(),
      plugins.banner({
        banner:
          '(c) 2021 - present: Quentral Srl | https://github.com/selfcommunity/selfcommunity-ui-widgets/blob/master/LICENSE.md',
        entryOnly: true,
      }),
    ],
  }
};
