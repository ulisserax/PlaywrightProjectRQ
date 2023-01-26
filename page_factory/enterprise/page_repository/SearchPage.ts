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

    async clickRequestIdLink(): Promise<void>{
        console.info('Clicking on the request id link');
        await this.page.click(Link.request_id);
        await WebActions.delay(300);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickReservationIdLink(): Promise<void>{
        console.info('Clicking on the request id link');
        await this.page.click(Link.reservation_id);
    }
}