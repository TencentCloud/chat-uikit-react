import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import url from '@rollup/plugin-url';

const baseConfig = {
  input: [
    './src/index.ts',
  ],
  output: [
    {
      preserveModules: true,
      preserveModulesRoot: './src',
      dir: './dist/esm/',
      format: 'esm',
      // sourcemap: true,
    },
    {
      preserveModules: true,
      preserveModulesRoot: './src',
      dir: './dist/cjs/',
      format: 'cjs',
      // sourcemap: true,
    },
  ],
};
export default [
  {
    ...baseConfig,
    plugins: [
      url(),
      postcss({
        extract: true,
        minimize: true,
        plugins: [
          autoprefixer(),
        ],
      }),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      babel({
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      }),
      typescript(),
      terser(),
    ],
    external: ['react', 'date-fns', 'tslib'],
  },
  {
    ...baseConfig,
    plugins: [
      postcss({
        extract: true,
        plugins: [],
      }),
      dts(),
    ],
  },
];
