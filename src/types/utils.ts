export type MayBe<T> = T | null | undefined;

export type RequiredMayBe<T> = {
  [P in keyof T]-?: T[P] extends MayBe<infer U> ? U : T[P];
};

export type PartialMayBe<T> = {
  [P in keyof T]?: T[P] extends MayBe<infer U> ? U : T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type NonNullableProperties<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type ReadonlyProperties<T> = {
  readonly [P in keyof T]: T[P];
};

export type PickProperties<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type OmitProperties<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

export type Dictionary<T> = {
  [key: string]: T;
};

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
