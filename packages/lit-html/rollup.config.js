import path from 'path';
import { createRollupConfig } from '../../config/create-rollup-config';

const distDir = path.resolve(__dirname, './dist');

export default [
  createRollupConfig(distDir, 'lit-html', 'umd', 'js'),
  createRollupConfig(distDir, 'lit-html', 'esm', 'mjs'),
];
