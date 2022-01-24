import { getText } from 'class-validator-multi-lang';

export class FeatureServerUser {
  static strings = {
    id: getText('FeatureServerUser Id'),
    username: getText('FeatureServerUser Username'),
    password: getText('FeatureServerUser Password'),
  };
}
