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
        await this.page.type(Input.search_message, `${email}`, {delay:50});
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
    async verifyBasicEmails(searchTerm:string, email:string, subject:string, logText:string, domainEmbeded:string, request_id:string, elementToAssert:string){ 
        console.info(`Verifying email to ${logText}`);
        await this.page.fill(Input.search_message,'');
        await this.page.type(Input.search_message, `${searchTerm}`, {delay:50});
        await expect(await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).count()).toEqual(1)
        await this.page.click(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(700);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`a:contains(href,'/${request_id}')`).getAttribute('href')).toEqual(`${domainEmbeded}`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`${elementToAssert}`).count()).toEqual(1);
    }
    async verifyBasicEmails1(searchTerm:string, email:string, subject:string, logText:string, domainEmbeded:string, request_id:string, elementToAssert:string){
        console.info(`Verifying email to ${logText}`);
        await this.page.fill(Input.search_message,'');
        await this.page.type(Input.search_message, `${searchTerm}`, {delay:50});
        await expect(await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).count()).toBeGreaterThanOrEqual(1)
        await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).nth(1).click();
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(700);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`a:contains(href,'/${request_id}')`).getAttribute('href')).toEqual(`${domainEmbeded}`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`${elementToAssert}`).count()).toEqual(1);
    }

    

}