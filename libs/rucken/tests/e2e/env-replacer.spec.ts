import execa from 'execa';

describe('Env replacer (e2e)', () => {
  jest.setTimeout(5 * 60 * 1000);

  it('check all logic', async () => {
    const result = await execa(
      'node',
      ['./dist/libs/rucken/src/main.js', 'env-replacer', `$VAR1`],
      {
        env: {
          VAR1: 'var1${VAR2}',
          VAR2: 'var2$var3',
          var3: 'VAR3$NO_REPLACE',
        },
      }
    );
    expect(result.stdout).toEqual('var1var2VAR3$NO_REPLACE');
  });
});
