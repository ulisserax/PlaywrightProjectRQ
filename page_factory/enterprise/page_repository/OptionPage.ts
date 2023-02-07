import Button from "@enterprise_objects/Button";
import Checkbox from "@enterprise_objects/Checkbox";
import Dropdown from "@enterprise_objects/Dropdown";
import Link from "@enterprise_objects/Link";
import Text from "@enterprise_objects/Text";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Input from "../object_repository/Input";
const Chance = require ('chance');
const chance = new Chance();

export default class OptionPage {

     readonly page: Page;

     constructor(page:Page){
        this.page = page;
     }

    async selectProperty(property: string): Promise<void>{
        console.info("Selecting property");
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Dropdown.select_property);
        await this.page.type(Input.search_property, `${property}`, {delay:40});
        await WebActions.delay(1400);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Link.property);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(900);
    }

    async clickNewProperty(): Promise<void>{
        console.info("Click on new property");
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Button.new_property);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillUnitDetails(unit_type:string, kitchen_type:string, style:string, bedrooms:string, bathrooms:string): Promise<void>{
        console.info("Filling the unit details.");
        await this.page.waitForLoadState('networkidle');
        await this.page.selectOption(Dropdown.select_unit_type, { label: `${unit_type}`});
        await this.page.selectOption(Dropdown.select_kitchen_type, { label: `${kitchen_type}`});
        await this.page.selectOption(Dropdown.select_style, { label: `${style}`});
        await this.page.selectOption(Dropdown.select_bedrooms, { label: `${bedrooms}`});
        await this.page.selectOption(Dropdown.select_bathrooms, { label: `${bathrooms}`});
        await this.page.selectOption(Dropdown.select_air_conditioning, { index: 1});
        await this.page.type(Input.square_foot, `${chance.integer({min:200, max:5000})}`);
        await this.page.type(Input.utility_cap, `cap-${chance.integer({min:1, max:9999})}`);
        await this.page.type(Input.parking_space, `1`);
        await this.page.selectOption(Dropdown.select_parking_type, { index: 2});
        await this.page.selectOption(Dropdown.select_pet_policy, { label: `No Pets`});
    }

    async fillRateDetails(): Promise<void>{
        console.info("Filling rate details.");
        await this.page.type(Input.rate, `${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
    }

    async fillFees(fee_type:string): Promise<void>{
        console.info("Filling taxes.");
        await this.page.fill(Input.fee, '');
        await this.page.type(Input.fee, `${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
        await this.page.selectOption(Dropdown.select_fee_type, {value: `${fee_type}`});
    }

    async fillContactInformation(email:string): Promise<void>{
        console.info("Filling contact information.");
        let phone = chance.phone()
        await WebActions.delay(700)
        await this.page.type(Input.customer_service_number, `CSN-${chance.integer({ min: 10000, max: 99999})}`, {delay:20});
        await this.page.type(Input.email_for_service_issues, `${email}`, {delay:20});
        await this.page.type(Input.phone_for_services_issues, `${phone}`, {delay:20});
        await this.page.type(Input.escalation_contact_name, `CSN-${chance.integer({ min: 10000, max: 99999})}`, {delay:20});
        await this.page.type(Input.escalation_contact_email, `${email}`, {delay:20});
        await this.page.type(Input.escalation_contact_phone, `${phone}`, {delay:20});
    }

    async submitOption(): Promise<void>{
        console.info("Submitting option.");
        await this.page.click(Checkbox.cancellation_police_checkbox);
        await this.page.click(Checkbox.read_supplier_notes_checkbox);
        await this.page.click(Button.submit);
        await WebActions.delay(400);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(600);
        let count = await this.page.locator(Text.property_distance_modal_notification).count();
        if(count>0){
            await this.page.click(Button.yes);
        }
        
    }

    

    async awardFromOption(): Promise<void>{
        console.info("Award from option");
        await this.page.click(Button.award_this_option);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.yes);
        await WebActions.delay(500);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Text.awarded_property).count()).toBeGreaterThanOrEqual(1);
    }
}