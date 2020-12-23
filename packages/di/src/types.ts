export type Constructor = (...args: any[]) => any;

export type ConstructorTuple = [Constructor, ...string[]];

export type API = {
  readonly add: (
    name: string,
    constructor: Constructor | ConstructorTuple,
  ) => boolean;
  readonly get: (name: string) => any;
  readonly getSingleton: (name: string) => any;
  readonly remove: (name: string) => true | null;
};

export type Model = {
  readonly constructor: Constructor;
  readonly dependencies: readonly string[];
  instance?: any;
  name: string;
  readonly order: number;
};

export type Collection = Record<string, Model>;

export type ConstructorCollection = Record<
  string,
  Constructor | ConstructorTuple
>;
