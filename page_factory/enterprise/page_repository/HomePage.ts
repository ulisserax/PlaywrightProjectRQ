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

     async acceptPrivacyAndTermsOfUse(): Promise<void>{
          console.info (`Accepting the Pivacy Policy and Terms of Use`);
          await this.page.waitForLoadState('domcontentloaded');
          await expect(await this.page.locator(Link.privacy_policy)).toBeVisible();
          await expect(await this.page.locator(Link.terms_of_use)).toBeVisible();;
          await this.page.click(Button.accept_term);
          
     }

     async acceptTermsOfService(): Promise<void>{
          console.info (`Accepting the Terms of Services`);
          await this.page.waitForLoadState('domcontentloaded');
          await expect(await this.page.locator(Link.terms_of_service)).toBeVisible();
          await this.page.click(Button.accept_term);
     }

     async acceptDataProcessingAddendum(): Promise<void>{
          console.info(`Accepting the Data Processing Addendum`);
          await this.page.waitForLoadState('domcontentloaded');
          await expect(await this.page.locator(Link.dpa)).toBeVisible();
          await this.page.click(Button.accept_term);
     }
}