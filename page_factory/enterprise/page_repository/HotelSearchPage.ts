import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Text from "@enterprise_objects/Text";
import WebActions from "@lib/WebActions";
import Checkbox from "@enterprise_objects/Checkbox";
import Element from "@enterprise_objects/Element";
import ENV from "@utils/env";
import Link from "@enterprise_objects/Link";
const Chance = require ('chance');
const chance = new Chance();

export default class RequestShowPage {
    readonly page: Page;

     constructor(page:Page){
          this.page = page;
    }

    async searchHotelRoomProcess(exclude): Promise<number>{
        console.info(`Searching for the hotel rooms`);
        await WebActions.delay(400);
        await this.page.waitForSelector(Button.view_details);
        let hotel_count = await this.page.locator(Button.view_details).count();
        console.info(hotel_count);
        let hotel_selected = await WebActions.generateRandom(0, hotel_count, [exclude]);
        await WebActions.delay(500);
        await this.page.waitForLoadState('networkidle');
        await this.page.locator(Button.view_details).nth(hotel_selected).click();
        return hotel_selected;    
    }

    async unavailableRoom() : Promise<number>{
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(700);
        await this.page.waitForSelector(Element.hotel_rooms_available);
        console.info(await this.page.locator(Text.hotel_rooms_unavailable).count());
        return await this.page.locator(Text.hotel_rooms_unavailable).count();
    }

    async bookHotelRoom() : Promise<void>{
        console.info(`Book the hotel room`);
        await this.page.click(Button.book);
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
        await WebActions.delay(600);
        await this.page.waitForSelector(Element.booking_confirmation);
        await expect(await this.page.locator(Element.booking_confirmation).textContent()).toContain(`Booking Confirmation`);
        ENV.HOTEL_RESERVATION_ID = await this.page.locator(Text.hotel_reservation_id).textContent();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async backToRequest(): Promise<void>{
        console.info(`Back to the request`);
        await this.page.click(Button.back_to_request);
        await WebActions.delay(1200);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector(Element.hotels_options_table_row);
        await expect(await this.page.locator(Element.hotels_options_table_row).count()).toBeGreaterThanOrEqual(1);
    }

    async verifyReservationWasCancelled(reservation_id:string): Promise<void>{
        if(ENV.AWARD_IN_PROGRESS > 0){
            console.info('The Hotel award is in progress, can not be cancelled until the award is completed...')
        }else{
            console.info(`Verifying reservation was cancelled`);
            await this.page.waitForLoadState('networkidle');
            //await expect(await this.page.locator(Element.booking_confirmation).textContent()).toContain(`Booking Status - CANCELLED`);
            await expect(await this.page.locator(Text.canceledReservation(reservation_id)).count()).toEqual(1);
        }
        
    }

    async backToSearchResults(): Promise<void>{
        console.info(`Back to the search results`);
        await this.page.click(Link.back_to_search_results);
        await WebActions.delay(1200);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector(Element.hotels_options_table_row);
    }
}