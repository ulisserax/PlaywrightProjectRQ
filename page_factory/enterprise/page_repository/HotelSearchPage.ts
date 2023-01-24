import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Text from "@enterprise_objects/Text";
import WebActions from "@lib/WebActions";
import Checkbox from "@enterprise_objects/Checkbox";
import Element from "@enterprise_objects/Element";
import ENV from "@utils/env";
const Chance = require ('chance');
const chance = new Chance();

export default class RequestShowPage {
    readonly page: Page;

     constructor(page:Page){
          this.page = page;
    }

    async searchHotelRoomProcess(): Promise<void>{
        console.info(`Searching for the hotel rooms`);
        await WebActions.delay(700);
        await this.page.waitForLoadState('networkidle');
        let hotel_count = await this.page.locator(Button.view_details).count();
        console.log(hotel_count);
        await this.page.locator(Button.view_details).nth(chance.integer({min:1, max:hotel_count})).click();
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Button.book);
        
    }

    async bookHotelRoom() : Promise<void>{
        console.info(`book the hotel room`);
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Button.submit_room_configuration);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Element.confirm_booking_h1).textContent()).toEqual(`Please Confirm Your Booking...`);
    }

    async verifyHotelRoomBooking(): Promise<void>{
        console.info(`Verifying booking`);
        await this.page.click(Checkbox.confirm_fee);
        await this.page.click(Checkbox.confirm_payment);
        await this.page.click(Button.confirm_booking);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Element.booking_confirmation).textContent()).toContain(`Booking Confirmation`);
        ENV.HOTEL_RESERVATION_ID = await this.page.locator(Text.hotel_reservation_id).textContent();
        
    }

    async backToRequest(): Promise<void>{
        console.info(`Back to the request`);
        await this.page.click(Button.back_to_request);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.hotels_options_table_row).count()).toBeGreaterThanOrEqual(1);
    }

    async verifyReservationWasCancelled(): Promise<void>{
        if(ENV.AWARD_IN_PROGRESS > 0){
            console.info('The Hotel award is in progress, can not be cancelled until the award is completed...')
        }else{
            console.info(`Verifying reservation was cancelled`);
            await this.page.waitForLoadState('networkidle');
            await expect(await this.page.locator(Element.booking_confirmation).textContent()).toContain(`Booking Status - CANCELLED`);
        }
        
    }
}