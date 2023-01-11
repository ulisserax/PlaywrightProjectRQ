import { expect, Page } from "@playwright/test";
import Checkbox from "@enterprise_objects/Checkbox";
import Button from "@enterprise_objects/Button";
import Input from "@enterprise_objects/Input";
import WebActions from "@lib/WebActions";
import Dropdown from "@enterprise_objects/Dropdown";
import Element from "@enterprise_objects/Element";


export default class ShareOptionPage {
    readonly page: Page;

    constructor(page){
        this.page = page;
        
    }

    async shareWithGuest(){
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
        await WebActions.delay(900);
        const link_to_option = await this.page.locator(Input.link_to_options).inputValue();
        await this.page.click(Button.done);
        return await link_to_option;
    }
    async submitPreferencesAndAward(){
        console.info('Submiting preference and award');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator(Dropdown.select_preference).first().selectOption({index: 1});
        await this.page.click(Button.award);
        await this.page.click(Checkbox.terms_of_reservation_checkbox);
        await this.page.click(Button.yes);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.close);
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(Element.all_options_table_row)).toHaveClass('sent awarded corporate-option best odd');
    }
    
}