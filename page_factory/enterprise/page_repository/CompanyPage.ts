import { Page, expect } from "@playwright/test";
import Input from "@enterprise_objects/Input";
import Element from "@enterprise_objects/Element";
import Dropdown from "@enterprise_objects/Dropdown";
import Button from "@enterprise_objects/Button";
import Link from "@enterprise_objects/Link";
const Chance = require("chance");
const chance = new Chance();

export default class Company {
    readonly page: Page;

    constructor (page:Page){
        this.page = page;

    }

    async fillNewCompanyForm(companyType: string, companyName: string): Promise<void>{
        console.info(`Filling the Company Form for a new ${companyType} company`);
        await this.page.type(Input.new_company_name, companyName);
        await this.page.selectOption(Dropdown.new_company_type, { label: `${companyType}`});
        if (companyType==`Suppliers`){
            await this.page.type(Input.new_company_notification, `${companyName}@notification.com`);
        }
        await this.page.type(Input.new_company_phone, chance.phone({ formatted: false }));
        await this.page.type(Input.new_company_address, chance.address());
        await this.page.type(Input.new_company_city, chance.city());
        await this.page.type(Input.new_company_state, chance.state({country:'us'}));
        await this.page.type(Input.new_company_zip, chance.zip());
        await this.page.click(Dropdown.new_company_country);
        await this.page.click(Element.new_company_country);
        await this.page.type(Input.new_accounting_name, `accounting ${chance.first_name} ${chance.last_name}`);
        await this.page.type(Input.new_accounting_email, `accounting@${companyName}.com`);
        await this.page.type(Input.new_accounting_phone,chance.phone ({formatted: false}));
    }

    async submitNewCompany(): Promise<void>{
        console.info(`Clicking on the New button to submit the form`);
        await this.page.click(Button.create_account);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyCompanyCreation(companyName: string):Promise<void>{
        console.info(`Verifying that the company was successfully created.`);
        await expect(await this.page.locator(Element.company_form_title)).toContainText(`Update Company`);
        await expect(await this.page.locator(Input.new_company_name).getAttribute('value')).toContain(companyName);
    }

    async settingsTab(): Promise<void>{
        console.info(`Clicking on the Settings Tab.`);
        await this.page.click(Link.tab_settings);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async setSupplierCompanySettings(): Promise<void>{
        console.info(`Updating the base settings for a Suppier company`);
        await this.page.click(Button.use_request_dates);
        await this.page.click(Button.use_maid_services);
        await this.page.type(Input.default_minimum_stay, "10");
        await this.page.type(Input.default_notice, "3");
        await this.page.click(Element.default_washer_dryer);
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
        await this.page.click(Button.enable_default_images);
        await this.page.fill(Input.description_min, '');
        await this.page.type(Input.description_min, '10');
        await this.page.click(Button.ratecards_without_images);
        await this.page.click(Button.update_company_settings);
    }

    async verifyCompanySettingsUpdated(): Promise<void>{
        console.info(`Verifying that the company settings were updated`);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await expect(await this.page).toHaveURL(/\/account/);
    }

}