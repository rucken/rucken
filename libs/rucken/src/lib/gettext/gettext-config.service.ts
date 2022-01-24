import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';

export interface GettextConfig {
  gettext: {
    markers: string[];
    gettextExtractorOptions: {
      pattern: string;
    };
    po2jsonOptions: Record<string, unknown>;
  };
}

export const DEFAULT_GETTEXT_CONFIG: GettextConfig = {
  gettext: {
    markers: ['getText', 'dictionary'],
    gettextExtractorOptions: {
      pattern: '**/*.@(ts|js|tsx|jsx)',
    },
    po2jsonOptions: { format: 'mf' },
  },
};

@Injectable()
export class GettextConfigService {
  public getConfig(configFile?: string): GettextConfig {
    if (!configFile) {
      configFile = 'rucken.json';
    }
    if (!existsSync(configFile)) {
      return DEFAULT_GETTEXT_CONFIG;
    }
    try {
      const config = JSON.parse(readFileSync(configFile).toString());
      return config?.tools
        ? {
            gettext: {
              ...DEFAULT_GETTEXT_CONFIG.gettext,
              ...(config.tools?.gettext || {}),
            },
          }
        : DEFAULT_GETTEXT_CONFIG;
    } catch (error) {
      return DEFAULT_GETTEXT_CONFIG;
    }
  }
}
