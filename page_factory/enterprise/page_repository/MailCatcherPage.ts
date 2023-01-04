import { Page, expect } from "@playwright/test";
import Input from "../object_repository/Input";
import Text from "@enterprise_objects/Text";
import Link from "@enterprise_objects/Link";
import Iframe from "@enterprise_objects/Iframe";
import WebActions from "@lib/WebActions";


export default class MailCatcher{
    readonly page:Page;

    constructor(page:Page){
        this.page = page;
    }
    async openMailCatcher(url:string){
        console.info(`Opening mailcatcher ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');

    }
    async searchEmail( email:string ,subject:string){
        console.info(`Searching email ${email}`);
        await this.page.type(Input.search_message, `${email}`, {delay:70});
        await this.page.click(Text.first_email);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(500);
        await expect(await this.page.locator(Text.email_to).textContent()).toContain(`<${email}>`);
        await expect(await this.page.locator(Text.email_subject).textContent()).toContain(`${subject}`);
        
    }

    async getShareOptionLink(request_id:string){
        console.info(`Get the share option link from the email body.`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(Link.share_link).textContent()).toContain(`reloquest.com/request/show/${request_id}?token`);
        return await this.page.frameLocator(Iframe.email_body).locator(Link.share_link).textContent();
    }
}