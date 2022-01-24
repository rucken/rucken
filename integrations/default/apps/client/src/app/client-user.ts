import { marker } from '@ngneat/transloco-keys-manager/marker';

export class ClientUser {
  static strings = {
    id: marker('Id'),
    username: marker('Username'),
    password: marker('Password'),
  };
}
