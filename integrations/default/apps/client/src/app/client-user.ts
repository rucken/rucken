import { marker } from '@ngneat/transloco-keys-manager/marker';
import { getText } from 'class-validator-multi-lang';

export class ClientUser {
  static strings = {
    id: getText('Id'),
    username: marker('Username'),
    password: marker('Password'),
  };
}
