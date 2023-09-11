const path = require('path');
const {plugins, rules} = require('webpack-atoms');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'; // dev mode by default
  return {
    mode,
    devtool: 'source-map',
    entry: {
      utils: './src/index.ts'
    },
    output: {
      path: path.join(__dirname, './lib/umd'),
      filename: '[name].js',
      library: 'SelfCommunityUtils',
      libraryTarget: 'umd'
    },
    module: {
      rules: [{...rules.js({rootMode: 'upward'}), test: /\.(j|t)sx?$/}]
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json']
    },
    plugins: [
      plugins.define({
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      // plugins.uglify(),
      plugins.banner({
        banner: '(c) 2023 - present: Quentral Srl | https://github.com/selfcommunity/community-js/blob/master/LICENSE.md',
        entryOnly: true
      })
    ]
  };
};
