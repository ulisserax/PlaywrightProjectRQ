import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";
import Link from "@b2e_objects/Link";
import Iframe from "@b2e_objects/Iframe";
import WebActions from "@lib/WebActions";
const Chance = require ('chance');
const chance = new Chance();

export default class B2eQuestDetailsPage {

    readonly page: Page;

    constructor(page:Page ){
        this.page = page;        
    }

    async getReservationId(){
        console.info(`Getting the reservation id`);
        let booking_number = await this.page.context().pages()[1].locator(Text.booking_id).textContent();
        let start = booking_number.search('#');
        ENV.RESERVATION_ID = booking_number.substring(start+1, start+10);
        console.info(ENV.RESERVATION_ID);
    }

    async verifyPendingQuest(){
        console.info(`Verifying pending quest`);
        await this.page.waitForSelector(Element.quest_detail_section);
        await expect(await this.page.locator(Text.pending_quest).count()).toEqual(1);
        let booking_number = await this.page.locator(Text.pending_quest).textContent();
        ENV.RESERVATION_ID = booking_number.substring(booking_number.search('#'));
        console.info(ENV.RESERVATION_ID);
    }

    async verifyFutureQuest(){
        console.info(`Verifying future quest`);
        //await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(1000);
        await this.page.waitForSelector(Text.future_quest);
        await expect(await this.page.locator(Text.future_quest).count()).toEqual(1);
    }

    async viewQuestDetails(){
        console.info(`Viewing quest details`);
        await WebActions.delay(1000);
        await this.page.waitForSelector(Button.quest_details);
        await this.page.click(Button.quest_details);
    }

    async viewQuestDetailsSecond(){
        console.info(`Viewing quest details`);
        await WebActions.delay(1000);
        await this.page.context().pages()[1].waitForSelector(Button.quest_details);
        await this.page.context().pages()[1].click(Button.quest_details);
    }

    async verifyPaymentMethod(cc_last_digit:string){
        console.info(`Verifying payment method`);
        await WebActions.delay(2000);
        await this.page.click(Link.edit_payment_method);
        await WebActions.delay(4000);
        await expect(await this.page.locator(Text.current_card).textContent()).toContain(cc_last_digit);
    }

    async fillPayment(credit_card:string, card_expiration:string, card_cvc:string, zip_code:string ){
        console.info(`Editing payment information`);
        await this.page.locator(Input.card_holder).type(chance.name(), {delay:30});
        await this.page.frameLocator(Iframe.card_number).locator(Input.credit_card_number).type(`${credit_card}`, {delay:30});
        await this.page.frameLocator(Iframe.card_expiry).locator(Input.card_expiration).type(`${card_expiration}`, {delay:30});
        await this.page.frameLocator(Iframe.card_cvc).locator(Input.card_cvc).type(`${card_cvc}`, {delay:30});
        await this.page.frameLocator(Iframe.zip_code).locator(Input.card_postal).type(`${zip_code}`, {delay:30});
    }

    async savePaymentMethod(){
        console.info(`Saving payment method`);
        await this.page.click(Button.save_card);
        await WebActions.delay(6000);
        await this.page.waitForSelector(Text.payment_updated);
        await WebActions.delay(1500);
        await this.page.click(Button.got_it);
        await WebActions.delay(5000);
        await this.page.waitForLoadState(`domcontentloaded`);
    }

    async cancelPaymentModal(){
        console.info(`Cancelling the payment modal`);
        await this.page.waitForSelector(Link.cancel);
        await this.page.click(Link.cancel);
    }

    async closeQuestDetails(){
        console.info(`Closing the quest details`);
        await this.page.waitForSelector(Element.close);
        await this.page.click(Element.close);
    }

    async closeQuestDetailsSecond(){
        console.info(`Closing the quest details`);
        await this.page.context().pages()[1].waitForSelector(Element.close);
        await this.page.context().pages()[1].click(Element.close);
        await this.page.context().pages()[1].waitForLoadState(`domcontentloaded`);
        await WebActions.delay(3500);
    }

    async verifyQuestDetails(reservation_id:string, property_name: string, property_address:string){
        console.info(`Verifying reservation, property name and property address`);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(2700);
        //await this.page.context().pages()[1].waitForLoadState(`networkidle`);
        await expect(await this.page.context().pages()[1].locator(Text.questDetails(`Reservation #${reservation_id}`)).count()).toBeGreaterThan(0);
        await expect(await this.page.context().pages()[1].locator(Text.questDetails(property_name)).count()).toBeGreaterThan(0);
        await expect(await this.page.context().pages()[1].locator(Text.questDetails(property_address)).count()).toBeGreaterThan(0);
    }
    
}