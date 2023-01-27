import { Page, expect } from "@playwright/test";
import Text from "@enterprise_objects/Text";
import Input from "@enterprise_objects/Input";
import ENV from "@utils/env";
import Button from "@enterprise_objects/Button";

const Chance = require("chance");
const chance = new Chance();

export default class Registration {
    readonly page: Page;

    constructor(page: Page) {
    this.page = page;
    }

    async verifySupplierRegistrationPage(): Promise<void> {
        console.info(`Verifying that the Supplier Registration page loaded`);
        await expect(await this.page.locator(Text.supplier_registration)).toBeVisible();
    }

    async fillSupplierRegistrationForm(): Promise<void> {
        console.info(`Filling the Supplier registration form`);
        await this.page.type(Input.title, `Supplier Admininstrator`);
        await this.page.type(Input.reg_password, ENV.SUPPLIER_ADMIN_PASSWORD);
        await this.page.type(Input.reg_repeat_password, ENV.SUPPLIER_ADMIN_PASSWORD);
        await this.page.type(Input.notification_email, `notification@${ENV.SUPPLIER_COMPANY}.com`);
        await this.page.type(Input.company_phone, chance.phone({ formatted: false }));
        await this.page.click(Button.create_account);
    }

    async verifyRegistrationCompleted(): Promise<void> {
        console.info(`Verifying that the account registration was completed`);
        await expect(await this.page.locator(Text.registration_complete)).toBeVisible();
    }

    async generateSupplierData(): Promise<void> {
        ENV.SUPPLIER_COMPANY = `auto-supplier-company-${chance.string({length: 6, casing: "lower", numeric: true,})}`;
        ENV.SUPPLIER_ADMIN = `supplieradminuser@${ENV.SUPPLIER_COMPANY}.com`;
    }

}
