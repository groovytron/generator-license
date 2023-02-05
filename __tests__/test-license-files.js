'use strict';
const assert = require('yeoman-assert');
const licensesToTest = require('../src/app').licenses;

describe('Ensure all valid licenses have templates', () => {
  licensesToTest.forEach((license) => {
    const expectedLicenseFilename = license.value + '.txt';

    it(`license ${license.name} have corresponding template file ${expectedLicenseFilename}`, () => {
      assert.file(require.resolve('../src/app/templates/' + expectedLicenseFilename));
    });
  });
});
