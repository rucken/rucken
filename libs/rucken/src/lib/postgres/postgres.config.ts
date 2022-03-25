export interface PostgresConfig {
  postgres: {
    rootDatabaseUrl?: string;
    appDatabaseUrl?: string;
    dropAppDatabase?: boolean;
    extensions: string[];
  };
}

export const DEFAULT_POSTGRES_CONFIG: PostgresConfig = {
  postgres: {
    dropAppDatabase: false,
    extensions: ['uuid-ossp', 'pg_trgm'],
  },
};
