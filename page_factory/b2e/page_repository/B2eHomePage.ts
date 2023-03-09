import Input from "@b2e_objects/Input";
import Link from "@b2e_objects/Link";
import { Page } from "@playwright/test";
import Button from "../object_repository/Button";

export default class B2eHomePage {

    readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async acceptCookies(): Promise<void>{
        console.info(`Accepting cookies`);
        if(await this.page.locator(Button.accept_cookies).count()>0){
            await this.page.click(Button.accept_cookies);
        }
    }

    async enterCredentials( username: string, password: string ): Promise<void>{
        console.info(`Entering credentials`);
        await this.page.type(Input.user_email_address, username);
        await this.page.type(Input.user_password, password);
   }
   async enterPassword( password: string ): Promise<void>{
        console.info(`Entering password`);
        await this.page.type(Input.user_password, password);
    }

    async signIn(): Promise<void>{
        console.info(`Clicking login button`);
        await this.page.click(Button.login);
    }
    
    async register(): Promise<void>{
        console.info(`Clicking register link`);
        await this.page.click(Link.register);
    } 

    async forgotPassword(): Promise<void>{
        console.info(`Clicking forgot password link`);
        await this.page.click(Link.forgot_password);
    } 

}