import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import Checkbox from "@b2e_objects/Checkbox";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";

export default class B2ePropertyDetailPage {

    readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async checkAvailability(): Promise<void>{
        console.info(`Checking availability`);
        await this.page.context().pages()[1].click(Button.check_avialability);
        await WebActions.delay(400);
        if(await this.page.context().pages()[1].locator(Element.are_you_sure_modal).isVisible()){
            await this.page.context().pages()[1].click(Button.continue);
        }
        await this.page.context().pages()[1].click(Button.plus_adults);
        await this.page.context().pages()[1].click(Button.plus_parking);
        await this.page.context().pages()[1].click(Checkbox.disability_access);
        await this.page.context().pages()[1].click(Button.send_request);
        console.info(`Verifying request was sent`);
        await WebActions.delay(1000);
        await this.page.context().pages()[1].waitForLoadState('networkidle');
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await expect(await this.page.context().pages()[1].locator(Text.request_sent).count()).toEqual(1);
        await this.page.context().pages()[1].click(Button.ok);
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForLoadState('networkidle');
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await expect(await this.page.context().pages()[1].locator(Text.requested).count()).toEqual(1);
    }

   
}