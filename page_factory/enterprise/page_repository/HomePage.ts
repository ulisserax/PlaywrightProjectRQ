import { Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Input from "../object_repository/Input";

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
}