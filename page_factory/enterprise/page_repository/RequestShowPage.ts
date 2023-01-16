
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

export default class RequestShowPage {
    readonly page: Page;

     constructor(page:Page){
          this.page = page;
    }

    async getRequestId(){
        console.info('Confiming request was created and getting the request id.');
        await this.page.waitForLoadState('networkidle');
        let request_id = await this.page.locator(Text.request_id).textContent();
        request_id = request_id.split(':')[1].trim();
        await expect(this.page.url()).toContain(`${ENV.BASE_URL}/request/show`);
        await expect(this.page).toHaveURL(`${ENV.BASE_URL}/request/show/${request_id}`);
        return request_id;
    }

    async acceptRequest(){
        if (await this.page.$(Button.accept) !== null) { 
            console.info('Accepting the request');
            await this.page.click(Button.accept); 
            await this.page.click(Button.yes);
            await this.page.click(Button.close);
        }
    }

    async editRequest(){
        console.info('Clicking edit request button ');
        await this.page.click(Button.edit_request);
        await this.page.waitForLoadState('networkidle');
    }
    
    async bidOption(){
        console.info('Biding a option');
        await this.page.click(Button.bid);
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(400);
        if(await this.page.$(Button.rqpro_modal_continue) !== null){
            await this.page.click(Button.rqpro_modal_continue);
        }
        
    }
    
    async shareWithClient(email: string){
        console.info(`Sharing the options with the client`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.all_options_table_row)).toBeVisible();
        if (await this.page.locator(Element.request_loading)){
            this.page.reload();
        }
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

    async acknowledgeAward(response:string){
        console.info(`Acknowledge the award`);
        await this.page.selectOption(Dropdown.acknowledge_award, {value: response});
        if (await this.page.locator(Checkbox.terms_of_reservation_checkbox).isVisible()){
            await this.page.click(Checkbox.terms_of_reservation_checkbox);
        }
        await this.page.click(Button.submit_akcnowledge);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Text.acknowledge_text).first().textContent()).toContain(`Award acknowledged on:`);
    }

    async viewReservation(){
        console.info(`View reservation`);
        await this.page.click(Button.reservation_info);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.url()).toContain(`${ENV.BASE_URL}/reservation`);
    }
    async clickServiceIssue(){
        console.info(`Clicking service issue button`);
        await this.page.click(Button.service_issues);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async createServiceIssue(){
        console.info(`Creating Service issues`);
        await this.page.click(Button.create_new_service_issue);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async viewServiceIssue(){
        console.info(`view service issue button`);
        await this.page.click(Link.view_service_issue);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async validateServiceIssueWasCreated(){
        console.info(`Validate that service issue was created`);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.service_issue_row).count()).toBeGreaterThanOrEqual(1);
    }

    async validateHotelSpecialInformation(){
        console.info(`Validate hotel special information`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Element.hotel_special_information).last().textContent()).toContain(`Hotel Special Information for test purpose`);
    }

    async searchHotelOptions(){
        console.info("Searching hotel options");
        //await WebActions.delay(700); 
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.search_hotel_options);
    }

    async unawardOption(){
        console.info("Unawarding option");
        //await WebActions.delay(800); 
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Link.unaward);
        //await WebActions.delay(800); 
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Checkbox.agree_to_cancellation);
        await this.page.click(Button.ok_cancellation);
        //await WebActions.delay(900); 
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyOptionRate(){
        console.info("Verifying option rate");
        let rate = await (await this.page.locator(Text.first_option_rate).textContent()).replace('$', '').trim();
        let property_name =  await this.page.locator(Text.first_property_name).textContent();
        await this.page.locator(Checkbox.option_checkbox).first().click();
        await this.page.click(Button.map_view);
        await this.page.click(Element.option_map_icon);
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

    
    

}