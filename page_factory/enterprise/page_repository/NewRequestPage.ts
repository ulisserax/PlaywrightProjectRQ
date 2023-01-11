import { expect, Page } from "@playwright/test";
import  WebActions from "@lib/WebActions";
import Calendar from "@enterprise_objects/Calendar";
import Input from "@enterprise_objects/Input";
import Dropdown from "@enterprise_objects/Dropdown";
import ENV from "@utils/env";
import Link from "@enterprise_objects/Link";
import Button from "@enterprise_objects/Button";
import Checkbox from "@enterprise_objects/Checkbox";
import Text from "@enterprise_objects/Text";
import Element from "@enterprise_objects/Element";
import Textarea from "@enterprise_objects/Textarea";
const Chance = require ('chance');
const chance = new Chance();



export default class NewRequestPage{
    readonly page: Page;

    constructor(page){
        this.page = page;
    }

    async select_arrival_date(){
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(400);
        await this.page.click(Calendar.arrival_date);
        await WebActions.delay(300);
        await this.page.click(Calendar.arrow_next_month);
        await WebActions.delay(300);
        await this.page.locator(Calendar.middle_date).last().click();
    }

    async select_client(client:string){
        console.info(`Select client ${client}`);
        await this.page.click(Dropdown.select_client);
        await this.page.type(Input.search_client, `${client}`, {delay:30});
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Element.client_name);
    }

    async select_desired_location(location:string){
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.type(Input.desired_location, location, {delay: 20});
        await this.page.locator(Link.desired_location).first().click();
        await this.page.keyboard.press('Enter');
    }  

    async fillGuestInfo(guest_first_name: string, guest_last_name: string, guest_email: string, guest_phone: string){
        console.info("Filling the guest information.");
        await this.page.type(Input.guest_first_name, guest_first_name);
        await this.page.type(Input.guest_last_name, guest_last_name);
        await this.page.type(Input.guest_email, guest_email);
        await this.page.type(Input.guest_phone,guest_phone);
        await this.page.type(Input.internal_id,ENV.INTERNAL_ID);
        if(await this.page.$(Input.cost_center) !== null){
            await this.page.type(Input.cost_center, `cc_${chance.integer({min:0 , max:9999})}`)
        }
    }

    async fillRequestDetails(request_type:string, requestor:string, guest_type: string, location: string, length_of_stay: string){
        console.info("Filling the new request details.");
        await this.page.waitForLoadState('domcontentloaded');
        await this.select_desired_location(location);
        await this.page.selectOption(Dropdown.select_request_type, { label: `${request_type}`});
        await this.page.selectOption(Dropdown.select_assigned_to, { label: requestor});
        await this.page.selectOption(Dropdown.select_guest_type,{ label: `${guest_type}`});
        await this.select_arrival_date();
        await this.page.selectOption(Dropdown.select_radius,{ index: 5});
        await this.page.type(Input.length_of_stay,`${length_of_stay}`);
        await this.page.selectOption(Dropdown.number_of_pets, { index: 1 });
    }

    async fillCorporateHousingDetails(){
        console.info('Filling the corporate housing details');
        await this.page.type(Input.adults, '1');
        await this.page.selectOption(Dropdown.maid_service, {index: 2});
        await this.page.selectOption(Dropdown.washer_dryer,{index: 2});
        await this.page.type(Input.days_notice,'3');
    }

    async fillHotelDetails(hotel_rooms:string, adults:string){
        console.info('Filling the hotel details');
        await this.page.selectOption(Dropdown.hotel_rooms, {value: hotel_rooms});
        await this.page.fill(Input.hotel_rooms_adults,'');
        await this.page.type(Input.hotel_rooms_adults,adults);
        await this.page.type(Textarea.hotel_special_information, `Hotel Special Information for test purpose`, {delay: 20});
    }

    async submitRequest(){
        console.info('Submitting request');
        await this.page.click(Checkbox.priorities_checkbox);
        await this.page.click(Button.submit);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.ready_to_submit);
    }

    async submitHotelRequest(){
        console.info('Submitting hotel request');
        await this.page.click(Checkbox.priorities_checkbox);
        await this.page.click(Button.submit);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.ok);
    }
    
    async editRequest(requestor_user:string){
        console.info("Editing the request");
        await this.page.selectOption(Dropdown.select_assigned_to, { label: requestor_user});
        await this.page.fill(Input.length_of_stay,``);
        await this.page.fill(Input.length_of_stay,`${chance.integer({min:10, max:120})}`);
        await this.page.keyboard.press('Enter');
        await this.page.click(Button.submit);
        await this.page.type(Text.reassign_user_reason, 'for test purpose', {delay:20});
        await this.page.click(Button.save_my_changes);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
    }

    async expireRequest(){
        console.info("Expiring the request.");
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.deadline_edit);
        await this.page.click(Button.now);
        await this.page.click(Button.apply);
        await this.page.click(Button.update_request);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
    }

    
}