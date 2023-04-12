import Input from "@b2e_objects/Input";
import Link from "@b2e_objects/Link";
import { Page, expect } from "@playwright/test";
import Button from "../object_repository/Button";
import ENV from "@utils/env";
import WebActions from "@lib/WebActions";

export default class B2eHomePage {

    readonly page: Page;
    readonly webActions: WebActions;

    constructor(page:Page){
        this.page = page;
        this.webActions = new WebActions(page);
    }

    async acceptCookies(): Promise<void>{
        console.info(`Accepting cookies`);
        await WebActions.delay(2000);
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

    async validateAccountActivatedURL():Promise<void> {
        console.info(`Validating that the account was activated by an URL parameter.`);
        await expect(await this.page).toHaveURL(/activated=1/);
    }

    async login(usertype: string, url: string, email: string, password: string): Promise<void> {
        console.info(`Loggin in as a ${usertype}`);
        await this.webActions.navigateTo(ENV.RQPRO_B2E_URL);
        await this.acceptCookies();
        await this.enterCredentials(email, password);
        await this.signIn();
    }

    async eb2eCompleteActivationAndLogin():Promise<void> {
        console.info(`Complete the login process coming from an EB2E account activation.`);
        await this.validateAccountActivatedURL();
        await this.enterPassword(ENV.B2E_USER_PASSWORD);
        await this.signIn();
        await WebActions.delay(3000);
    }

}