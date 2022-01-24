import { getText } from 'class-validator-multi-lang';

export class FeatureCommonUser {
  static strings = {
    id: getText('FeatureCommonUser Id'),
    username: getText('FeatureCommonUser Username'),
    password: getText('FeatureCommonUser Password'),
  };
}
