// eslint-disable-next-line @typescript-eslint/ban-types
type QueryKeyFactory = <T extends Record<string, unknown> = {}>(
  key: string,
  factory?: (createKey: KeyFactory) => T
) => FactoryResult<T>;

type KeyFactory = <U extends unknown[]>(...deps: U) => readonly [string, ...U];

type FactoryResult<T extends Record<string, unknown>> = T & {
  default: readonly [string];
};

export const createQueryKeys: QueryKeyFactory = (key, factory) => {
  const createKey: KeyFactory = (...deps) => [key, ...deps] as const;

  return {
    default: [key] as const,
    ...(typeof factory !== 'undefined'
      ? factory(createKey)
      : ({} as ReturnType<NonNullable<typeof factory>>))
  };
};
