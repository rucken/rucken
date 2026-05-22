const { readFileSync } = require('fs');
const { dirname, join } = require('path');

// Reading the SWC compilation config for the spec files
const swcJestConfigPath = join(__dirname, '.spec.swcrc');
let swcJestConfig: any = {};

try {
  swcJestConfig = JSON.parse(readFileSync(swcJestConfigPath, 'utf-8'));
  // Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
  swcJestConfig.swcrc = false;
} catch (error) {
  // If .spec.swcrc doesn't exist, use default SWC config
  console.warn('.spec.swcrc not found, using default SWC configuration');
}

module.exports = {
  displayName: 'rucken',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../test-output/jest/coverage',
};
