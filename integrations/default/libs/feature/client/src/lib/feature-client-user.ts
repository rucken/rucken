import { marker } from '@ngneat/transloco-keys-manager/marker';
import { getText } from 'class-validator-multi-lang';

export class FeatureClientUser {
  static strings = {
    id: getText('FeatureClientUser Id'),
    username: marker('FeatureClientUser Username'),
    password: marker('FeatureClientUser Password'),
  };
}
