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
    async openMailCatcher(url:string): Promise<void>{
        console.info(`Opening mailcatcher ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(1500);
    }
    async searchEmail( email:string ,subject:string): Promise<void>{
        console.info(`Searching email ${email}`);
        await this.page.type(Input.search_message, `${email}`, {delay:40});
        await WebActions.delay(800);
        await this.page.click(Text.specificEmail(email, subject));
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(1000);
        await expect(await (await this.page.locator(Text.email_to).textContent()).toLocaleLowerCase()).toContain(`<${email.toLocaleLowerCase()}>`);
        await expect(await this.page.locator(Text.email_subject).textContent()).toContain(`${subject}`);
        
    }

    async getShareOptionLink(request_id:string): Promise<string>{
        console.info(`Get the share option link from the email body.`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(Link.share_link).textContent()).toContain(`reloquest.com/request/show/${request_id}?token`);
        return await this.page.frameLocator(Iframe.email_body).locator(Link.share_link).textContent();
    }

    async activateAccount():Promise<string>{
        console.info(`Activate B2E account`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(Link.activate_account).first().getAttribute('href')).toContain(`verify-account`);
        return await this.page.frameLocator(Iframe.email_body).locator(Link.activate_account).first().getAttribute('href');
    }

    async getRegisterLink():Promise<string>{
        console.info(`Get the registration link from the email body`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(Link.register).first().getAttribute('href')).toContain(`reloquest.com/registration/register`);
        return await this.page.frameLocator(Iframe.email_body).locator(Link.register).first().getAttribute('href');
    }

    async getPasswordResetLink():Promise<string>{
        console.info(`Get the password reset link from the email body`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(Link.passwordReset).getAttribute('href')).toContain(`reloquest.com/password_reset`);
        return await this.page.frameLocator(Iframe.email_body).locator(Link.passwordReset).getAttribute('href');
    }

    async getB2ePasswordResetLink():Promise<string>{
        console.info(`Get the password reset link from the email body`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(Link.password_reset).getAttribute('href')).toContain(`reloquest.com/reset-password`);
        return await this.page.frameLocator(Iframe.email_body).locator(Link.password_reset).getAttribute('href');
    }

    async verifyEmailToSupplierForDeadlineUpdate(email:string, subject:string, request_id:string, supplier_domain:string): Promise<void>{
        console.info(`Verifying email sent to Supplier for 'deadline' update`);
        await this.searchEmail(email, subject);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`//a[contains(@href,'${request_id}')]`).getAttribute('href')).toEqual(`${supplier_domain}`);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`ul.list-group h4`).textContent()).toContain(`field(s) updated on `);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`ul.list-group ul`).textContent()).toContain(`Departure on`);
    }

    async verifyBasicEmails(log_text:string,  email:string, subject:string, element_to_assert: string ,body_link_element:string, domain:string): Promise<void>{
        console.info(`Verifying email sent ${log_text}`);
        await this.page.fill(Input.search_message,'');
        await this.page.type(Input.search_message, `${subject}`, {delay:20});
        await WebActions.delay(400);
        await expect(await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).count()).toBeGreaterThanOrEqual(1)
        await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(700);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`${element_to_assert}`).count()).toBeGreaterThanOrEqual(1);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`${body_link_element}`).first().getAttribute(`href`)).toContain(`${domain}`);
       
    }

    async verifyBasicEmails1(log_text:string, email:string, subject:string, element_to_assert: string ,body_link_element:string, domain:string): Promise<void>{
        console.info(`Verifying email sent ${log_text}`);
        await this.page.fill(Input.search_message,'');
        await this.page.type(Input.search_message, `${subject}`, {delay:20});
        await WebActions.delay(400);
        await expect(await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).count()).toBeGreaterThanOrEqual(1)
        await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).nth(1).click();
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(700);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`${element_to_assert}`).count()).toBeGreaterThanOrEqual(1);
        await expect(await (await this.page.frameLocator(Iframe.email_body).locator(`${body_link_element}`).getAttribute(`href`))).toContain(`${domain}`);
    }
    
    async verifyHotelsEmails(log_text:string, search_term:string, email:string, subject:string, element_to_assert: string ): Promise<void>{
        console.info(`Verifying email sent ${log_text}`);
        await this.page.fill(Input.search_message,'');
        await this.page.type(Input.search_message, `${search_term}`, {delay:20});
        await WebActions.delay(400);
        await expect(await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).count()).toBeGreaterThanOrEqual(1)
        await this.page.locator(`nav#messages tr:not([style='display: none']) td:text('<${email}>') + td:has-text('${subject}')`).first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(700);
        await expect(await this.page.frameLocator(Iframe.email_body).locator(`${element_to_assert}`).count()).toBeGreaterThanOrEqual(1);
       
    }

    

}