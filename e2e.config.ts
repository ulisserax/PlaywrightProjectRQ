import { PlaywrightTestConfig } from "@playwright/test";

const config : PlaywrightTestConfig = {
    timeout: 60000,
    retries: 0,
    globalSetup: 'global-setup.ts',
    testDir: "tests/e2e",
    reporter:[['html', {open: "never"}]],
    use: {
        headless: false,
        //viewport:{width:1280, height:720},
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