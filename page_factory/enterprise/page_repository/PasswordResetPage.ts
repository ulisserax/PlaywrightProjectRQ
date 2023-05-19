import {Page, expect} from "@playwright/test";
import Input from "@enterprise_objects/Input";
import ENV from "@utils/env";
import Element from "@enterprise_objects/Element";

export default class PasswordResetPage {
    readonly page: Page;

    constructor(page:Page){
        this.page = page;
   }
   
   async resetUserPassword():Promise<void>{
       console.info(`Reseting the user Password`);
       await this.page.waitForLoadState("domcontentloaded");
       await this.page.type(Input.password, ENV.SUPPLIER_ADMIN_PASSWORD);
       await this.page.type(Input.confirm_password, ENV.SUPPLIER_ADMIN_PASSWORD);
       await this.page.click(Input.submit_password);
   }

   async verifyPasswordReset():Promise<void>{
       console.info(`Verifying that the Password has been succesfullly reset.`);
       await expect(await this.page.locator(Element.confirm_password_reset)).toBeVisible();
       await this.page.waitForLoadState("domcontentloaded");
   }

}