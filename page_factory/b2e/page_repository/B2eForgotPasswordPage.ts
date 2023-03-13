import Element from "@b2e_objects/Element";
import Input from "@b2e_objects/Input";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";


export default class B2eForgotPasswordPage {

    readonly page: Page;
    

    constructor(page:Page){
        this.page = page;
    }

    async sendLink(email: string){
        console.info(`Sending link to email: ${email}`);
        await this.page.waitForSelector(Input.email);
        await this.page.type(Input.email, email, {delay:30});
        await this.page.click(Button.send_link);
        await WebActions.delay(2000);
        await this.page.waitForLoadState(`domcontentloaded`);
        await expect (await this.page.locator(Element.check_your_email_icon).count()).toBeGreaterThan(0);
    }

    async resetPassword(password: string){
        console.info(`Reseting password`);
        await this.page.waitForSelector(Input.user_password);
        await this.page.type(Input.user_password, password, {delay:30});
        await this.page.type(Input.confirm_password, password, {delay:30});
        await WebActions.delay(500);
        await this.page.click(Button.save_password);
        
    }

    async LogIn(){
        console.info(`Clicking on login`);
        await WebActions.delay(2500);
        await this.page.waitForLoadState(`domcontentloaded`);
        await expect (await this.page.locator(Element.reset_password_successfull).count()).toBeGreaterThan(0);
        await this.page.click(Button.log_in);
    }

}    