import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default {
  preserveModules: false, // TODO build emits in the ./build/src directory, but must be in the root of ./build
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      dir: 'build',
    },
  ],
  plugins: [
    builtins(),
    resolve({
      preferBuiltins: false,
    }),
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
      tsconfig: 'tsconfig-rollup.json',
    }),
    peerDepsExternal(),
  ],
};
