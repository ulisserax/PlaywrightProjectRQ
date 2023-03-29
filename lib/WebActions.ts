import HomePage from '@enterprise_pages/HomePage';
import type { Page , Browser} from '@playwright/test';


export default class WebActions {

    readonly page: Page;
    readonly homePage: HomePage;

    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(page);
    }

    async login(role: string, url:string, user: string, password: string): Promise<void>{
        console.info(`logging in as a ${role}`);
        await this.navigateTo(url);
        await this.homePage.enterCredentials(user, password);
        await this.homePage.signIn();
    }

    static async delay(time: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }

    static async getRequestId(url: string): Promise<string> {
        let url_rid_index = url.search('rid=');
        let url_substring = url.substring(url_rid_index, url_rid_index+12).replace('rid=','');
        return url_substring;
    }

    static async openNewTab(browser:Browser): Promise<Page>{
        const context = await browser.newContext()
        return await context.newPage();

    }

    async navigateTo(url:string): Promise<void>{
        await this.page.goto(url);
        console.info(`Opening ${url}`);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(2500);
    }

    async refresh(): Promise<void>{
        console.info(`Refreshing the current page.`);
        await this.page.reload();
        await WebActions.delay(500);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    async waitForPageNavigation(event: string): Promise<void> {
        switch (event.toLowerCase()) {
            case `networkidle`:
                await this.page.waitForNavigation({ waitUntil: `networkidle`, timeout: 5000*3 });
                break;
            case `load`:
                await this.page.waitForNavigation({ waitUntil: `load`, timeout: 5000*3 });
                break;
            case `domcontentloaded`:
                await this.page.waitForNavigation({ waitUntil: `domcontentloaded`, timeout: 5000*3 });
        }
    }

    async clickElementJS(locator: string): Promise<void> {
        await this.page.$eval(locator, (element: HTMLElement) => element.click());
    }

    async isSelectorExists(selector: string) {
        return await this.page.$(selector).catch(() => null) !== null;
    }

    static async generateRandom(min: number, max: number, exclude: Array<number>){
        let random;
        while(!random){
            const x = Math.floor(Math.random() * (max - min))+ min;
            if (exclude.indexOf(x) === - 1) random = x;
        }
        return random;
    }
    
}