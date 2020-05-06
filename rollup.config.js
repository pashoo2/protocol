import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import packageJson from './package.json';

export default {
  input: 'src/build.ts',
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      dir: 'build',
    },
  ],
  plugins: [
    resolve(),
    json({
      namedExports: false,
    }),
    commonjs({
      transformMixedEsModules: true,
      extensions: ['.js', '.ts'],
      exclude: [
        'node_modules/symbol-observable/es/*.js',
        'node_modules/@firebase/database/dist/*',
      ],
      namedExports: { 'orbit-db-identity-provider': ['IdentityProvider'] },
    }),
    typescript({
      exclude: '**/*.tsx',
    }),
    peerDepsExternal(),
  ],
};
