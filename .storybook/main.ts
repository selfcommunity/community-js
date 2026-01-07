// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const customRequire = createRequire(import.meta.url);
const path = customRequire("path");
const toPath = (filePath) => path.join(process.cwd(), filePath);
const TsconfigPathsPlugin = customRequire('tsconfig-paths-webpack-plugin');
const webpack = customRequire('webpack');

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
    getAbsolutePath("@storybook/addon-docs")
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

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    skipBabel: true,
    check: false,
  },

  "webpackFinal": async (config) => {
    // Add TypeScript and JSX support
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
					loader: customRequire.resolve('babel-loader'),
					options: {
						presets: [
							[
								customRequire.resolve('@babel/preset-env'),
								{ loose: false },
							],
							[
								customRequire.resolve('@babel/preset-react'),
								{ runtime: 'automatic' },
							],
							[
								customRequire.resolve('@babel/preset-typescript'),
								{
									onlyRemoveTypeImports: true,
									allowDeclareFields: true,
									allowNamespaces: true
								},
							],
						],
						plugins: [
							// Usa i transform moderni
							['@babel/plugin-transform-class-properties', { loose: false }],
							['@babel/plugin-transform-private-methods', { loose: false }],
							['@babel/plugin-transform-private-property-in-object', { loose: false }],
							'@babel/plugin-transform-object-rest-spread',
							'@babel/plugin-transform-nullish-coalescing-operator',
							'@babel/plugin-transform-optional-chaining',
							// Fix for TypeScript type exports in Babel scope tracker
							['@babel/plugin-transform-typescript', { allowNamespaces: true }],
						],
					},
        }
      ],
      exclude: /node_modules/
    });

    // Make sure .tsx and .ts are included in the resolve extensions
    if (config.resolve.extensions) {
      config.resolve.extensions.push('.ts', '.tsx');
    } else {
      config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];
    }

		// Add TsconfigPathsPlugin
		config.resolve.plugins = [
			...(config.resolve.plugins || []),
			new TsconfigPathsPlugin({
				extensions: config.resolve.extensions,
				configFile: path.resolve(__dirname, "../tsconfig.json"),
			}),
		];

		config.plugins = [
			...(config.plugins || []),
			new webpack.DefinePlugin({
				// 👇 se ti serve qualche env var personalizzata, mettila qui:
				'process.env': JSON.stringify(process.env)
			}),
		];

    return {
      ...config,
      "resolve": {
        ...config.resolve,
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
  }
};
export default config;

function getAbsolutePath(value: string): string {
  return dirname(customRequire.resolve(join(value, "package.json")));
}
