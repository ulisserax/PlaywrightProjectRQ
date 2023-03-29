
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import ENV from "@utils/env";
import Text from "@enterprise_objects/Text";
import WebActions from "@lib/WebActions";
import Checkbox from "@enterprise_objects/Checkbox";
import Input from "@enterprise_objects/Input";
import Dropdown from "@enterprise_objects/Dropdown";
import Element from "@enterprise_objects/Element";
import Link from "@enterprise_objects/Link";
import Switch from "@enterprise_objects/Switch";

export default class RequestShowPage {
    readonly page: Page;

     constructor(page:Page){
          this.page = page;
    }

    async getRequestId(): Promise<void>{
        console.info('Confiming request was created and getting the request id.');
        await this.page.waitForLoadState('networkidle');
        let request_id = await this.page.locator(Text.request_id).textContent();
        ENV.REQUEST_ID = request_id.split(':')[1].trim();
        await expect(this.page.url()).toContain(`${ENV.BASE_URL}/request/show`);
        await expect(this.page).toHaveURL(`${ENV.BASE_URL}/request/show/${ENV.REQUEST_ID}`);
    }

    async acceptRequest(): Promise<void>{
        if (await this.page.$(Button.accept) !== null) { 
            console.info('Accepting the request');
            await this.page.click(Button.accept); 
            await this.page.click(Button.yes);
            await this.page.click(Button.close);
        }
    }

    async editRequest(): Promise<void>{
        console.info('Clicking edit request button ');
        await this.page.click(Button.edit_request);
        await this.page.waitForLoadState('networkidle');
    }

    async bidPropertiesRequestedForB2E(): Promise<void>{
        console.info('Biding a properties requested for b2e');
        await this.page.click(Button.properties_requested);
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(400);
        await this.page.click(Button.bid_with_this_property);
    }
    
    async bidOption(): Promise<void>{
        console.info('Biding a option');
        await this.page.click(Button.bid);
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(400);
        if(await this.page.$(Button.rqpro_modal_continue) !== null){
            await this.page.click(Button.rqpro_modal_continue);
        }
        
    }

    async shareWithClient(email: string): Promise<void>{
        console.info(`Sharing the options with the client`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector(Element.approved_options_table_row);
        await expect(await this.page.locator(Element.approved_options_table_row)).toBeVisible();
        const items = await this.page.locator(Checkbox.option_checkbox);
        for (let i=0; i<await items.count(); i++){
            await items.nth(i).click();
        }       
        await this.page.click(Button.share_option);
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Button.share_with_client);
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(500);
        await this.page.fill(Input.share_email,'');
        await this.page.type(Input.share_email, email, {delay: 30});
        if (await this.page.locator(Checkbox.understand_shared_link_expire_hidden).count()==0){
            await this.page.click(Checkbox.understand_shared_link_expire);
        }
        await this.page.click(Button.send_email);
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Button.close);
        await this.page.waitForLoadState('networkidle');
        
    }

    async acknowledgeAward(response:string): Promise<void>{
        console.info(`Acknowledge the award`);
        await this.page.selectOption(Dropdown.acknowledge_award, {value: response});
        if (await this.page.locator(Checkbox.terms_of_reservation_checkbox).isVisible()){
            await this.page.click(Checkbox.terms_of_reservation_checkbox);
        }
        await this.page.click(Button.submit_akcnowledge);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Text.acknowledge_text).first().textContent()).toContain(`Award acknowledged on:`);
    }
    async alternateOption(response:string): Promise<void>{
        console.info(`Submitting an alternate option.`);
        await this.page.selectOption(Dropdown.acknowledge_award, {value: response});
        if (await this.page.locator(Checkbox.terms_of_reservation_checkbox).isVisible()){
            await this.page.click(Checkbox.terms_of_reservation_checkbox);
        }
        await this.page.click(Button.submit_akcnowledge);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async declineOption(response:string): Promise<void>{
        console.info(`Declining option.`);
        await this.page.selectOption(Dropdown.acknowledge_award, {value: response});
        await this.page.click(Button.submit_akcnowledge);
        await this.page.click(Button.yes);
        await WebActions.delay(1300);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.table_option_declined).count()).toEqual(1);

    }

    async viewReservation(): Promise<void>{
        console.info(`View reservation`);
        await this.page.click(Button.reservation_info);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.url()).toContain(`/reservation/RQR`);
        await WebActions.delay(1500);
    }

    async clickServiceIssue(): Promise<void>{
        console.info(`Clicking service issue button`);
        await this.page.click(Button.service_issues);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async awardAlternateOption(): Promise<void>{
        console.info(`Awarding the alternate option`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.awardAlternateOption);
        await this.page.click(Button.yes);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Element.awarded_options_table_row).count()).toEqual(1);
    }

    async awardSecondChoiceOption(): Promise<void>{
        console.info(`Awarding the second choice option`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.awardAlternateOption);
        await this.page.click(Button.yes);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Element.awarded_options_table_row).count()).toEqual(1);
    }

    async createServiceIssue(): Promise<void>{
        console.info(`Creating Service issues`);
        await this.page.click(Button.create_new_service_issue);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async viewServiceIssue(): Promise<void>{
        console.info(`view service issue button`);
        await this.page.click(Link.view_service_issue);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async validateServiceIssueWasCreated(): Promise<void>{
        console.info(`Validate that service issue was created`);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.service_issue_row).count()).toBeGreaterThanOrEqual(1);
    }

    async validateHotelSpecialInformation(): Promise<void>{
        console.info(`Validate hotel special information`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.hotel_special_information).last().textContent()).toContain(`Hotel Special Information for test purpose`);
    }

    async searchHotelOptions(): Promise<void>{
        console.info("Searching hotel options");
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.search_hotel_options);
    }

    async unawardOption(): Promise<void>{
        console.info("Unawarding option");
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        ENV.AWARD_IN_PROGRESS = await this.page.locator(Element.hotel_options_award_in_progress).count();
        if(ENV.AWARD_IN_PROGRESS > 0){
            console.info('The Hotel award is in progress, can not be cancelled until the award is completed...')
        }else{
            await this.page.click(Link.unaward);
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.click(Checkbox.agree_to_cancellation);
            await this.page.click(Button.ok_cancellation);
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForLoadState('domcontentloaded');
        }
        
    }

    async verifyOptionRate(): Promise<void>{
        console.info("Verifying option rate");
        let rate = await (await this.page.locator(Text.first_option_rate).textContent()).replace('$', '').trim();
        let property_name =  await this.page.locator(Text.first_property_name).textContent();
        await this.page.locator(Checkbox.option_checkbox).first().click();
        await this.page.click(Button.map_view);
        await this.page.locator(Element.option_map_icon).click();
        let card_property_rate = await this.page.locator(Text.card_property_rate).textContent();
        let card_property_name = await this.page.locator(Text.card_property_name).textContent();
        await expect(await card_property_rate).toContain(rate);
        await expect(await card_property_name).toContain(property_name);
        await this.page.click(Text.card_property_rate);
        await WebActions.delay(500);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(500);
        console.log(await this.page.locator(Input.rate).inputValue());
        await expect(await this.page.locator(Input.rate).inputValue()).toContain(rate);

    }
    
    async verifyOptionSubmitted(): Promise<void>{
        console.info(`Validating option was submitted`);
        await WebActions.delay(1000);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(3800);
        await this.page.waitForSelector(Element.approved_options_table_row);
        await expect(await this.page.locator(Element.approved_options_table_row).count()).toBeGreaterThanOrEqual(1);
    }

    async verifyAlternateOptionSubmitted(): Promise<void>{
        console.info(`Validating alternate option was submitted`);
        await expect(await this.page.locator(Element.alternate_options_table_row).count()).toEqual(1);
    }

    async verifyOptionAvailability(): Promise<void>{
        console.info(`Verifying option availability`);
        await WebActions.delay(400);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.click(Checkbox.option_checkbox);
        await this.page.click(Button.verify_option);
        await this.page.click(Button.send);
        await WebActions.delay(400);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Element.modal_availability_not_visible);
        await WebActions.delay(400);
        await expect(await this.page.locator(Element.option_availability_message).count()).toEqual(1);
    }

    async confirmOptionAvailability(): Promise<void>{
        console.info(`Confirming option availability`);
        await WebActions.delay(400);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.click(Element.icon_option_confirmation);
        await expect(await this.page.locator(Switch.avialable_yes).count()).toEqual(1);
        await this.page.click(Button.apply_confimation);
        await this.page.click(Button.yes);
        await WebActions.delay(400);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await expect(await this.page.locator(Element.modal_option_verification)).toHaveCount(0);
        await WebActions.delay(400);
        await expect(await this.page.locator(Element.icon_confirm_availability).count()).toEqual(1);
    }

    async getCurrentLink(): Promise<string>{
        console.info(`Getting current link`);
        await WebActions.delay(400);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        return await this.page.url();
    }

    async awardByPreference(): Promise<void>{
        console.info(`Awarding the 1st choice`);
        await WebActions.delay(400);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.click(Button.award_1st_choice);
        await this.page.click(Button.yes);
        await WebActions.delay(800);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.awarded_options_table_row).count()).toEqual(1);
    }


    async b2eNotificationModal(){
        await this.page.waitForSelector(Text.b2e_request_modal);
        await expect(await this.page.locator(Text.b2e_request_modal).textContent()).toContain('This is a B2E Request!');
        await this.page.click(Checkbox.b2e_term_of_reservation);
        await this.page.click(Button.b2e_modal_continue);
    } 

    async awardOption(): Promise<void>{
        console.info(`Awarding option`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.award);
        await this.page.click(Button.yes);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Element.awarded_options_table_row).count()).toEqual(1);
    }

    async verifyNotifiedsupplier(supplier: string, status: string, areaValidated: string): Promise<void>{
        console.info(`Verifying that the expected Supplier was notified.`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        const request_status = await this.page.locator(Text.request_status).innerText().valueOf();
        await expect(request_status).toEqual(status);
        if (await request_status == "Current"){
            await this.page.click(Link.notified_supplier);
            await expect(await this.page.locator(Text.supplier_notified(supplier))).toBeVisible();
            console.info(`The ${areaValidated} has been validated.`);
        }else if (await request_status == "No Area") {
            await expect(await this.page.locator(Element.no_area_modal)).toBeVisible();
            console.info(`The ${areaValidated} has been validated.`);
        }  
    }

}