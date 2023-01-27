import { Page, expect } from "@playwright/test";
import Button from "@enterprise_objects/Button";
import Input from "@enterprise_objects/Input";
import Dropdown from "@enterprise_objects/Dropdown";
import Element from "@enterprise_objects/Element";
import WebActions from "@lib/WebActions";
import Checkbox from "@enterprise_objects/Checkbox";


export default class MyAccount {
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

    async fillSupplierInvitationNewCompany(email_address: string, first_name: string, last_name: string, company_name: string): Promise<void> {
        console.info("Filling the Company + User invitation to a Supplier");
        await this.page.waitForSelector(Element.invitation_form);
        await this.page.type(Input.email_address, email_address);
        await this.page.type(Input.first_name, first_name);
        await this.page.type(Input.last_name, last_name);
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

}
