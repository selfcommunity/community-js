const path = require('path');
const {plugins, rules} = require('webpack-atoms');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'; // dev mode by default
  return {
    mode,
    devtool: 'source-map',
    entry: {
      'react-theme-default': './src/index.ts'
    },
    output: {
      path: path.join(__dirname, './lib/umd'),
      filename: '[name].js',
      library: 'SelfCommunityReactThemeDefault',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {...rules.js({rootMode: 'upward'}), test: /\.(j|t)sx?$/},
        {...rules.css(), test: /\.css?$/},
        {
          test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './community/',
                publicPath: '../community/'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json']
    },
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom'
      }
    },
    plugins: [
      plugins.define({
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      // plugins.uglify(),
      plugins.banner({
        banner: '(c) 2022 - present: Quentral Srl | https://github.com/selfcommunity/community-js/blob/master/LICENSE.md',
        entryOnly: true
      })
    ]
  };
};
