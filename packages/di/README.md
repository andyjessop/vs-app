# Crux Dependency Injection

`@crux/di` is:

- a very simple DI container for decoupled applications,
- tiny, weighing in at ~1KB minfied (~500B gzipped),
- able to lazily instantiate services,
- able to instantiate services as globals or singletons.

## Installation

```bash
npm install @crux/di --save
```

## Usage

```ts
import { createContainer } from '@crux/di';

/**
 * Create the initial services.
 */
const initialServices = {
  a: () => { ... },
  b: () => { ... },
  // service "a" is a dependency of service "c" and is lazily instantiated when "c" is requested
  c: [(a) => { ... }, 'a'],
};

/**
 * Create the DI container.
 */
const container = createContainer(initalServices);

/**
 * Get a global instance.
 */
const a1 = container.get('a');
const a2 = container.get('a');

console.log(a1 === a2); // true

/**
 * Get a singleton.
 */
const b1 = container.getSingleton('b');
const b2 = container.getSingleton('b');

console.log(b1 === b2); // false

/**
 * Add a new service.
 */
container.add('d', () => {});

/**
 * Add a new service with dependencies.
 */
container.add('e', [(a) => { /* do something with a */}, 'a']);
```

### TypeScript

Get a typed service by passing in the type when getting the service from the container:

```ts
const typedService = container.get<MyService>('a');
```
