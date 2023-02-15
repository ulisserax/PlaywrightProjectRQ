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
const Chance = require ('chance');
const chance = new Chance();


export default class Reservation {
    readonly page: Page;

    constructor(page){
        this.page = page;
    }

    async getReservationId(): Promise<void>{
        console.log(`Getting the reservation id`);
        let reservation_id = await this.page.locator(Text.reservation_info_header).textContent() ;
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
        console.info("Verifying reservation was acknowledge");
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
        await WebActions.delay(400);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
        await this.page.waitForLoadState('domcontentloaded');
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

        console.log('comparing the rate1 ammount + rate2 ammount with the rate segment total and rent total '+(Number(rate1_amount)+Number(rate2_amount))+ ' == ' + Number(rate_segment_total)+ ' == ' + Number(rent_total));
        await expect((Number(rate1_amount)+Number(rate2_amount))).toEqual(Number(rate_segment_total));
        await expect((Number(rate_segment_total))).toEqual(Number(rent_total));
        
        console.log('comparing the tax1 ammount + tax2 ammount with the tax details total and taxes total '+(Number(tax1_amount)+Number(tax2_amount))+ ' == ' + Number(tax_detail_total)+ ' == ' + Number(taxes_total));
        await expect((Number(tax1_amount)+Number(tax2_amount))).toEqual(Number(tax_detail_total));
        await expect((Number(tax_detail_total))).toEqual(Number(taxes_total));

        console.log('comparing the fee1 ammount + fee2 ammount with the fee details total and fees total '+(Number(fee1_amount)+Number(fee1_amount))+ ' == ' + Number(fee_detail_total)+ ' == ' + Number(fees_total));
        await expect((Number(fee1_amount)+Number(fee2_amount))).toEqual(Number(fee_detail_total));
        await expect((Number(fee_detail_total))).toEqual(Number(fees_total));

        console.log('comparing the deposits amount with the deposits details total and deposits total '+(Number(deposit_amount))+ ' == ' + Number(deposit_detail_total)+ ' == ' + Number(deposit_total));
        await expect((Number(deposit_amount))).toEqual(Number(deposit_detail_total));
        await expect((Number(deposit_detail_total))).toEqual(Number(deposit_total));

        console.log('(rent_total + taxes_total + fees_total + deposit_total) == totals --> '+(Number(rent_total)+Number(taxes_total)+Number(fees_total)+Number(deposit_total))+ ' == ' + Number(totals));
        await expect((Number(deposit_amount))).toEqual(Number(deposit_detail_total));
        await expect((Number(deposit_detail_total))).toEqual(Number(deposit_total));

        
    
    }

    async validateRateSegmentTotals(){
        await WebActions.delay(1000);
        let total_rate_segment1 = Number(await (await this.page.locator(Text.modal_rate_segment_total).first().inputValue()).replace('$','').trim());
        let total_rate_segment2 = Number(await (await this.page.locator(Text.modal_rate_segment_total).nth(1).inputValue()).replace('$','').trim());
        let rate_total          = Number(await (await this.page.locator(Text.modal_rate_total).textContent()).replace('$','').trim());

        console.log(`rate segment 1 total (${total_rate_segment1}) + rate segment 2 (${total_rate_segment2}) == rate_total (${rate_total})`);
        await expect((total_rate_segment1 + total_rate_segment2)).toEqual(rate_total);
    }

    async validateTaxSegmentTotals(){
        let total_rate_segment1 = Number(await (await this.page.locator(Text.modal_rate_segment_total).first().inputValue()).replace('$','').trim());
        let total_rate_segment2 = Number(await (await this.page.locator(Text.modal_rate_segment_total).nth(1).inputValue()).replace('$','').trim());
        let rate_total          = Number(await (await this.page.locator(Text.modal_rate_total).textContent()).replace('$','').trim());

        console.log(`rate segment 1 total (${total_rate_segment1}) + rate segment 2 (${total_rate_segment2}) == rate_total (${rate_total})`);
        await expect((total_rate_segment1 + total_rate_segment2)).toEqual(rate_total);
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
    }
    
}
