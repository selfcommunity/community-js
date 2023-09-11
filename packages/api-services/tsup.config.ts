import {Options, defineConfig} from 'tsup';

export const baseConfig: Options = {
  splitting: false,
  sourcemap: false, // source map is only available in prod
  clean: true, // rimraf /lib
  dts: false, // generate dts file for main module
  minify: true,
  bundle: true,
  skipNodeModulesBundle: true,
  watch: false,
  entry: ['src/index.ts', 'src/client/*.*', 'src/constants/*.*', 'src/services/**/*.*', 'src/utils/**/*.*'],
  tsconfig: './tsconfig-esm.build.json',
  shims: false
};

export default defineConfig([
  {
    ...baseConfig,
    outDir: 'lib/cjs',
    format: ['cjs']
  },
  {
    ...baseConfig,
    outDir: 'lib/esm',
    format: ['esm'],
    target: 'es2020'
  }
]);
