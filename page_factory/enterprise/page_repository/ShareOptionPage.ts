import { expect, Page } from "@playwright/test";
import Checkbox from "@enterprise_objects/Checkbox";
import Button from "@enterprise_objects/Button";
import Input from "@enterprise_objects/Input";
import WebActions from "@lib/WebActions";
import Dropdown from "@enterprise_objects/Dropdown";
import Element from "@enterprise_objects/Element";
import Link from "@enterprise_objects/Link";
import Text from "@enterprise_objects/Text";


export default class ShareOptionPage {
    readonly page: Page;

    constructor(page){
        this.page = page;
        
    }

    async shareWithGuest(): Promise<string>{
        console.info('Clicking on all options and share with guest');
        await this.page.waitForLoadState('networkidle');
        const items = await this.page.locator(Checkbox.option_checkbox);
        for (let i=0; i<await items.count(); i++){
            await items.nth(i).click();
        }
        await this.page.click(Button.submit_share_option);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.share_with_guest);
        await this.page.fill(Input.share_email, '');
        if (await this.page.locator(Checkbox.understand_shared_link_expire_hidden).count()==0){
            await this.page.click(Checkbox.understand_shared_link_expire);
        }
        await this.page.click(Button.get_link);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(1000);
        await this.page.waitForSelector(Input.link_to_options);
        const link_to_option = await this.page.locator(Input.link_to_options).inputValue();
        await this.page.click(Button.done);
        return await link_to_option;
    }
    async submitPreferencesAndAward(): Promise<void>{
        console.info('Submiting preference and award');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator(Dropdown.select_preference).first().selectOption({index: 1});
        await this.page.click(Button.award);
        await this.page.click(Checkbox.terms_of_reservation_checkbox);
        await this.page.click(Button.yes);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(1500);
        await this.page.waitForSelector(Element.awarded_options_table_row);
        await expect(await this.page.locator(Element.awarded_options_table_row).count()).toEqual(1);
    }

    async submitPreferences(): Promise<void>{
        console.info('Submiting preferences');
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(400);
        let items = await this.page.locator(Dropdown.select_preference).count();
        for(let i = 0; i < items; i++){
            await this.page.locator(Dropdown.select_preference).nth(i).selectOption({index: i+1});
        }
        await this.page.click(Button.submit_preferences);
        await WebActions.delay(400);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Checkbox.terms_of_reservation_checkbox);
        await WebActions.delay(400);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.yes);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
        await this.page.waitForLoadState('networkidle');
    }
    
    async shareOptionWithGuest(){
        console.info('Clicking on all options and share with guest');
        await this.page.waitForLoadState('networkidle');
        const items = await this.page.locator(Checkbox.option_checkbox);
        for (let i=0; i<await items.count(); i++){
            await items.nth(i).click();
        }
        await this.page.click(Button.submit_share_option);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.share_with_guest);
        await WebActions.delay(2000);
              
    }

    async validateShareModal(advanced_setting_visibility:string, understand_guest_able_to_award_visibility:string){
        console.info('Validating the advanced settings and the understand guest able to award checkbox visibility');
        if(advanced_setting_visibility=='visible'){
            await expect(await this.page.locator(Link.show_advanced_settings)).toBeVisible();
        }else{
            await expect(await this.page.locator(Link.show_advanced_settings)).toBeHidden();
        }

        if(understand_guest_able_to_award_visibility=='visible'){
            await expect(await this.page.locator(Checkbox.understand_guest_able_to_award)).toBeVisible();
            await this.page.click(Checkbox.understand_guest_able_to_award);
        }else{
            await expect(await this.page.locator(Checkbox.understand_guest_able_to_award)).toBeHidden();
        }
    }

    async completeGuestShare(guest_email: string){
        console.info('Completing the share with the guest');
       
        await this.page.waitForSelector(Input.confirm_share_guest_email);
        await this.page.locator(Input.confirm_share_guest_email).type(guest_email,{ delay:70 });
        await WebActions.delay(2000);
        await this.page.click(Button.send_email);
        await this.page.click(Button.close);
       
    }

    async validateAdvancedSettings(is_guest_can_award:boolean, is_guest_can_select_preferences:boolean){
        console.info('Validating the advanced settings contains the expected values');
        await this.page.click(Link.show_advanced_settings);
        await expect(await this.page.locator(Checkbox.guest_can_award_option).isChecked()).toEqual(is_guest_can_award);
        await expect(await this.page.locator(Checkbox.guest_can_select_preferences).isChecked()).toEqual(is_guest_can_select_preferences);
    }

    async uncheckGuestCanAward(is_visible:boolean){
        console.info('Uncheck guest can award option');
        await this.page.click(Checkbox.guest_can_award_option);
        await expect(await this.page.locator(Checkbox.understand_guest_able_to_award).isVisible()).toEqual(is_visible);
        if (is_visible==true){
            await this.page.click(Checkbox.understand_guest_able_to_award);
        }
    }

    async validateShareLogHistory(is_can_award_visible: boolean, is_can_select_preference_visible:boolean){
        console.info('Validating share log history');
        await this.page.click(Link.share_log_history_link);
        await this.page.click(Link.share_log_table_option_toggle);
        await expect(await this.page.locator(Text.share_log_can_award).isVisible()).toEqual(is_can_award_visible);
        await expect(await this.page.locator(Text.share_log_can_select_preference).isVisible()).toEqual(is_can_select_preference_visible);
    }

    async getSharedLink(){
        console.info(`Getting the guest shared link`);
        await this.page.click(Link.get_shared_link_options);
        await this.page.waitForSelector(Input.link_to_options);
        const link_to_option = await this.page.locator(Input.link_to_options).inputValue();
        await this.page.click(Button.done);
        return await link_to_option;
    }

}