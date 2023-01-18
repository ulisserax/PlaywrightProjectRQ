import { Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Input from "../object_repository/Input";

export default class HomePage {

     readonly page: Page;

     constructor(page:Page){
          this.page = page;
     }

     async openHomePage (url: string ){
          await this.page.goto(url);
          console.info(`Opening ${url}`);
          await this.page.waitForLoadState('domcontentloaded');
     }

     async enterCredentials( username: string, password: string ){
          console.info(`Entering credentials`);
          await this.page.type(Input.username, username);
          await this.page.type(Input.password, password);
     }

     async signIn(){
          console.info(`Clicking signIn button`);
          await this.page.click(Button.signIn);
          await this.page.waitForLoadState('networkidle');
     }
}