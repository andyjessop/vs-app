import path from 'path';
import { createRollupConfig } from '../../config/create-rollup-config';

const distDir = path.resolve(__dirname, './dist');

export default [
  createRollupConfig(distDir, 'utils', 'umd', 'js'),
  createRollupConfig(distDir, 'utils', 'esm', 'mjs'),
];
