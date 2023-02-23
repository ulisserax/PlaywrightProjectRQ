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

    async selectRateType(rate_type:string): Promise<void>{
        console.info("Selecting rate type");
        await this.page.selectOption(Dropdown.select_rate_type, {value: rate_type});
    }

    async selectTaxable(taxable:string): Promise<void>{
        console.info("Selecting taxable");
        await this.page.selectOption(Dropdown.taxable, {value: taxable});
    }

    async fiillFirstTax(taxes_type:string, value:string, type:string): Promise<void>{
        await WebActions.delay(500);
        console.info("Filling first taxes");
        await this.page.locator(Dropdown.select_taxes).first().selectOption({value: taxes_type});
        await this.page.locator(Input.tax_value).first().fill('');
        await this.page.locator(Input.tax_value).first().type(value);
        await this.page.locator(Dropdown.select_taxes_type).first().selectOption({value: type});
    }

    async fillSecondTax(taxes_type:string, value:string, type:string): Promise<void>{
        console.info("Filling second taxes");
        await this.page.click(Link.add_tax);
        await WebActions.delay(400);
        await this.page.locator(Dropdown.select_taxes).nth(1).selectOption({value: taxes_type});
        await this.page.locator(Input.tax_value).nth(1).fill('');
        await this.page.locator(Input.tax_value).nth(1).type(value);
        await this.page.locator(Dropdown.select_taxes_type).nth(1).selectOption({value: type});
        await this.page.keyboard.press('Enter');
        
    }
    

    async fillRateDetails(): Promise<void>{
        console.info("Filling rate details.");
        await this.page.type(Input.rate, `${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
    }

    async fillSecondRateDetails(): Promise<void>{
        console.info("Filling second rate details.");
        await this.page.click(Link.add_rate);
        await this.page.locator(Input.rate).last().fill('');
        await this.page.locator(Input.rate).last().type(`${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
    }

    async fillFees(fee_type:string): Promise<void>{
        console.info("Filling first fee.");
        await this.page.locator(Input.fee).first().fill('');
        await this.page.locator(Input.fee).first().type(`${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
        await this.page.locator(Dropdown.select_fee_type).first().selectOption({value: fee_type});
    }

    async fillSecondFees(fee:string, value:string, fee_type): Promise<void>{
        console.info("Filling second fee.");
        await this.page.click(Link.add_fees);
        await this.page.locator(Dropdown.select_fee).nth(1).selectOption({label: `${fee}`});
        await this.page.locator(Input.fee).nth(1).fill('');
        await this.page.locator(Input.fee).nth(1).type(`${value}`);
        await this.page.keyboard.press('Enter');
        await this.page.locator(Dropdown.select_fee_type).nth(1).selectOption({value: `${fee_type}`});
        
    }

    async fillDeposit(deposits_type_index:number): Promise<void>{
        console.info("Filling deposits.");
        await this.page.click(Link.add_deposit);
        await WebActions.delay(500);
        await this.page.locator(Dropdown.select_deposits).first().selectOption({index: deposits_type_index});
        await this.page.locator(Input.deposit_value).first().fill('');
        await this.page.locator(Input.deposit_value).first().type(`${chance.floating({ min: 70, max: 500, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
        await this.page.click(Element.segment_summary_section);
        
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

    async totalRateCalculation(rate_type:string){
        let rate1, rate2, length1, length2, total_days, avg_rate_day, tax1, tax2, fee1, fee2, deposit, total_rent, total_taxes, total_fees, total_deposit, grand_total;
        
        rate1           = await this.page.locator(Input.rate).first().inputValue();
        rate2           = await this.page.locator(Input.rate).nth(1).inputValue();
        length1         = await (await this.page.locator(Element.rate_length).first().inputValue()).replace(rate_type,'').trim();
        length2         = await (await this.page.locator(Element.rate_length).nth(1).inputValue()).replace(rate_type,'').trim();
        total_days      = await (await this.page.locator(Text.total_days).textContent()).replace(rate_type,'').trim();
        avg_rate_day    = await this.page.locator(Text.avg_rate_day).textContent();
        tax1            = await (await this.page.locator(Text.total_tax_segment).first().inputValue()).replace('$','').trim();
        tax2            = await (await this.page.locator(Text.total_tax_segment).nth(1).inputValue()).replace('$','').trim();
        fee1            = await (await this.page.locator(Text.total_fee_segment).first().inputValue()).replace('$','').trim();
        fee2            = await (await this.page.locator(Text.total_fee_segment).nth(1).inputValue()).replace('$','').trim();
        deposit         = await (await this.page.locator(Input.deposit_value).first().inputValue()).replace('$','').trim();
        total_rent      = await (await this.page.locator(Text.total_rent).first().textContent()).replace('$','').trim();
        total_taxes     = await (await this.page.locator(Text.total_taxes).first().textContent()).replace('$','').trim();
        total_fees      = await (await this.page.locator(Text.total_fees).first().textContent()).replace('$','').trim();
        total_deposit   = await (await this.page.locator(Text.total_deposits).first().textContent()).replace('$','').trim();
        grand_total     = await (await this.page.locator(Text.grand_total).first().textContent()).replace('$','').trim();

        console.log('comparing the rate1 length + rate2 length with the total days '+(Number(length1)+Number(length2))+ ' == ' + Number(total_days));
        await expect((Number(length1)+Number(length2))).toEqual(Number(total_days)); 
       

        console.log('verifiying rate average '+((Number(rate1)*Number(length1)+Number(rate2)*Number(length2))/Number(total_days)).toFixed(2) + ' == ' +Number(avg_rate_day).toFixed(2));
        await expect(Number(((Number(rate1)*Number(length1)+Number(rate2)*Number(length2))/Number(total_days)).toFixed(2))).toBeLessThanOrEqual(Number(Number(avg_rate_day).toFixed(2)));
        await expect(Number(((Number(rate1)*Number(length1)+Number(rate2)*Number(length2))/Number(total_days)).toFixed(2))).toBeGreaterThanOrEqual(Number(Number(avg_rate_day - 0.01).toFixed(2)));

        console.log('verifiying total rent '+((Number(rate1)*Number(length1)+Number(rate2)*Number(length2)).toFixed(2)) + ' == ' + Number(total_rent).toFixed(2));
        await expect(Number(((Number(rate1)*Number(length1)+Number(rate2)*Number(length2))).toFixed(2))).toBeLessThanOrEqual(Number(Number(total_rent).toFixed(2)));
        await expect(Number(((Number(rate1)*Number(length1)+Number(rate2)*Number(length2))).toFixed(2))).toBeGreaterThanOrEqual(Number(Number(total_rent - 0.01).toFixed(2)));

        console.log('verifiying total taxes '+(Number(tax1)+Number(tax2)).toFixed(2) + ' == ' + Number(total_taxes).toFixed(2));
        await expect(Number((Number(tax1)+Number(tax2)).toFixed(2))).toBeLessThanOrEqual(Number(Number(total_taxes).toFixed(2)));
        await expect(Number((Number(tax1)+Number(tax2)).toFixed(2))).toBeGreaterThanOrEqual(Number(Number(total_taxes - 0.01).toFixed(2)));

        console.log('verifiying total fees '+(Number(fee1)+Number(fee2)).toFixed(2) + ' == ' + Number(total_fees).toFixed(2));
        await expect(Number((Number(fee1)+Number(fee2)).toFixed(2))).toBeLessThanOrEqual(Number(Number(total_fees).toFixed(2)));
        await expect(Number((Number(fee1)+Number(fee2)).toFixed(2))).toBeGreaterThanOrEqual(Number(Number(total_fees - 0.01).toFixed(2)));

        console.log('verifiying total deposit '+(Number(deposit)).toFixed(2) + ' == ' + Number(total_deposit).toFixed(2));
        await expect(Number((Number(deposit)).toFixed(2))).toBeLessThanOrEqual(Number(Number(total_deposit).toFixed(2)));
        await expect(Number((Number(deposit)).toFixed(2))).toBeGreaterThanOrEqual(Number(Number(total_deposit - 0.01).toFixed(2)));

        console.log('verifiying grand total '+(Number(total_rent)+Number(total_taxes)+Number(total_fees)+Number(total_deposit)).toFixed(2) + ' --- ' + Number(grand_total).toFixed(2));
        await expect(Number((Number(total_rent)+Number(total_taxes)+Number(total_fees)+Number(total_deposit)).toFixed(2))).toBeLessThanOrEqual(Number(Number(grand_total).toFixed(2)));
        await expect(Number((Number(total_rent)+Number(total_taxes)+Number(total_fees)+Number(total_deposit)).toFixed(2))).toBeGreaterThanOrEqual(Number(Number(grand_total - 0.01).toFixed(2)));     

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
            await expect(Number(exception_fee_calculation.toFixed(2))).toEqual(Number(net_rate));
        }

    }
}