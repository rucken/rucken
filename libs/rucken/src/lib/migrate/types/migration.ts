// import { Client } from 'pg';
// import pgp from 'pg-promise';
// import pg from 'pg-promise/typescript/pg-subset';

import CRC32 from 'crc-32';
import { basename, dirname, sep } from 'node:path';

export const CALLBACK_KEYS: (keyof Migration['callback'])[] = [
  'beforeMigrate', //	Before Migrate runs
  'beforeRepeatables', //	Before all repeatable migrations during Migrate
  'beforeEachMigrate', //	Before every single migration during Migrate
  'beforeEachMigrateStatement', //	Before every single statement of a migration during Migrate
  'afterEachMigrateStatement', //	After every single successful statement of a migration during Migrate
  'afterEachMigrateStatementError', //	After every single failed statement of a migration during Migrate
  'afterEachMigrate', //	After every single successful migration during Migrate
  'afterEachMigrateError', //	After every single failed migration during Migrate
  'afterMigrate', //	After successful Migrate runs
  'afterMigrateApplied', //	After successful Migrate runs where at least one migration has been applied
  'afterVersioned', //	After all versioned migrations during Migrate
  'afterMigrateError', //	After failed Migrate runs
];

export type MgrationFileMetadata = {
  filepath: string;
  sqlMigrationSuffix: string;
  location: string;
};

export class Migration {
  name: string;
  filechecksum: number;
  filedir: string;
  filename: string;

  script: string;
  version: number | null;

  /**
   * https://documentation.red-gate.com/fd/migrations-184127470.html
   *
   * Versioned migrations have a version, a description and a checksum.
   * The version must be unique. The description is purely informative for you to be able to remember what each migration does.
   * The checksum is there to detect accidental changes.
   * Versioned migrations are the most common type of migration. They are applied in order exactly once.
   */
  versioned: boolean;
  versionedVersion: number;
  undo: boolean;
  undoVersion: number;
  /**
   * https://documentation.red-gate.com/fd/migrations-184127470.html
   *
   * Repeatable migrations have a description and a checksum, but no version.
   * Instead of being run just once, they are (re-)applied every time their checksum changes.
   * Within a single migration run, repeatable migrations are always applied last, after all pending versioned migrations have been executed.
   * Repeatable migrations are applied in the alphanumeric order of their description.
   */
  repeatable: boolean;

  /**
   * https://documentation.red-gate.com/fd/callback-concept-184127466.html
   *
   * While migrations are sufficient for most needs, there are certain situations that require you to execute the same action over and over again.
   * This could be recompiling procedures, updating materialized views and many other types of housekeeping.
   * For this reason, Flyway offers you the possibility to hook into its lifecycle by using Callbacks.
   * In order to use these callbacks, name a script after the callback name (ie. afterMigrate.sql) and
   * drop it alongside your other scripts in your migrations folder.
   * Flyway will then invoke it when the execution event criteria listed below is met.
   */
  callback: {
    /**
     * 	Before Migrate runs
     */
    beforeMigrate?: boolean;
    /**
     * 	Before all repeatable migrations during Migrate
     */
    beforeRepeatables?: boolean;
    /**
     * 	Before every single migration during Migrate
     */
    beforeEachMigrate?: boolean;
    /**
     * 	Before every single statement of a migration during Migrate
     */
    beforeEachMigrateStatement?: boolean;
    /**
     * 	After every single successful statement of a migration during Migrate
     */
    afterEachMigrateStatement?: boolean;
    /**
     * 	After every single failed statement of a migration during Migrate
     */
    afterEachMigrateStatementError?: boolean;
    /**
     * 	After every single successful migration during Migrate
     */
    afterEachMigrate?: boolean;
    /**
     * 	After every single failed migration during Migrate
     */
    afterEachMigrateError?: boolean;
    /**
     * 	After successful Migrate runs
     */
    afterMigrate?: boolean;
    /**
     * 	After successful Migrate runs where at least one migration has been applied
     */
    afterMigrateApplied?: boolean;
    /**
     * 	After all versioned migrations during Migrate
     */
    afterVersioned?: boolean;
    /**
     * 	After failed Migrate runs
     */
    afterMigrateError?: boolean;
  };
  statements: string[];

  static fromStatements({
    statements,
    sqlMigrationSeparator,
    sqlMigrationStatementSeparator,
    sqlMigrationSuffix,
    location,
  }: {
    statements: string[];
    sqlMigrationSeparator?: string;
    sqlMigrationStatementSeparator?: string;
    sqlMigrationSuffix?: string;
    location?: string;
  }) {
    const m = new Migration(
      '',
      sqlMigrationSeparator,
      sqlMigrationStatementSeparator,
      sqlMigrationSuffix,
      location
    );
    m.statements = statements;
    return m;
  }

  constructor(
    public filepath: string,
    public sqlMigrationSeparator: string,
    public sqlMigrationStatementSeparator: string,
    public sqlMigrationSuffix?: string,
    public location?: string
  ) {}

  async fill(fileContent: string) {
    this.filedir = dirname(this.filepath);
    this.filename = basename(this.filepath);

    if (this.filename.startsWith('V')) {
      this.versioned = true;
      const parts = this.filename.split(this.sqlMigrationSeparator);
      this.versionedVersion = +parts[0].trim().substring(1);
      if (this.sqlMigrationSuffix && parts[1]) {
        this.name = parts[1].split(this.sqlMigrationSuffix)[0];
      }
    }

    if (this.filename.startsWith('U')) {
      this.undo = true;
      const parts = this.filename.split(this.sqlMigrationSeparator);
      this.undoVersion = +parts[0].trim().substring(1);
      if (this.sqlMigrationSuffix && parts[1]) {
        this.name = parts[1].split(this.sqlMigrationSuffix)[0];
      }
    }

    if (this.filename.startsWith('R')) {
      this.repeatable = true;
      const parts = this.filename.split(this.sqlMigrationSeparator);
      if (this.sqlMigrationSuffix && parts[1]) {
        this.name = parts[1].split(this.sqlMigrationSuffix)[0];
      }
    }

    const callback = CALLBACK_KEYS.find((key) => this.filename.startsWith(key));

    if (callback) {
      this.callback = { [callback]: true };

      const parts = this.filename.split(this.sqlMigrationSeparator);

      if (this.sqlMigrationSuffix && (parts[1] || parts[0])) {
        this.name = (parts[1] || parts[0]).split(this.sqlMigrationSuffix)[0];
      }
    }

    this.filechecksum = CRC32.bstr(
      this.stripBom(fileContent.split('\n').join('').toString())
    );
    this.statements = fileContent.split('\n--\n');

    this.version =
      this.versioned || this.undo
        ? this.versionedVersion || this.undoVersion
        : null;
    this.script = this.filepath.replace(this.location + sep, '');

    return this;
  }

  stripBom(string: string) {
    if (typeof string !== 'string') {
      throw new TypeError(`Expected a string, got ${typeof string}`);
    }

    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM).
    if (string.charCodeAt(0) === 0xfeff) {
      return string.slice(1);
    }

    return string;
  }
}
