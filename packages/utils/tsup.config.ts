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
  entry: ['src/index.ts'],
  shims: false
};

export default defineConfig([
  {
    ...baseConfig,
    outDir: 'lib/tsup/cjs',
    format: ['cjs'],
    tsconfig: './tsconfig-cjs.build.json'
  },
  {
    ...baseConfig,
    outDir: 'lib/tsup/esm',
    format: ['esm'],
    target: 'es2020',
    tsconfig: './tsconfig-esm.build.json'
  }
]);
