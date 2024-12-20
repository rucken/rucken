export interface Extracti18nConfig {
  extracti18n: {
    locales: string[];
    markers: string[];
    resetUnusedTranslates: string;
    serverProjectNameParts: string[];
    clientProjectNameParts: string[];
    e2eProjectNameParts: string[];
  };
}

export const DEFAULT_EXTRACT_I18N_CONFIG: Extracti18nConfig = {
  extracti18n: {
    locales: ['en'],
    markers: ['getText', 'dictionary'],
    resetUnusedTranslates: 'true',
    clientProjectNameParts: ['client'],
    e2eProjectNameParts: ['e2e'],
    serverProjectNameParts: ['server', '-ms'],
  },
};
