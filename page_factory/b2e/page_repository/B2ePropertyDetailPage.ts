import Text from "@b2e_objects/Text";
import Checkbox from "@b2e_objects/Checkbox";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";

export default class B2ePropertyDetailPage {

    readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async checkAvailability(): Promise<void>{
        console.info(`Checking availability`);
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForSelector(Button.check_avialability_or_request_deal);
        await this.page.context().pages()[1].click(Button.check_avialability_or_request_deal);
        await WebActions.delay(400);
        if(await this.page.context().pages()[1].locator(Element.are_you_sure_modal).isVisible()){
            await this.page.context().pages()[1].click(Button.continue);
        }
        await this.page.context().pages()[1].click(Button.plus_adults);
        await this.page.context().pages()[1].click(Button.plus_parking);
        await this.page.context().pages()[1].click(Checkbox.disability_access);
        await this.page.context().pages()[1].click(Button.send_request);
        console.info(`Verifying request was sent`);
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForSelector(Text.request_sent);
        await expect(await this.page.context().pages()[1].locator(Text.request_sent).count()).toEqual(1);
        await this.page.context().pages()[1].click(Button.ok);
        await WebActions.delay(200);
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await this.page.context().pages()[1].waitForSelector(Text.requested);
        await expect(await this.page.context().pages()[1].locator(Text.requested).count()).toEqual(1);
    }

    async viewRooms(){
        console.info(`Viewing rooms`);
        await WebActions.delay(2500);
        await this.page.context().pages()[1].waitForSelector(Button.view_rooms);
        await this.page.context().pages()[1].click(Button.view_rooms);
        await WebActions.delay(1000);
    }

    async bookThisRoom(){
        console.info(`Booking the first option`);
        await this.page.context().pages()[1].locator(Button.book_this_option).first().click();
        await WebActions.delay(2500);
        if(await this.page.context().pages()[1].locator(Element.are_you_sure_modal).isVisible()){
            await this.page.context().pages()[1].click(Button.continue);
        }
    }

    async unavailableRooms() : Promise<number>{
        console.info(`Getting rooms count`);
        console.info(await this.page.context().pages()[1].locator(Button.book_this_option).count());
        return await this.page.context().pages()[1].locator(Button.book_this_option).count();
    }

    async closeTab(){
        console.info(`Closing current tab`);
        await this.page.context().pages()[1].close();
        await WebActions.delay(400);
    }

   
}