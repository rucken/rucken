import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';

export interface ToolsConfig {
  filesList: {
    indexFileName: string;
    excludes: string[];
  };
}

export const DEFAULT_TOOLS_CONFIG: ToolsConfig = {
  filesList: {
    indexFileName: 'index',
    excludes: [
      '*node_modules*',
      '*public_api.ts*',
      '*.spec*',
      'environment*',
      '*test*',
      '*e2e*',
      '*.stories.ts',
    ],
  },
};

@Injectable()
export class ToolsConfigService {
  public getConfig(configFile: string): ToolsConfig {
    if (!existsSync(configFile)) {
      return DEFAULT_TOOLS_CONFIG;
    }
    try {
      const config = JSON.parse(readFileSync(configFile).toString());
      return config?.tools
        ? {
            filesList: {
              ...DEFAULT_TOOLS_CONFIG.filesList,
              ...(config.tools?.filesList || {}),
            },
          }
        : DEFAULT_TOOLS_CONFIG;
    } catch (error) {
      return DEFAULT_TOOLS_CONFIG;
    }
  }
}
