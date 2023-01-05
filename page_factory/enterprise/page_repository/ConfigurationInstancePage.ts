import Text from "@enterprise_objects/Text";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";

export default class ConfigurationInstancePage {

     readonly page: Page;

     constructor(page:Page){
          this.page = page;
     }

    async mailPush(){
        console.info("Pushing emails.");
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.swiftmailer_spool_send);
        await WebActions.delay(300);
        await expect(await this.page.locator(Text.console_output).textContent()).toContain(`Executing command`);
        await this.page.waitForLoadState('domcontentloaded'); 
        await WebActions.delay(1500);
        await expect(await this.page.locator(Text.console_output).textContent()).toContain(`emails sent`);
    }
}
