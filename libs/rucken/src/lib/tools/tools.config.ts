export interface ToolsConfig {
  filesList: {
    indexFileName: string;
    excludes: string[];
  };
  versionUpdater: {
    updatePackageVersion: boolean;
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
  versionUpdater: {
    updatePackageVersion: true,
  },
};
