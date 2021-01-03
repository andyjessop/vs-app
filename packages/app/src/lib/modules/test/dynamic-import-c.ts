import { Module } from '../types';

export function createC(): Module {
  return {
    actions: {
      c: () => 'c',
    },
  };
}
