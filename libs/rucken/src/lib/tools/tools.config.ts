export interface ToolsConfig {
  makeTsList: {
    indexFileName: string;
    excludes: string[];
  };
  versionUpdater: {
    updatePackageVersion: boolean;
  };
}

export const DEFAULT_TOOLS_CONFIG: ToolsConfig = {
  makeTsList: {
    indexFileName: 'index',
    excludes: [
      '*node_modules*',
      '*public_api.ts*',
      '*.spec*',
      'environment*',
      '*test*',
      '*e2e*',
      '*.stories.ts',
      '*.d.ts',
    ],
  },
  versionUpdater: {
    updatePackageVersion: true,
  },
};
