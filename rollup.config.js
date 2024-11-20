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
import copy from 'rollup-plugin-copy';

export default [
  {
    ...getBaseConfig(),
    plugins: [
      url(),
      postcss({
        extract: true,
        minimize: true,
        plugins: [autoprefixer()],
      }),
      copy({
        targets: [
          {
            src: [
              'src/assets/fonts/iconfont.ttf',
              'src/assets/fonts/iconfont.woff',
              'src/assets/fonts/iconfont.woff2',
            ],
            dest: ['dist/cjs/assets/fonts', 'dist/esm/assets/fonts'],
          },
        ],
      }),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript(),
      babel({
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
      }),
      terser(),
    ],
    external: [
      '@tencentcloud/uikit-base-component-react',
      'react',
      'date-fns',
      'tslib',
      'react-date-picker',
      'i18next',
      'react-i18next',
      '@tencentcloud/tui-core',
      '@tencentcloud/chat',
      '@tencentcloud/chat-uikit-engine',
      '@tencentcloud/universal-api',
      '@tencentcloud/call-uikit-react',
      'classnames',
    ],
  },
  {
    ...getBaseConfig(),
    plugins: [
      postcss({
        extract: true,
        plugins: [],
      }),
      dts(),
    ],
  },
];

function getBaseConfig() {
  return {
    input: ['./src/index.ts'],
    output: [
      {
        preserveModules: true,
        preserveModulesRoot: './src',
        dir: './dist/esm/',
        format: 'esm',
      },
      {
        preserveModules: true,
        preserveModulesRoot: './src',
        dir: './dist/cjs/',
        format: 'cjs',
        exports: 'auto',
      },
    ],
  };
}
