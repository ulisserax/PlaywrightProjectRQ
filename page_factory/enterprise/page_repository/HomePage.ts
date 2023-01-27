import { Page, expect } from "@playwright/test";
import Button from "../object_repository/Button";
import Input from "../object_repository/Input";
import Link from "@enterprise_objects/Link";

export default class HomePage {

     readonly page: Page;

     constructor(page:Page){
          this.page = page;
     }
     
     async enterCredentials( username: string, password: string ): Promise<void>{
          console.info(`Entering credentials`);
          await this.page.type(Input.username, username);
          await this.page.type(Input.password, password);
     }

     async signIn(): Promise<void>{
          console.info(`Clicking signIn button`);
          await this.page.click(Button.signIn);
          await this.page.waitForLoadState('networkidle');
     } 

     async acceptTermsOfService(): Promise<void> {
          console.info (`Verifying the Terms of Services acceptance`);
          await expect(await this.page.locator(Link.terms_of_service)).toBeVisible();
          await this.page.click(Button.accept_term);
     }
}