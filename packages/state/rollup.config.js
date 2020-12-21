import path from 'path';
import { createRollupConfig } from '../../config/create-rollup-config';

const distDir = path.resolve(__dirname, './dist');

export default [
  createRollupConfig(distDir, 'state', 'umd', 'js'),
  createRollupConfig(distDir, 'state', 'esm', 'mjs'),
];
