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
        let phone = chance.phone();
        await WebActions.delay(1500);
        await this.page.locator(Element.image_modal).isHidden();
        await this.page.type(Input.customer_service_number, `${phone}`, {delay:35});
        await this.page.type(Input.email_for_service_issues, `${email}`, {delay:35});
        await this.page.type(Input.phone_for_services_issues, `${phone}`, {delay:35});
        await this.page.type(Input.escalation_contact_name, `CSN-${chance.integer({ min: 10000, max: 99999})}`, {delay:35});
        await this.page.type(Input.escalation_contact_email, `${email}`, {delay:35});
        await this.page.type(Input.escalation_contact_phone, `${phone}`, {delay:35});
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

    async verifyExceptionFeeApplied(location:string){
        let rate = await this.page.locator(Input.rate).inputValue();
        let referral_commission_value;
        let referral_commission;
        let reloquest_fee;
        let net_rate = await this.page.locator(Text.net_rate).textContent();
        net_rate     = net_rate.substring(1).trim();
        let exception_fee_calculation = 0;
        let result;

        if(location.includes(`New York, NY`)){
            referral_commission         = await this.page.textContent(Text.referral_commission);
            referral_commission         = Number(referral_commission.split("(")[1].replace('%)','').replace(':','').trim());
			referral_commission_value 	= await this.page.textContent(Text.referral_commission_value);
            referral_commission_value   = Number(referral_commission_value.substring(1).trim());
			reloquest_fee       		= await this.page.textContent(Text.reloquest_fee);
            reloquest_fee               = Number(reloquest_fee.substring(1).trim());
			exception_fee_calculation   = (( 100 * referral_commission_value )/ Number(rate)) ;
            result                      = Number(rate) - Number(referral_commission_value) - Number(reloquest_fee);
            console.info(`Rate (${rate}) - referral/commission (${referral_commission_value}) - reloquest fee (${reloquest_fee}) should be equal to net rate (${net_rate})`);
            await expect(Number(result.toFixed(2))).toEqual(Number(net_rate));

            console.info(`Referral/Commission (${exception_fee_calculation.toFixed(2)}) should be equal to exception fee (${referral_commission})`);
            await expect(Number(exception_fee_calculation.toFixed(2))).toEqual(referral_commission);
            

        }else{
            referral_commission_value 	= await this.page.textContent(Text.referral_commission_value);
            referral_commission_value   = referral_commission_value.substring(1).trim()
			reloquest_fee       		= await this.page.textContent(Text.reloquest_fee);
            reloquest_fee               = reloquest_fee.substring(1).trim();
            exception_fee_calculation   = Number(rate) - Number(referral_commission_value) - Number(reloquest_fee);
            console.info(`Rate (${rate}) - referral/commission (${referral_commission_value}) - reloquest fee (${reloquest_fee}) should be equal to net rate (${net_rate})`);
            await expect(Number(referral_commission_value)).toEqual(2.00);
            await expect(Number(reloquest_fee)).toEqual(0.00);
            await expect(exception_fee_calculation).toEqual(Number(net_rate));
        }

    }
}