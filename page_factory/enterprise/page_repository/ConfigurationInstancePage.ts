import Text from "@enterprise_objects/Text";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";

export default class ConfigurationInstancePage {

     readonly page: Page;

     constructor(page:Page){
          this.page = page;
     }

    async mailPush(): Promise<void>{
        console.info("Pushing emails.");
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(2000);
        await this.page.click(Button.swiftmailer_spool_send);
        await expect(await this.page.locator(Text.console_output).textContent()).toContain(`Executing command`);
        await WebActions.delay(2000);
        await this.page.waitForLoadState('networkidle'); 
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(5000);
        await expect(await this.page.locator(Text.console_output).textContent()).toContain(`emails sent`);
    }
}
