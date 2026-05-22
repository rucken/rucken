import type { Config } from 'jest';

const nxPreset = require('@nx/jest/preset').default;

const customPreset: Config = { ...nxPreset };

export default customPreset;
