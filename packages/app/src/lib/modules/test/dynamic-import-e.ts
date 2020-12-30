import { Module } from '../types';

export function createE(callback?: Function): Module {
  return {
    actions: {
      e: () => 'e',
    },
    destroy: () => callback?.(),
  };
}
