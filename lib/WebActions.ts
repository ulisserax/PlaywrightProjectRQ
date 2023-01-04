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

    static async openNewTab(browser:Browser): Promise<Page>{
        const context = await browser.newContext()
        return await context.newPage();

    }
}