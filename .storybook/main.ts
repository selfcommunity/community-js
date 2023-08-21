import { dirname, join } from "path";
const path = require("path");
const toPath = (filePath) => path.join(process.cwd(), filePath);
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  staticDirs: [
    '../public',
    '../packages/react-theme-default/src'
  ],
  stories: [
    '../stories/**/*.@(mdx|js|jsx|ts|tsx)',
    "../packages/react-ui/src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/react-ui/src/shared/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/react-templates/src/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {
      "lazyCompilation": true,
      "fsCache": true
    },
  },
  features: {
    "postcss": false
  },
  core: {
    disableTelemetry: true, // Disables telemetry
  },
  "webpackFinal": async (config) => {
    return {
      ...config,
      "resolve": {
        ...config.resolve,
        "plugins": [
          ...(config.resolve.plugins || []),
          new TsconfigPathsPlugin({
            extensions: config.resolve.extensions,
            configFile: path.resolve(__dirname, "../tsconfig.json"),
          }),
        ],
        "alias": {
          ...config.resolve.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "@emotion/styled": toPath("node_modules/@emotion/styled"),
          "emotion-theming": toPath("node_modules/@emotion/react"),
          "@selfcommunity/types": toPath("packages/types/src"), // development
          "@selfcommunity/utils": toPath("packages/utils/src"), // development
          "@selfcommunity/api-services": toPath("packages/api-services/src"), // development
          "@selfcommunity/react-i18n": toPath("packages/react-i18n/src"), // development
          "@selfcommunity/react-core": toPath("packages/react-core/src"), // development
          "@selfcommunity/react-ui": toPath("packages/react-ui/src"), // development
          "@selfcommunity/react-templates": toPath("packages/react-templates/src") // development
        },
      },
    };
  },
  docs: {
    autodocs: 'tags',
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
