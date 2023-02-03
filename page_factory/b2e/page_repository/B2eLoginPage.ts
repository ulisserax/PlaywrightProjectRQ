import Checkkox from "@b2e_objects/Checkbox";
import Element from "@b2e_objects/Element";
import Input from "@b2e_objects/Input";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";


export default class B2eLoginPage {

    readonly page: Page;
    

    constructor(page:Page){
        this.page = page;
    }

    async registerNewUser(firstname: string, lastname: string, email: string, password: string){
        console.info(`Filling new user information`);
        await this.page.type(Input.firstname,`${firstname}`, {delay:30});
        await this.page.type(Input.lastname,`${lastname}`, {delay:30});
        await this.page.type(Input.email,`${email}`, {delay:30});
        await this.page.type(Input.confirm_email,`${email}`, {delay:30});
        await this.page.type(Input.user_password,`${password}`, {delay:30});
        await this.page.type(Input.confirm_password,`${password}`, {delay:30});
        await this.page.type(Input.phone, `7863256523`, {delay:30});
        await this.page.click(Checkkox.terms);
        await WebActions.delay(500);
        await this.page.click(Button.register);

    }

    async verifyRegisterSuccess(){
        console.info(`Confirming the registration was successfully`);
        await this.page.waitForSelector(Element.check_your_email);
        await expect (await this.page.locator(Element.check_your_email).count()).toBeGreaterThan(0);
    }

}    