export type Constructor = (...args: any[]) => any;

export type ConstructorTuple = [Constructor, ...string[]];

export type ConstructorCollection = Record<
  string,
  Constructor | ConstructorTuple
>;

export type ConstructorCollectionTuple = [
  string,
  Constructor | ConstructorTuple,
];

export type Model = {
  readonly constructor: Constructor;
  readonly dependencies: readonly string[];
  instance?: any;
  name: string;
  readonly order: number;
};

export type Collection = Record<string, Model>;

export type API = {
  readonly add: (
    name: string,
    constructor: Constructor | ConstructorTuple,
  ) => boolean;
  destroy(name: string): boolean;
  get<T = any>(name: string): T | undefined;
  getSingleton<T = any>(name: string): T | undefined;
  readonly remove: (name: string) => true | null;
  readonly services: Collection;
};
