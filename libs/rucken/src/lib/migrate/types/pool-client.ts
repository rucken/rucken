export type PoolClient = {
  release: (result?: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: (sql: string) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end: () => any;
};
