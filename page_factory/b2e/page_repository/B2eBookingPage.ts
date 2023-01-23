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
        await this.page.context().pages[1].click(Button.book);
        await WebActions.delay(500);
        await this.page.context().pages[1].waitForLoadState('networkidle');
        await this.page.context().pages[1].waitForLoadState('domcontentloaded');
        if(await this.page.context().pages[1].locator(Element.are_you_sure_modal).isVisible()){
            await this.page.context().pages[1].click('CONTINUE');
        }
    }

    async paymentInformation(){
        console.info(`Filling payment information`);
        await this.page.context().pages[1].locator(Input.card_holder).type(chance.full(), {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.card_number).locator(Input.credit_card_number).type('4111 1111 1111 1111', {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.card_expiry).locator(Input.card_expiration).type('05/38', {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.card_cvc).locator(Input.card_cvc).type('123', {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.zip_code).locator(Input.card_postal).type('33331', {delay:20});
    }

    async completeYourQuest(){
        console.info(`Completing ratecard booking`);
        await this.page.context().pages[1].locator(Input.card_holder).type(chance.full(), {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.card_number).locator(Input.credit_card_number).type('4111 1111 1111 1111', {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.card_expiry).locator(Input.card_expiration).type('05/38', {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.card_cvc).locator(Input.card_cvc).type('123', {delay:20});
        await this.page.context().pages[1].frameLocator(Iframe.zip_code).locator(Input.card_postal).type('33331', {delay:20});
    }



}