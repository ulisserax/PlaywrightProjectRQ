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

export default class B2eBookingPage {

    readonly page: Page;
    readonly webActions: WebActions;

    constructor(page:Page){
        this.page = page;
        this.webActions = new WebActions(page);
    }

    async bookRateCard(){
        console.info(`Booking ratecard `);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(800);
        await this.page.context().pages()[1].waitForSelector(Button.book);
        await this.page.context().pages()[1].click(Button.book);
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
    }

    async areYouSureModal(){
        await WebActions.delay(3000);
        await this.page.context().pages()[1].waitForSelector(Input.card_holder);
        if (await this.page.context().pages()[1].locator(Element.are_you_sure_modal).count()>0){
            await WebActions.delay(400);
            await this.page.context().pages()[1].click(Button.continue);
        }
    }

    async paymentInformation(credit_card:string, card_expiration:string, card_cvc:string, zip_code:string ){
        console.info(`Filling payment information`);
        await WebActions.delay(1000);
        await this.page.context().pages()[1].waitForSelector(Input.card_holder);
        await this.page.context().pages()[1].locator(Input.card_holder).type(chance.name(), {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.card_number).locator(Input.credit_card_number).type(`${credit_card}`, {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.card_expiry).locator(Input.card_expiration).type(`${card_expiration}`, {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.card_cvc).locator(Input.card_cvc).type(`${card_cvc}`, {delay:30});
        await this.page.context().pages()[1].frameLocator(Iframe.zip_code).locator(Input.card_postal).type(`${zip_code}`, {delay:30});
    }

    async completeYourQuest(){
        console.info(`Completing the booking`);
        await this.page.context().pages()[1].click(Checkkox.rules_and_policies);
        if(await this.page.context().pages()[1].locator(Checkkox.background_check).count()>0){
            await this.page.context().pages()[1].click(Checkkox.background_check);
        }
        await this.page.context().pages()[1].click(Button.complete_booking);
        await this.page.context().pages()[1].waitForLoadState('domcontentloaded');
        await this.page.context().pages()[1].waitForSelector(Element.checkout_success);
        await expect(await this.page.context().pages()[1].locator(Element.checkout_success).count()).toEqual(1);
        await this.page.context().pages()[1].click(Button.view_your_quest);
        await WebActions.delay(5200);
    }

    async verifyPendingQuest(){
        console.info(`Verifying pending quest`);
        await WebActions.delay(1000);
        await this.page.context().pages()[1].waitForSelector(Element.quest_detail_section);
        await WebActions.delay(1000);
        await expect(await this.page.context().pages()[1].locator(Text.pending_quest).count()).toEqual(1);
        
    }
    
    async cancelQuest(){
        console.info(`Cancelling pending quest`);
        await WebActions.delay(1500);
        await this.page.context().pages()[1].waitForSelector(Link.cancel_this_quest);
        await this.page.context().pages()[1].click(Link.cancel_this_quest);
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForSelector(Button.yes_cancel_quest);
        await this.page.context().pages()[1].click(Button.yes_cancel_quest);
        await WebActions.delay(400);
        await this.page.context().pages()[1].waitForSelector(Text.canceled_quest);
        await expect(await this.page.context().pages()[1].locator(Text.canceled_quest).count()).toEqual(1);
        
    }

    async cancelHotelQuest(){
        await WebActions.delay(1500);
        if (await this.page.context().pages()[1].locator(Text.pending_quest).count()==0){
            console.info(`Cancelling hotel quest`);
            await this.page.context().pages()[1].waitForSelector(Link.cancel_this_quest);
            await this.page.context().pages()[1].click(Link.cancel_this_quest);
            await WebActions.delay(400);
            await this.page.context().pages()[1].waitForSelector(Button.yes_cancel_quest);
            await this.page.context().pages()[1].click(Button.yes_cancel_quest);
            await WebActions.delay(400);
            await this.page.context().pages()[1].waitForSelector(Text.canceled_quest);
            await expect(await this.page.context().pages()[1].locator(Text.canceled_quest).count()).toEqual(1);
        }else{
            console.info(`Reservation in pending can't be cancelled`);
        }
    }



}