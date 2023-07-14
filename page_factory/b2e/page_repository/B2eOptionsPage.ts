import Checkkox from "@b2e_objects/Checkbox";
import Element from "@b2e_objects/Element";
import Text from "@b2e_objects/Text";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";


export default class B2eOptionsPage {

    readonly page: Page;
    readonly webActions: WebActions;

    constructor(page:Page){
        this.page = page;
        this.webActions = new WebActions(page);
    }

    async validateHereYourOptionsModal(){
        console.info(`Validating the 'Here are your options' modal`);
        await expect(await this.page.locator(Element.here_your_options_modal).isVisible()).toBeTruthy();
        await expect(await this.page.locator(Text.review_and_select_an_option).isVisible()).toBeTruthy();
        console.info(`Clicking 'Ok, Got It' button`);
        await this.page.click(Button.ok_got_it);
    }

    async verifyOptionPreference(){
        console.info(`Verifying option is selected and continue.`);
        await expect(this.page.locator(Text.first_choice_preference).isVisible()).toBeTruthy();
        await this.page.click(Button.continue);
    }

    async acceptTerms(){
        console.info(`Accepting the Terms`);
        await this.page.waitForSelector(Checkkox.accept_terms);
        await this.page.click(Checkkox.accept_terms);
        await this.page.click(Button.accept_terms);
    }

    async clickSelectOption(){
        console.info(`Selecting option`);
        await this.page.waitForSelector(Button.select_option);
        await this.page.click(Button.select_option);
    }

    async pause(){
        await this.page.pause();
    }

    async validateModalHeader(text:string){
        console.info(`Validating header modal`);
        await expect(await this.page.locator(Text.appModalHeader(text))).toBeVisible();
        await this.page.click(Button.modal_ok);
    }

    async validateCardOptionPreference(preference:string){
        console.info(`Validating card option preference`);
        await expect(await this.page.locator(Text.cardOptionPreference(preference))).toBeVisible();
        //await this.page.click(Button.modal_ok);
    }

    async validateCardOptionBooked(){
        console.info(`Validating card option preference`);
        await expect(await this.page.locator(Text.cardOptionBooked)).toBeVisible();
    }

    async validateGuestResponsabilityModal(selected_property_name:string, is_second_property_visible:boolean, second_property_name:string){
        console.info(`Validating guest responsability modal`);
        await expect(await this.page.locator(Element.guest_responsability_modal)).toBeVisible();
        await expect(await this.page.locator(Text.guest_responsability_property_choice(selected_property_name))).toBeVisible();
        await expect(await this.page.locator(Text.guest_responsability_property(second_property_name)).isVisible()).toEqual(is_second_property_visible);
        await await this.page.click(Button.continue);
    }

    async clickSelectSpecificOption(option_id){
        console.info(`Selecting card option with id ${option_id}`);
        await this.page.waitForSelector(Button.select_specific_shared_option(option_id));
        await this.page.click(Button.select_specific_shared_option(option_id));
    }

    async selectOptionPreferences(option_id:number, preference:string){
        console.info(`Selecting preferences.`);
        await this.page.click(Text.select_option(option_id));
        await this.page.click(Text.set_option_preference(option_id, preference));
    }
}