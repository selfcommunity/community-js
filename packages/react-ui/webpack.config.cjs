const path = require('path');
const {plugins, rules} = require('webpack-atoms');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'; // dev mode by default
  return {
    mode,
    devtool: 'source-map',
    entry: {
      'react-ui': './src/index.ts'
    },
    output: {
      path: path.join(__dirname, './lib/umd'),
      filename: '[name].js',
      library: 'SelfCommunityReactUI',
      libraryTarget: 'umd'
    },
    module: {
      rules: [{...rules.js({rootMode: 'upward'}), test: /\.(j|t)sx?$/}, {...rules.css()}]
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json']
    },
    externals: [
			/^react/,
			/^react-dom/,
			/^react-intl/,
			/^notistack\/[\/a-zA-Z]*/,
			/^@rpldy\/[\/a-zA-Z]*/,
			/^@emotion\/[\/a-zA-Z]*/,
			/^@mui\/[\/a-zA-Z]*/,
			/^pdfjs-dist\/[\/a-zA-Z]*/,
			/^libphonenumber-js/,
			/^date-fns/,
		],
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
