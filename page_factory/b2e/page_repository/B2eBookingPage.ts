import Checkkox from "@b2e_objects/Checkbox";
import Element from "@b2e_objects/Element";
import Iframe from "@b2e_objects/Iframe";
import Input from "@b2e_objects/Input";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
const Chance = require ('chance');
const chance = new Chance();

export default class B2eBookingPage {

    readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async bookRateCard(){
        console.info(`Booking ratecard `);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForSelector(Button.book);
        await this.page.context().pages()[1].click(Button.book);
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await WebActions.delay(1000);
        if(await this.page.context().pages()[1].locator(Element.are_you_sure_modal).isVisible()){
            await this.page.context().pages()[1].click(Button.continue);
        }
    }

    async paymentInformation(credit_card:string, card_expiration:string, card_cvc:string, zip_code:string ){
        console.info(`Filling payment information`);
        await this.page.context().pages()[1].locator(Input.card_holder).type(chance.name(), {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.card_number).locator(Input.credit_card_number).type(`${credit_card}`, {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.card_expiry).locator(Input.card_expiration).type(`${card_expiration}`, {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.card_cvc).locator(Input.card_cvc).type(`${card_cvc}`, {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.zip_code).locator(Input.card_postal).type(`${zip_code}`, {delay:30});
    }

    async completeYourQuest(){
        console.info(`Completing the booking`);
        await this.page.context().pages()[1].click(Checkkox.rules_and_policies);
        await this.page.context().pages()[1].click(Button.complete_booking);
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await this.page.context().pages()[1].waitForSelector(Element.checkout_success);
        await expect(await this.page.context().pages()[1].locator(Element.checkout_success).count()).toEqual(1);
        await this.page.context().pages()[1].click(Button.view_your_quest);
        
    }



}