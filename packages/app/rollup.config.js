import path from 'path';
import { createRollupConfig } from '../../config/create-rollup-config';

const distDir = path.resolve(__dirname, './dist');

export default [
  createRollupConfig(distDir, 'app', 'umd', 'js'),
  createRollupConfig(distDir, 'app', 'esm', 'mjs'),
];
