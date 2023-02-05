import path from 'node:path';
import fs from 'node:fs';
import { createHelpers } from 'yeoman-test';

describe('license:app', () => {
  let runResult: any;
  const helpers = createHelpers({});

  it('does not create new package.json', async () => {
    runResult = await helpers
      .run(require.resolve('../src/app'))
      .withPrompts({
        name: 'Rick',
        email: 'foo@example.com',
        website: 'http://example.com',
        license: 'MIT'
      })
      .then(() => {
        runResult.assertFile('LICENSE');
        runResult.assertNoFile('package.json');
      });
  });

  it('edit pre-existing package.json', async () => {
    runResult = await helpers
      .run(require.resolve('../src/app'))
      .inTmpDir((dir) => {
        fs.writeFileSync(path.join(dir, 'package.json'), '{}');
      })
      .withPrompts({
        name: 'Rick',
        email: 'foo@example.com',
        website: 'http://example.com',
        license: 'MIT'
      })
      .then(() => {
        runResult.assertFile('LICENSE');
        runResult.assertFileContent('package.json', '"license": "MIT"');
      });
  });

  it('with author options: --name --email --website', async () => {
    runResult = await helpers
      .run(require.resolve('../src/app'))
      .withPrompts({
        license: 'ISC'
      })
      .withOptions({
        name: 'Rick',
        email: 'foo@example.com',
        website: 'http://example.com'
      })
      .then(() => {
        runResult.assertFileContent('LICENSE', 'ISC');
        runResult.assertFileContent('LICENSE', 'Rick <foo@example.com> (http://example.com)');
        runResult.assertNoFile('package.json');
      });
  });

  it('makes npm module private when license selected is UNLICENSED', async () => {
    runResult = await helpers
      .run(require.resolve('../src/app'))
      .inTmpDir((dir) => {
        fs.writeFileSync(path.join(dir, 'package.json'), '{}');
      })
      .withPrompts({
        name: 'Rick',
        email: 'foo@example.com',
        website: 'http://example.com',
        licensePrompt: 'Choose a license',
        license: 'UNLICENSED'
      })
      .then(() => {
        runResult.assertFileContent('package.json', '"license": "UNLICENSED"');
        runResult.assertFileContent('package.json', '"private": true');
      });
  });

  it('--output change the destination directory', async () => {
    runResult = await helpers
      .run(require.resolve('../src/app'))
      .withOptions({
        output: 'src/license.txt'
      })
      .withPrompts({
        name: 'Rick',
        email: 'foo@example.com',
        year: '2015',
        website: 'http://example.com',
        license: 'GPL-3.0'
      })
      .then(() => {
        runResult.assertFile('src/license.txt');
        runResult.assertNoFile('LICENSE');
      });
  });
});
