import { Container } from '@crux/di';
import { Module } from '../types';

export function createC(container: Container.API): Module {
  return {
    actions: {
      c: () => 'c',
    },
  };
}
