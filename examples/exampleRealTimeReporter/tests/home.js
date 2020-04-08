const { PublicReportingAPI } = require('../../../build');

const suiteName = 'Home';

describe(suiteName, function() {

  this.retries(3);

  before((browser, done) => {
    const item = {
      name: suiteName,
      attributes: [{ key: 'suite', value: 'home' }],
      description: 'Common suite description',
    };
    PublicReportingAPI.startSuite(item);

    PublicReportingAPI.startBeforeSuite();
    // beforeSuite related actions
    PublicReportingAPI.finishBeforeSuite();

    done();
  });

  after((browser, done) => {
    PublicReportingAPI.finishSuite({ name: suiteName });
    browser.end();
    done();
  });

  beforeEach((browser, done) => {
    PublicReportingAPI.startTestCase(browser.currentTest, suiteName);
    done();
  });

  afterEach((browser, done) => {
    PublicReportingAPI.finishTestCase(browser.currentTest);
    done();
  });

  test('demo test', function(browser) {
    PublicReportingAPI.setDescription('Demo test for ecosia.org');

    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      .saveScreenshot('testScreen.png', (data) => {
        PublicReportingAPI.logInfo('This is a log with screenshot attachment', {
          name: 'testScreen',
          content: data.value,
        });
      })
      .rpSaveScreenshot('rpTestScreen.jpg')
      .rpLog('Screenshot attached successfully')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', 'Nightwatch.js')
      .end();

    PublicReportingAPI.addAttributes([{ key: 'check', value: 'success' }]);
    PublicReportingAPI.setDescription('Attributes added to the test item');
  });

  test('beta test', function(browser) {
    PublicReportingAPI.setDescription('Demo test for ecosia.org #2');

    let expectedMainlineText = 'Nightwatch.jsasd';

    if (browser.currentTest.results.retries > 2) {
      expectedMainlineText = 'Nightwatch.js';
    }

    browser
      .url('https://www.ecosia.org/')
      .setValue('input[type=search]', 'nightwatch')
      .click('button[type=submit]')
      .assert.containsText('.mainline-results', expectedMainlineText)
      .end();
  });
});
