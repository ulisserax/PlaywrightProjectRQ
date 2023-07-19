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

    async validateCardOptionPreference(property_name:string, preference:string){
        console.info(`Validating card option with property name:'${property_name}' has the preference: '${preference}'`);
        await expect(await this.page.locator(Text.cardOptionPreference(property_name,preference))).toBeVisible();
        //await this.page.click(Button.modal_ok);
    }

    async validateCardOptionBooked(property_name:string){
        console.info(`Validating card option preference`);
        await expect(await this.page.locator(Text.cardOptionBooked(property_name))).toBeVisible();
    }

    async validateGuestResponsabilityModal(selected_property_name:string){
        console.info(`Validating guest responsability modal`);
        await expect(await this.page.locator(Element.guest_responsability_modal)).toBeVisible();
        await expect(await this.page.locator(Text.guest_responsability_subheader)).toBeVisible();
        await expect(await this.page.locator(Text.guest_responsability_text)).toBeVisible();
        await expect(await this.page.locator(Text.guestResponsabilityPropertyChoice(selected_property_name))).toBeVisible();
    }

    async clickSelectSpecificOption(option_id){
        console.info(`Selecting card option with id ${option_id}`);
        await this.page.waitForSelector(Button.select_specific_shared_option(option_id));
        await this.page.click(Button.select_specific_shared_option(option_id));
    }

    async selectOptionPreferences(option_id:number, preference:string){
        console.info(`Selecting the preference '${preference}' for the option id: ${option_id}.`);
        await this.page.click(Text.selectOption(option_id));
        await this.page.click(Text.setOptionPreference(option_id, preference));
    }

    async validateGuestResponsabilitySharedOption(property_name:string, preference:string){
        console.info(`Validating guest responsability shared option id: ${property_name}, with preference ${preference}`);
        await expect(await this.page.locator(Text.guestResponsabilityChoice(property_name, preference))).toBeVisible();
    }

    async clickContinueButton(){
        console.info(`Click continue.`);
        await this.page.click(Button.continue);
    }

    async validateOptionPreferenceSelected(option_id:number, preference:string){
        console.info(`Validating that option with id: ${option_id} is being selected as '${preference}'`);
        await expect(await this.page.locator(Text.setOptionPreference(option_id, preference))).toBeVisible();
    }

    async showGuestResponsabilityPropertyFees(property_name:string){
        console.info(`Expanding the property fees and deposits.`);
        await this.page.click(Text.propertySelected(property_name));
    }

    async validateFeesAndDepositPaidByGuest(pet_fee:number, redecoration_fee:number, pet_deposit:number, parking_fee:number){
        console.info(`Validating all fees and deposits paid by guest.`);
        await expect(await this.page.locator(Text.paidByGuestFeesAndDeposit("Pet Fee")).textContent()).toContain(`$${pet_fee}`);
        await expect(await this.page.locator(Text.paidByGuestFeesAndDeposit("Redecoration Fee")).textContent()).toContain(`$${redecoration_fee}`);
        await expect(await this.page.locator(Text.paidByGuestFeesAndDeposit("Pet Deposit")).textContent()).toContain(`$${pet_deposit}`);
        await expect(await this.page.locator(Text.paidByGuestFeesAndDeposit("Parking Fee")).textContent()).toContain(`$${parking_fee}`);
        let total = (pet_fee+redecoration_fee+pet_deposit+parking_fee).toFixed(2);
        // console.log(pet_fee, redecoration_fee,pet_deposit,parking_fee, total);
        await expect(await (await this.page.locator(Text.guest_fee_and_deposit_total).last().textContent()).replace(',','')).toEqual(`$${total}`);
    }

    async validateFeesAndDepositPaidByCompany(){
        console.info(`Validating all fees and deposits paid by company.`);
        await expect(await this.page.locator(Text.paidByCompanyFeesAndDeposit("Property Fee")).isVisible()).toBeFalsy();
        await expect(await this.page.locator(Text.paidByCompanyFeesAndDeposit("Resort Fee")).isVisible()).toBeFalsy();
        await expect(await this.page.locator(Text.paidByCompanyFeesAndDeposit("Maid Service")).isVisible()).toBeFalsy();
        await expect(await this.page.locator(Text.paidByCompanyFeesAndDeposit("Security Deposit")).isVisible()).toBeFalsy();
        await expect(await this.page.locator(Text.paidByCompanyFeesAndDeposit("Application Fee")).isVisible()).toBeFalsy();
    }

    async validateSelectedPropertyName(property_name:string){
        console.info(`Validating the selected proeprty name.`);
        await WebActions.delay(3000);
        await expect(await this.page.locator(Text.selectedProperty(property_name)).isVisible()).toBeTruthy();
    }

    async validateOtherChoiceInGuestResponsabilitModal(property_name:string, preference:string){
        console.info(`Validating choice not paid by guest.`);
        await expect(await this.page.locator(Text.guestResponsabilityChoice(property_name, preference))).toBeVisible();
        await expect(await this.page.locator(Text.otherChoiceInGuestResponsability(preference)).isVisible()).toBeTruthy();
        
    }

    async validateOptionConfirmation(option_id:number){
        console.info(`Validating option confirmation title.`);
        await WebActions.delay(3000);
        let current_url = await this.page.url();
        await expect(current_url).toContain(`/b2e/options/${option_id}/confirmation`);
        await expect(await this.page.locator(Text.option_confirmation_title)).toBeVisible();
    }

    async validateGuestCharges(property_name:string, pet_fee_amount:number, redecoration_fee_amount:number, pet_deposit_amount:number,parking_fee_amount:number){
        console.info(`Validating guest charges.`);
        await expect(await this.page.locator(Text.propertyNameConfirmation(property_name)).isVisible()).toBeTruthy();
        await expect(await (await this.page.locator(Text.guestChargesFeesAndDeposit("Pet Fee")).textContent()).trim()).toContain(`$${pet_fee_amount}`);
        await expect(await (await this.page.locator(Text.guestChargesFeesAndDeposit("Redecoration Fee")).textContent()).trim()).toContain(`$${redecoration_fee_amount}`);
        await expect(await (await this.page.locator(Text.guestChargesFeesAndDeposit("Pet Deposit")).textContent()).trim()).toContain(`$${pet_deposit_amount}`);
        await expect(await (await this.page.locator(Text.guestChargesFeesAndDeposit("Parking")).textContent()).trim()).toContain(`$${parking_fee_amount}`);
        let total = (pet_fee_amount+redecoration_fee_amount+pet_deposit_amount+parking_fee_amount).toFixed(2);
        // console.log(pet_fee, redecoration_fee,pet_deposit,parking_fee, total);
        await expect(await (await this.page.locator(Text.guest_total).textContent()).replace(',','').trim()).toEqual(`$${total}`);

    }
      
}