import Input from "@b2e_objects/Input";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";

export default class B2eHomePage {

    readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async acceptCookies(): Promise<void>{
        console.info(`Accepting cookies`);
        if(await this.page.locator(Button.got_it).count()>0){
            await this.page.click(Button.got_it);
        }
    }

    async enterCredentials( username: string, password: string ): Promise<void>{
        console.info(`Entering credentials`);
        await this.page.type(Input.user_email_address, username);
        await this.page.type(Input.user_password, password);
   }

    async signIn(): Promise<void>{
        console.info(`Clicking login button`);
        await this.page.click(Button.login);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

}