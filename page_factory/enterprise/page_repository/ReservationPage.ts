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

    async getReservationId(){
        console.log(`Getting the reservation id`);
        let reservation_id = await this.page.locator(Text.reservation_info_header).textContent() ;
        reservation_id = reservation_id.split('-')[1].trim();
        return reservation_id;
    }

    async editRateSegment(){
        console.info(`Editing rate segment`);
        await this.page.locator(Link.edit_segment_details).first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.type(Input.rate,`${chance.floating({ min: 70, max: 299, fixed: 2 })}` );
        await this.page.keyboard.press('Enter');
        await this.page.click(Checkbox.edit_segment_understand);
        await this.page.click(Button.submit_changes);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async checkReservationFeeSegments(){
        // this method check in the database the reservations segments
    }

    async changeSegmentStarDateToPast(){
        console.info(`Changing reservation start date to past`);
        //await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(1000);
        if(await this.page.locator(Element.loading_property_info).isVisible){
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
        }
        await this.page.locator(Link.edit_segment_details).first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator(Calendar.start_date).first().click();
        await WebActions.delay(300);
        await this.page.click(Link.today_link);
        await WebActions.delay(400);
        await this.page.click(Checkbox.edit_segment_understand);
        await this.page.click(Button.submit_changes);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async viewRateSegmentHistory(){
        console.info(`Viewing segment history`);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(1000);
        await this.page.locator(Link.view_segment_history).first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Text.segment_pending_approval_section)).toBeVisible();
        await this.page.click(Element.close_modal_icon);
    }

    async verifyReservation(reservation_id){
        console.info("Verifying reservation was acknowledge");
		await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(`Accepted By:`);
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(`Supplier: ${ENV.SUPPLIER_COMPANY}`);
        await expect(await this.page.locator(Text.reservation_information).textContent()).toContain(reservation_id);
    }

    async editGuestInformation(){
        console.info("Editing guest information");
        await this.page.fill(Input.guest_name,'');
        await this.page.type(Input.guest_name, chance.name(), {delay:50});
        await this.page.click(Button.submit);
        await WebActions.delay(400);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async activityLogRequestor(requestor_admin){
        console.info('Activity log validation');
        await this.page.click(Button.activity_log);
        await WebActions.delay(1500);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.activity_log_modal_li).textContent()).toContain(requestor_admin);
        await expect(await this.page.locator(Element.activity_log_modal_li).textContent()).toContain('updated 1 field(s)');
        await this.page.click(Button.close);
    }

    async approveReservationChanges(){
        console.info('Approving the reservation changes');
        await WebActions.delay(600);
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Element.pending_approval_icon);
        await this.page.click(Link.view_link);
        await WebActions.delay(1000);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.approve);
        await this.page.click(Button.approve_changes);
        await WebActions.delay(600);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.okay);

    }
}
