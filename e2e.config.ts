import { PlaywrightTestConfig } from "@playwright/test";

const config : PlaywrightTestConfig = {
    globalSetup: 'global-setup.ts',
    testDir: "tests/e2e",
    timeout: 90 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */

    workers: process.env.CI ? 6 : 6,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter:[['html', {open: "never"}]],
    use: {
        headless: true,
        viewport:{width:1280, height:720},
        actionTimeout:100000,
        ignoreHTTPSErrors:true,
        trace: 'on',
        video:'off',
        screenshot:"only-on-failure"
    },
    
    projects:[
        {
            name: 'Chromium',
            use: { browserName : 'chromium'}
        },
        {
            name: 'Firefox',
            use: { browserName : 'firefox'}
        },
        {
            name: 'Webkit',
            use: { browserName : 'webkit'}
        }
    ]

}

export default config