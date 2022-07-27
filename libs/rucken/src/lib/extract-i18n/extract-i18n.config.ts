export interface Extracti18nConfig {
  extracti18n: {
    locales: string[];
    markers: string[];
    resetUnusedTranslates: string;
  };
}

export const DEFAULT_EXTRACT_I18N_CONFIG: Extracti18nConfig = {
  extracti18n: {
    locales: ['en'],
    markers: ['getText', 'dictionary'],
    resetUnusedTranslates: 'true',
  },
};
