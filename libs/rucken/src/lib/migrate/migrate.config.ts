export const FLYWAY_HISTORY_TABLE = '__migrations';
export const FLYWAY_HISTORY_SCHEMA = 'public';

export interface MigrateConfig {
  migrate: {
    locations?: string[];
    historyTable?: string;
    historySchema?: string;
    sqlMigrationSuffixes?: string[];
    sqlMigrationSeparator?: string;
    sqlMigrationStatementSeparator?: string;
  };
}

export const DEFAULT_MIGRATE_CONFIG: MigrateConfig = {
  migrate: {
    locations: ['migrations'],
    historyTable: FLYWAY_HISTORY_TABLE,
    historySchema: FLYWAY_HISTORY_SCHEMA,
    sqlMigrationSuffixes: ['.sql'],
    sqlMigrationSeparator: '__',
    sqlMigrationStatementSeparator: '--',
  },
};
