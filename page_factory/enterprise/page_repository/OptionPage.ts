import Button from "@enterprise_objects/Button";
import Checkbox from "@enterprise_objects/Checkbox";
import Dropdown from "@enterprise_objects/Dropdown";
import Element from "@enterprise_objects/Element";
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

    async selectProperty(property: string){
        console.info("Selecting property");
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Dropdown.select_property);
        await this.page.type(Input.search_property, `${property}`, {delay:30});
        await WebActions.delay(1200);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Link.property);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(500);
    }

    async fillUnitDetails(unit_type:string, kitchen_type:string, style:string, bedrooms:string, bathrooms:string){
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

    async fillRateDetails(){
        console.info("Filling rate details.");
        await this.page.type(Input.rate, `${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
    }

    async fillFees(fee_type:string){
        console.info("Filling taxes.");
        await this.page.fill(Input.fee, '');
        await this.page.type(Input.fee, `${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
        await this.page.selectOption(Dropdown.select_fee_type, {value: `${fee_type}`});
    }

    async fillContactInformation(email:string){
        console.info("Filling contact information.");
        let phone = chance.phone()
        await this.page.type(Input.customer_service_number, `CSN-${chance.integer({ min: 10000, max: 99999})}`);
        await this.page.type(Input.email_for_service_issues, `${email}`);
        await this.page.type(Input.phone_for_services_issues, `${phone}`);
        await this.page.type(Input.escalation_contact_name, `CSN-${chance.integer({ min: 10000, max: 99999})}`);
        await this.page.type(Input.escalation_contact_email, `${email}`);
        await this.page.type(Input.escalation_contact_phone, `${chance.first()}`);
    }

    async submitOption(){
        console.info("Submitting option.");
        await this.page.click(Checkbox.cancellation_police_checkbox);
        await this.page.click(Checkbox.read_supplier_notes_checkbox);
        await this.page.click(Button.submit);
        await WebActions.delay(500);
        //await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        if(await this.page.locator(Text.property_distance_modal_notification)){
            await this.page.click(Button.yes);
        }
        //await this.page.waitForLoadState('domcontentloaded');
        //await this.page.click(Button.submit_option_modal);
        await WebActions.delay(1000);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(3800);
        await this.page.waitForSelector(Element.all_options_table_row);
        await expect(await this.page.locator(Text.options_count).textContent()).toEqual(`1`);
    }
}