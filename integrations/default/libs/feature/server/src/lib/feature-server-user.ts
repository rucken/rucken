import { getText } from 'class-validator-multi-lang';

export class FeatureServerUsers {
  static strings = {
    id: getText('FeatureServerUser Id'),
    username: getText('FeatureServerUser "Username #1"'),
    password: getText("FeatureServerUser 'Password'"),
  };
}
