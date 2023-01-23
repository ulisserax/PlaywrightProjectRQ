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

    async checkAvailability(): Promise<string>{
        console.info(`Checking availability`);
        let currentPage = await this.page.url();
        let rid = await WebActions.getRequestId(currentPage);
        ENV.PROPERTY_NAME = await this.page.context().pages()[1].locator(Text.property_name).textContent();
        ENV.PROPERTY_ADDRESS = await this.page.context().pages()[1].locator(Text.proeprty_address).textContent();
        console.log(ENV.PROPERTY_NAME);
        console.log(ENV.PROPERTY_ADDRESS.trim());
        console.log(await this.page.context().pages().length)
        await this.page.context().pages()[1].click(Button.check_avialability);
        await this.page.context().pages()[1].click(Button.plus_adults);
        await this.page.context().pages()[1].click(Button.plus_parking);
        await this.page.context().pages()[1].click(Checkbox.disability_access);
        await this.page.context().pages()[1].click(Button.send_request);
        console.info(`Verifying request was sent`);
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForLoadState('networkidle');
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await expect(await this.page.context().pages()[1].locator(Text.request_sent).count()).toEqual(1);
        await this.page.context().pages()[1].click(Button.ok);
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForLoadState('networkidle');
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await expect(await this.page.context().pages()[1].locator(Text.requested).count()).toEqual(1);
        return rid;
    }

    //await this.page.context().pages()[1].waitForLoadState('networkidle');
    //await this.page.context().pages()[1].waitForLoadState('domcontentloaded');

    // async verifyRequestWasSent(){
    //     console.info(`Verifying request was sent`);
    //     await this.page.waitForLoadState('networkidle');
    //     await this.page.waitForLoadState('domcontentloaded');
    //     await expect(await this.page.locator(Text.request_sent).count()).toEqual(1);
    //     await this.page.click(Button.ok);
    //     await expect(await this.page.locator(Text.requested).count()).toEqual(1);
    // }
}