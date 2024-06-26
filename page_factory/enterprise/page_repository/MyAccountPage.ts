import { Page, expect } from "@playwright/test";
import Button from "@enterprise_objects/Button";
import Input from "@enterprise_objects/Input";
import Dropdown from "@enterprise_objects/Dropdown";
import Element from "@enterprise_objects/Element";
import WebActions from "@lib/WebActions";
import Checkbox from "@enterprise_objects/Checkbox";
import ENV from "@utils/env";
import Link from "@enterprise_objects/Link";

export default class MyAccountPage {
    readonly page: Page;
    
    constructor(page: Page) {
    this.page = page;
    }

    async inviteUser(): Promise<void> {
        console.info("Clicking on the Invite User button");
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await this.page.click(Button.invite_user);
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async addCompany():Promise<void>{
        console.info(`Click on the add_company button`);
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await this.page.click(Button.add_company);
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async addClient():Promise<void>{
        console.info(`Click on the add_client button`);
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await this.page.click(Button.add_client);
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async fillSupplierInvitationNewCompany(email_address: string, company_name: string): Promise<void> {
        console.info("Filling the Company + User invitation to a Supplier");
        await this.page.waitForSelector(Element.invitation_form);
        await this.page.type(Input.email_address, email_address);
        await this.page.type(Input.first_name, ENV.GUEST_FIRSTNAME);
        await this.page.type(Input.last_name, ENV.GUEST_LASTNAME);
        await this.page.selectOption(Dropdown.invite_role, {label: `Supplier Administrator`});
        await this.page.click(Checkbox.new_company);
        await this.page.type(Input.company_name, company_name);
    }

    async submitInvitation():Promise<void>{
        console.info("Click on submit the invitation");
        await this.page.click(Button.submit);
    }

    async verifyInvitationSubmitted():Promise<void>{
        console.info(`Verifying that the invitation has been submitted`);
        await expect(await this.page.locator(Element.invitation_sent)).toBeVisible();
    }

    async addUser(): Promise<void>{
        console.info("Clicking on the Add User button");
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await this.page.click(Button.new_user);
        await WebActions.delay(700);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async filterUser(user: string): Promise<void>{
        console.info(`Filtering users.`);
        await this.page.type(Input.user_filter, user, {delay:90});
        await WebActions.delay(600);
        await this.page.waitForLoadState('networkidle');
        await this.page.keyboard.press('Enter');
        await WebActions.delay(600);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
    }

    async clickOnEditUser(user: string): Promise<void>{
        console.info(`Clicking on edit user.`); 
        await WebActions.delay(800);
        await this.page.click(`//td[contains(text(),'${user}')]/following-sibling::td/div/a[contains(text(),'Edit')]`);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await expect(await this.page).toHaveURL(/\/edit/);
    }

    async searchAndEditClient(client: string){
        console.info(`Searching and edit client '${client}'`); 
        await WebActions.delay(1000);
        await this.page.type(Input.filter_client, `${client}`, {delay:60});
        await WebActions.delay(1500);
        await this.page.click(Link.edit_client(client));
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForLoadState("networkidle");
        await expect(await this.page).toHaveURL(/\/edit/);
    }

}
