import Button from '@enterprise_objects/Button';
import Input from '@enterprise_objects/Input';
import Element from '@enterprise_objects/Element';
import { Page, expect } from '@playwright/test';
import WebActions from '@lib/WebActions';
import Checkbox from '@enterprise_objects/Checkbox';
const Chance = require("chance");
const chance = new Chance();

export default class ClientPage {
    readonly page: Page;
    readonly webActions: WebActions;

    constructor (page:Page) {
        this.page = page;
        this.webActions = new WebActions(page); 
    }

    async fillNewClientForm(clientName:string){
        console.info(`Filling the Client form`);
        await this.page.type(Input.client_name, clientName);
    }

    async saveNewClient() {
        console.info(`Saving the new Client`);
        await this.page.click(Button.save_client);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyClientCreation(clientName: string) {
        console.info(`Verifying that the Client was successfully created.`);
        await expect (await this.page.locator(Element.client_form_title)).toContainText(clientName);
    }

    async editClientSettings() {
        console.info(`Editing some client's settings.`);
        await this.page.click(Element.client_settings);
        await WebActions.delay(300);
        await (await this.page.waitForSelector(Button.update_client)).isVisible();
        await this.page.click(Checkbox.show_company);
        await this.page.click(Checkbox.guest_can_award);
        await this.page.type(Input.client_default_notice, `${chance.integer({ min: 5, max: 10 })}` );  
        await this.page.click(Button.update_client);
        await WebActions.delay(300);
        await this.page.waitForLoadState('networkidle');
    }

    async verifyClientSettings() {
        console.info(`Verifying that the Client settings were successfully updated.`);
        await this.webActions.refresh(); 
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Element.client_settings);
        await WebActions.delay(300);
        await (await this.page.waitForSelector(Button.update_client)).isVisible();
        await expect (await this.page.locator(Checkbox.show_company).isChecked()).toBeFalsy();
        await expect (await this.page.locator(Checkbox.guest_can_award).isChecked()).toBeTruthy();
        await expect (await this.page.locator(Input.client_default_notice)).not.toBeEmpty();
        await this.page.click(Element.client_details);
        await WebActions.delay(300);
        await (await this.page.waitForSelector(Button.update_client)).isVisible();
    }

    async duplicateClient(duplicatedClientName) {
        console.info(`Duplicating a Client.`);
        await this.page.click(Button.duplicate_client);
        await this.page.fill(Input.duplicated_client_name,'');
        await this.page.type(Input.duplicated_client_name, `Duplicated_${duplicatedClientName}`);
        await this.page.click(Button.modal_duplicate_client);
        await WebActions.delay(300);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyClientDuplicatedSuccessfully() {
        console.info(`Verifying that the Client was successfully Duplicated.`);
        await WebActions.delay(300);
        await (await this.page.waitForSelector(Button.update_client)).isVisible();
    }

}