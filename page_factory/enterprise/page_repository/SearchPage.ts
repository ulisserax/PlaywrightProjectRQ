import { expect, Page } from "@playwright/test";
import  WebActions from "@lib/WebActions";
import Link from "@enterprise_objects/Link";
const Chance = require ('chance');
const chance = new Chance();



export default class SearchPage {
    readonly page: Page;

    constructor(page){
        this.page = page;
    }

    async clickRequestIdLink(){
        console.info('Clicking on the request id link');
        await this.page.click(Link.request_id);
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(500);
    }
}