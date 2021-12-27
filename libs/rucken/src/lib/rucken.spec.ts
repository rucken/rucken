import { rucken } from './rucken';

describe('rucken', () => {
  it('should work', () => {
    expect(rucken()).toEqual(
      'sorry but i start write new version of rucken, for use prev version please change version to "1.13.3"'
    );
  });
});
