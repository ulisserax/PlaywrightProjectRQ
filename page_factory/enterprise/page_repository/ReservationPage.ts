import { expect, Page } from "@playwright/test";
import  WebActions from "@lib/WebActions";
import Text from "@enterprise_objects/Text";
import Link from "@enterprise_objects/Link";
import Input from "@enterprise_objects/Input";
import Checkbox from "@enterprise_objects/Checkbox";
import Button from "@enterprise_objects/Button";
import Calendar from "@enterprise_objects/Calendar";
import Element from "@enterprise_objects/Element";
import ENV from "@utils/env";
import Dropdown from "@enterprise_objects/Dropdown";
import Textarea from "@enterprise_objects/Textarea";
const Chance = require ('chance');
const chance = new Chance();


export default class ReservationPage {
    readonly page: Page;

    constructor(page){
        this.page = page;
    }

    async getReservationId(): Promise<void>{
        console.log(`Getting the reservation id`);
        //let reservation_id = await this.page.locator(Text.reservation_info_header).textContent();
        let reservation_id = await this.page.locator('h2.header-title').textContent();// TO UPDATE ON 3.55 => Text.reservation_info_header).textContent();
        ENV.RESERVATION_ID = reservation_id.split('-')[1].trim();
    }

    async clickEditSegmentLink(){
        console.info(`Clicking edit rate segment link`);
        await this.page.locator(Link.edit_segment_details).first().click();
        await this.page.waitForLoadState('domcontentloaded');

    }

    async editRateSegment(): Promise<void>{
        console.info(`Editing rate segment`);
        let rate = chance.floating({ min: 70, max: 420, fixed: 2 });
        await this.page.fill(Input.rate,'');
        await this.page.type(Input.rate,`${rate}` , {delay:80});
        //await this.page.keyboard.press('Enter');
        await this.page.keyboard.press('Tab');
        await WebActions.delay(500);
        let length = Number(await (await this.page.locator(Text.modal_rate_segment_length).first().inputValue()).split(" ")[0].trim());
        let modal_rate_segment_total = (await (await this.page.locator(Text.modal_rate_segment_total).first().inputValue()).replace('$',"").trim());
               
        console.info(`new rate (${rate}) * length (${length}) == rate segment total (${modal_rate_segment_total})`);
        await expect((Number(rate*length)).toFixed(2)).toEqual(modal_rate_segment_total);
        
    }

    async submitSegmentChanges(){
        console.info(`Submiting the segments changes`);
        await this.page.click(Checkbox.edit_segment_understand);
        await this.page.click(Button.submit_changes);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(2500);
    }

    async checkReservationFeeSegments(){
        // this method check in the database the reservations segments
    }

    async changeSegmentStarDateToPast(): Promise<void>{
        console.info(`Changing reservation start date to past`);
        await WebActions.delay(1500);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector(Element.property_info_image)
        await this.page.locator(Link.edit_segment_details).first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator(Calendar.start_date).first().click();
        await this.page.click(Link.today_link);
    }

    async viewRateSegmentHistory(): Promise<void>{
        console.info(`Viewing segment history`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator(Link.view_segment_history).first().click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(400);
        await expect(await this.page.locator(Text.segment_pending_approval_section)).toBeVisible();
        await this.page.click(Element.close_modal_icon);
    }

    async verifyReservation(reservation_id): Promise<void>{
        console.info("Verifying reservation was acknowledged");
		await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(`Award acknowledged on:`);
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(`${ENV.SUPPLIER_COMPANY}`);
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(reservation_id);
    }

    async editGuestInformation(): Promise<void>{
        console.info("Editing guest information");
        await this.page.fill(Input.guest_name,'');
        await this.page.type(Input.guest_name, chance.name(), {delay:20});
        await WebActions.delay(400);
        await this.page.click(Button.submit);
        await WebActions.delay(600);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(1200);
    }

    async activityLogRequestor(requestor_admin): Promise<void>{
        console.info('Activity log validation');
        await WebActions.delay(300);
        await this.page.click(Button.activity_log);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.activity_log_modal_li).textContent()).toContain(requestor_admin);
        await expect(await this.page.locator(Element.activity_log_modal_li).textContent()).toContain('updated 1 field(s)');
        await this.page.click(Button.close);
    }

    async approveReservationChanges(): Promise<void>{
        console.info('Approving the reservation changes');
        await WebActions.delay(1200);
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Element.pending_approval_icon);
        await this.page.click(Link.view_link);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.approve);
        await this.page.click(Button.approve_changes);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.okay);

    }

    async validateReservationSegments(){
        let rate1_amount            = Number(await (await this.page.locator(Text.rate_segment_amount).first().textContent()).replace('$','').replace(',','').trim());
        let rate2_amount            = Number(await (await this.page.locator(Text.rate_segment_amount).nth(1).textContent()).replace('$','').replace(',','').trim());
        let tax1_amount             = Number(await (await this.page.locator(Text.tax_amount).first().textContent()).replace('$','').replace(',','').trim());
        let tax2_amount             = Number(await (await this.page.locator(Text.tax_amount).nth(1).textContent()).replace('$','').replace(',','').trim());
        let fee1_amount             = Number(await (await this.page.locator(Text.fee_amount).first().textContent()).replace('$','').replace(',','').trim());
        let fee2_amount             = Number(await (await this.page.locator(Text.fee_amount).nth(1).textContent()).replace('$','').replace(',','').trim());
        let deposit_amount          = Number(await (await this.page.locator(Text.deposit_amount).first().textContent()).replace('$','').replace(',','').trim());
        let rate_segment_total      = Number(await (await this.page.locator(Text.rate_segment_total).last().textContent()).replace('$','').replace(',','').trim());
        let tax_detail_total        = Number(await (await this.page.locator(Text.tax_details_total).last().textContent()).replace('$','').replace(',','').trim());
        let fee_detail_total        = Number(await (await this.page.locator(Text.fee_details_total).last().textContent()).replace('$','').replace(',','').trim());
        let deposit_detail_total    = Number(await (await this.page.locator(Text.deposit_details_total).last().textContent()).replace('$','').replace(',','').trim());
        let rent_total              = Number(await (await this.page.locator(Text.rent_total).textContent()).replace('$','').replace(',','').trim());
        let taxes_total             = Number(await (await this.page.locator(Text.taxes_total).textContent()).replace('$','').replace(',','').trim());
        let fees_total              = Number(await (await this.page.locator(Text.fees_total).textContent()).replace('$','').replace(',','').trim());
        let deposit_total           = Number(await (await this.page.locator(Text.deposits_total).textContent()).replace('$','').replace(',','').trim());
        let totals                  = Number(await (await this.page.locator(Text.totals).textContent()).replace('$','').replace(',','').trim());


        console.log('comparing the rate1 ammount + rate2 ammount with the rate segment total and rent total '+Number((rate1_amount+rate2_amount).toFixed(2))+ ' == ' + rate_segment_total+ ' == ' + rent_total);
        await expect(Number((rate1_amount+rate2_amount).toFixed(2))).toEqual(rate_segment_total);
        await expect(rate_segment_total).toEqual(rent_total);
        
        console.log('comparing the tax1 ammount + tax2 ammount with the tax details total and taxes total '+Number((tax1_amount+tax2_amount).toFixed(2))+ ' == ' + tax_detail_total+ ' == ' +taxes_total);
        await expect(Number((tax1_amount+tax2_amount).toFixed(2))).toEqual(tax_detail_total);
        await expect(tax_detail_total).toEqual(taxes_total);

        console.log('comparing the fee1 ammount + fee2 ammount with the fee details total and fees total '+fee1_amount+fee1_amount+ ' == ' + fee_detail_total+ ' == ' + fees_total);
        await expect(Number((fee1_amount+fee2_amount).toFixed(2))).toEqual(fee_detail_total);
        await expect(fee_detail_total).toEqual(fees_total);

        console.log('comparing the deposits amount with the deposits details total and deposits total '+deposit_amount+ ' == ' + deposit_detail_total+ ' == ' + deposit_total);
        await expect(deposit_amount).toEqual(deposit_detail_total);
        await expect(deposit_detail_total).toEqual(deposit_total);

        console.log('(rent_total + taxes_total + fees_total + deposit_total) == totals --> '+rent_total+taxes_total+fees_total+deposit_total+ ' == ' + totals);
        await expect(Number((rate_segment_total+tax_detail_total+fee_detail_total+deposit_detail_total).toFixed(2))).toEqual(totals);
        await expect(Number((rent_total+taxes_total+fees_total+deposit_total).toFixed(2))).toEqual(totals);

    }

    async validateRateSegmentTotals(){
        await WebActions.delay(1000);
        let total_rate_segment1 = Number(await (await this.page.locator(Text.modal_rate_segment_total).first().inputValue()).replace('$','').trim());
        let total_rate_segment2 = Number(await (await this.page.locator(Text.modal_rate_segment_total).nth(1).inputValue()).replace('$','').trim());
        let rate_total          = Number(await (await this.page.locator(Text.modal_rate_total).textContent()).replace('$','').trim());

        console.log(`rate segment 1 total (${total_rate_segment1}) + rate segment 2 (${total_rate_segment2}) == rate_total (${rate_total})`);
        await expect(Number((total_rate_segment1 + total_rate_segment2).toFixed(2))).toEqual(rate_total);
    }

    async validateTaxSegmentTotals(){
        let total_tax_segment1 = Number(await (await this.page.locator(Text.modal_tax_segment_total).first().inputValue()).replace('$','').trim());
        let total_tax_segment2 = Number(await (await this.page.locator(Text.modal_tax_segment_total).nth(1).inputValue()).replace('$','').trim());
        let tax_total          = Number(await (await this.page.locator(Text.modal_tax_total).textContent()).replace('$','').trim());

        console.log(`rate segment 1 total (${total_tax_segment1}) + rate segment 2 (${total_tax_segment2}) == rate_total (${tax_total})`);
        await expect((total_tax_segment1 + total_tax_segment2)).toEqual(tax_total);
    }

    async validateFeeSegmentTotals(){
        let total_rate_segment1 = Number(await (await this.page.locator(Text.modal_rate_segment_total).first().inputValue()).replace('$','').trim());
        let total_rate_segment2 = Number(await (await this.page.locator(Text.modal_rate_segment_total).nth(1).inputValue()).replace('$','').trim());
        let rate_total          = Number(await (await this.page.locator(Text.modal_rate_total).textContent()).replace('$','').trim());

        console.log(`rate segment 1 total (${total_rate_segment1}) + rate segment 2 (${total_rate_segment2}) == rate_total (${rate_total})`);
        await expect((total_rate_segment1 + total_rate_segment2)).toEqual(rate_total);
    }

    async validateDepositSegmentTotals(){
        let total_rate_segment1 = Number(await (await this.page.locator(Text.modal_rate_segment_total).first().inputValue()).replace('$','').trim());
        let total_rate_segment2 = Number(await (await this.page.locator(Text.modal_rate_segment_total).nth(1).inputValue()).replace('$','').trim());
        let rate_total          = Number(await (await this.page.locator(Text.modal_rate_total).textContent()).replace('$','').trim());

        console.log(`rate segment 1 total (${total_rate_segment1}) + rate segment 2 (${total_rate_segment2}) == rate_total (${rate_total})`);
        await expect((total_rate_segment1 + total_rate_segment2)).toEqual(rate_total);
    }

    async deleteSegment(){
        console.info(`Deleting the second rate segment.`);
        await this.page.locator(Element.delete_rate_segment).first().click();
        await expect(await this.page.locator(Element.rate_segment_rows).count()).toEqual(1);
        //await this.page.pause()
    }

    async addSecondRateSegment(){
        console.info("Filling second rate details.");
        await this.page.click(Link.add_rate);
        await this.page.locator(Input.rate).last().fill('');
        await this.page.locator(Input.rate).last().type(`${chance.floating({ min: 70, max: 299, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
    }

    async expandTaxesSection(){
        console.info("Expanding taxes section");
        await this.page.click(Dropdown.expand_taxes);
    }

    async expandFeesSection(){
        console.info("Expanding fees section");
        await this.page.click(Dropdown.expand_fees);
        
    }

    async expandDepositsSection(){
        console.info("Expanding deposits section");
        await this.page.click(Dropdown.expand_deposits);
        
    }

    async addNewTax(taxes_type:string, value:string, type:string): Promise<void>{
        console.info("Adding a new tax");
        await this.page.click(Link.add_tax);
        await WebActions.delay(400);
        await this.page.locator(Dropdown.reservation_tax_segment).nth(2).selectOption({value: taxes_type});
        await this.page.locator(Input.reservation_tax_segment).nth(2).fill('');
        await this.page.locator(Input.reservation_tax_segment).nth(2).type(value);
        await this.page.locator(Dropdown.reservation_tax_seg_type).nth(2).selectOption({value: type});
        await this.page.keyboard.press('Enter');
        
    }

    async addNewFees(fee:string, value:string, fee_type): Promise<void>{
        console.info("Adding a new fee.");
        await this.page.click(Link.add_reservation_fee);
        await this.page.locator(Dropdown.reservation_fee_segment).nth(2).selectOption({label: `${fee}`});
        await this.page.locator(Input.reservation_fee_segment).nth(2).fill('');
        await this.page.locator(Input.reservation_fee_segment).nth(2).type(`${value}`);
        await this.page.keyboard.press('Enter');
        await this.page.locator(Dropdown.reservation_fee_seg_type).nth(2).selectOption({value: `${fee_type}`});
        
    }

    async addNewDeposit(deposits_type_index:number): Promise<void>{
        console.info("Adding a new deposit.");
        await this.page.click(Link.add_reservation_deposit);
        await WebActions.delay(500);
        await this.page.locator(Dropdown.reservation_deposit_segment).nth(1).selectOption({index: deposits_type_index});
        await this.page.locator(Input.reservation_deposit_segment).nth(1).fill('');
        await this.page.locator(Input.reservation_deposit_segment).nth(1).type(`${chance.floating({ min: 70, max: 500, fixed: 2 })}`);
        await this.page.keyboard.press('Enter');
       
    }

    async validateReservationTotal(){
        console.info(`Validating the new reservations totals`);
        let rate_segment_total      = Number(await (await this.page.locator(Text.rate_segment_total).last().textContent()).replace('$','').replace(',','').trim());
        let tax_detail_total        = Number(await (await this.page.locator(Text.tax_details_total).last().textContent()).replace('$','').replace(',','').trim());
        let fee_detail_total        = Number(await (await this.page.locator(Text.fee_details_total).last().textContent()).replace('$','').replace(',','').trim());
        let deposit_detail_total    = Number(await (await this.page.locator(Text.deposit_details_total).last().textContent()).replace('$','').replace(',','').trim());
        let rent_total              = Number(await (await this.page.locator(Text.rent_total).textContent()).replace('$','').replace(',','').trim());
        let taxes_total             = Number(await (await this.page.locator(Text.taxes_total).textContent()).replace('$','').replace(',','').trim());
        let fees_total              = Number(await (await this.page.locator(Text.fees_total).textContent()).replace('$','').replace(',','').trim());
        let deposit_total           = Number(await (await this.page.locator(Text.deposits_total).textContent()).replace('$','').replace(',','').trim());
        let totals                  = Number(await (await this.page.locator(Text.totals).textContent()).replace('$','').replace(',','').trim());


        
        console.log('(rent_total + taxes_total + fees_total + deposit_total) == totals --> '+Number((rent_total+taxes_total+fees_total+deposit_total).toFixed(2))+ ' == ' +totals);
        await expect(Number((rate_segment_total+tax_detail_total+fee_detail_total+deposit_detail_total).toFixed(2))).toEqual(totals);
        await expect(Number((rent_total+taxes_total+fees_total+deposit_total).toFixed(2))).toEqual(totals);
    }

    async submitNoticeToVacate(){
        await this.page.click(Button.submit_notice);
        await this.page.waitForSelector(Button.keep_this_date);
        await this.page.click(Button.keep_this_date);
        await this.page.waitForSelector(Button.request_date);
        await this.page.click(Button.request_date);
        await WebActions.delay(3000);
    }

    async verifyRqProReservationAcknowledge(reservation_id){
        console.info("Verifying RQPRO reservation was acknowledged");
		await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector(Text.reservation_information);
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(`Reservation Information - ${reservation_id}`);
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(`ReloQuest: on`);

    }

    async verifyNoticeToVacateSubmitted(message:string){
        await WebActions.delay(7000);
        await this.page.waitForLoadState(`domcontentloaded`);
        await expect(await this.page.locator(Text.ntv_status).textContent()).toContain(message);
    }

    async closeExtensionSubmitted(){
        await WebActions.delay(1000);
        console.info('Closing extension modal');
        await this.page.waitForLoadState(`domcontentloaded`);
        await expect(await this.page.locator(Element.modal_nte_extension).count()).toEqual(1);
        await this.page.click(Element.modal_nte_extension_close);
    }
    
    async declineExtension(){
        console.info('Declining extension and notify guest');
        await this.page.click(Button.approve_deny);
        await this.page.click(Button.decline_extension);
        await this.page.type(Textarea.reason_for_decline, `testing purpose`,{delay:50});
        await this.page.click(Checkbox.acknowledge_notice_given);
        await this.page.click(Button.notify_guest);
    }
}
