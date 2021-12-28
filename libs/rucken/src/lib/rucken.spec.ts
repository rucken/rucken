import { rucken } from './rucken';

describe('rucken', () => {
  it('should work', () => {
    expect(rucken()).toEqual(
      'Sorry but i start write new version of rucken, for use prev version please change version to "npm i --save-dev rucken@1.13.3"'
    );
  });
});
