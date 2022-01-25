export interface GettextConfig {
  gettext: {
    locales: string[];
    defaultLocale: string;
    markers: string[];
    gettextExtractorOptions: {
      pattern: string;
    };
    po2jsonOptions: Record<string, unknown>;
  };
}

export const DEFAULT_GETTEXT_CONFIG: GettextConfig = {
  gettext: {
    locales: ['en'],
    defaultLocale: 'en',
    markers: ['getText', 'dictionary'],
    gettextExtractorOptions: {
      pattern: '**/*.@(ts|js|tsx|jsx)',
    },
    po2jsonOptions: { format: 'mf' },
  },
};
