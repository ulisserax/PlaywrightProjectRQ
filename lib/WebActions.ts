import type { Page , Browser} from '@playwright/test';


export default class WebActions {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
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
    }
    
}