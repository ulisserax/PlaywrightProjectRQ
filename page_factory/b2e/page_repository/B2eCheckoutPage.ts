import Checkkox from "@b2e_objects/Checkbox";
import Element from "@b2e_objects/Element";
import Iframe from "@b2e_objects/Iframe";
import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import Link from "@b2e_objects/Link";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
const Chance = require ('chance');
const chance = new Chance();

export default class B2eCheckoutPage {

    readonly page: Page;
    readonly webActions: WebActions;

    constructor(page:Page){
        this.page = page;
        this.webActions = new WebActions(page);
    }

    async paymentInformation(credit_card:string, card_expiration:string, card_cvc:string, zip_code:string ){
        console.info(`Filling guest payment information`);
        await WebActions.delay(4000);
        await this.page.waitForSelector(Input.card_holder);
        await this.page.frameLocator(Iframe.card_number).locator(Input.credit_card_number).type(`${credit_card}`, {delay:30});
        await this.page.frameLocator(Iframe.card_expiry).locator(Input.card_expiration).type(`${card_expiration}`, {delay:30});
        await this.page.frameLocator(Iframe.card_cvc).locator(Input.card_cvc).type(`${card_cvc}`, {delay:30});
        await this.page.frameLocator(Iframe.zip_code).locator(Input.card_postal).type(`${zip_code}`, {delay:30});
    }

    async completeYourQuest(){
        console.info(`Completing the booking`);
        await this.page.click(Button.book);
        await this.page.waitForSelector(Element.thank_you_for_booking);
        await expect(await this.page.locator(Element.thank_you_for_booking).isVisible()).toBeTruthy();
        await this.page.click(Button.modal_ok);
        await WebActions.delay(5200);
    }
  

}