import Checkkox from "@b2e_objects/Checkbox";
import Element from "@b2e_objects/Element";
import Iframe from "@b2e_objects/Iframe";
import Input from "@b2e_objects/Input";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";


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
        await WebActions.delay(1000);
        await this.page.frameLocator(Iframe.card_number).first().locator(Input.credit_card_number).type(`${credit_card}`, {delay:70});
        await WebActions.delay(1000);
        await this.page.frameLocator(Iframe.card_expiry).first().locator(Input.card_expiration).type(`${card_expiration}`, {delay:70});
        await WebActions.delay(1000);
        await this.page.frameLocator(Iframe.card_cvc).first().locator(Input.card_cvc).type(`${card_cvc}`, {delay:70});
        await WebActions.delay(1000);
        await this.page.frameLocator(Iframe.zip_code).first().locator(Input.card_postal).type(`${zip_code}`, {delay:70});
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