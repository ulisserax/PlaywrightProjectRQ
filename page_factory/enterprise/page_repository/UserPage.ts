import {Page, expect} from "@playwright/test";
import Input from "@enterprise_objects/Input";
import Element from "@enterprise_objects/Element";
import Button from "@enterprise_objects/Button";
import ENV from "@utils/env";
import WebActions from "@lib/WebActions";

const Chance = require("chance");
const chance = new Chance();

export default class User {
    readonly page: Page;

    constructor (page: Page){
        this.page = page;
    }

    async fillNewUser(supplierCompanyName: string, supplierUser:string): Promise<void>{
        console.info(`Filling the New User form`);
        await this.page.type(Input.profile_username, supplierUser);
        await this.page.type(Input.profile_first_name, chance.first());
        await this.page.type(Input.profile_last_name, chance.last());
        await this.page.type(Input.profile_email, supplierUser);
        await this.page.click(Element.profile_timezone);
        await this.page.type(Input.profile_timezone, 'New york', {delay:40});
        await this.page.keyboard.press('Enter');
        await this.page.click(Element.profile_company);
        await this.page.type(Input.profile_company, `${supplierCompanyName}`, {delay:40});
        await this.page.keyboard.press('Enter');
        await this.page.type(Input.profile_phone, chance.phone({format: false}));
        await this.page.click(Input.role_supplier_admin);
        await this.page.click(Button.create_account);
    }

    async verifyUserSaved(): Promise<void>{
        console.info(`Verifying that the User was created/updated`);
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await expect(await this.page).toHaveURL(/\/account/);
    }
    async editUserPassword(): Promise<void>{
        console.info(`Editing the User password.`);
        await this.page.type(Input.reg_password, ENV.SUPPLIER_ADMIN_PASSWORD);
        await this.page.type(Input.reg_repeat_password, ENV.SUPER_ADMIN_PASSWORD);
        await this.page.click(Button.create_account); 
    }

}