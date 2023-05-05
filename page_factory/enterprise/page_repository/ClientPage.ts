import Button from '@enterprise_objects/Button';
import Input from '@enterprise_objects/Input';
import Element from '@enterprise_objects/Element';
import { Page, expect } from '@playwright/test';
import WebActions from '@lib/WebActions';
import Checkbox from '@enterprise_objects/Checkbox';
import Link from '@enterprise_objects/Link';
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

    async editClientSupplierManagement() {
        console.info(`Clicking on the client_supplier_management icon.`)
        await this.page.click(Element.client_supplier_management);
        await WebActions.delay(300);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');

    }

    async waitForLoadAreaList() {
        await WebActions.delay(1000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await WebActions.delay(2000);
    }
    async createClientByAreaDirected(location: string, suppliers: string[]) {
        console.info(`Creating a Client Direct by Area rule for ${location}.`);
        let added = 0;
        let new_suppliers = [];
        for (let i = 0 ; i < suppliers.length ; i++){
                if (await (await this.page.$$(`//tr//td[text()='${location}']/../td[contains(.,'${suppliers[i]}')]`)).length == 0) new_suppliers.push(suppliers[i]);
                console.info(new_suppliers);
        }
        if (new_suppliers.length > 0) {
            await this.page.click(Link.add_client_direct_area);
            await this.page.type(Input.client_area_name, location);
            await this.page.type(Input.client_area_location, location);
            await WebActions.delay(500);
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForLoadState('networkidle');
            await this.page.locator(Link.desired_location).first().click();
            await WebActions.delay(500);
            await this.page.keyboard.press('Enter');
            await WebActions.delay(500);
            for (var i=0; i<new_suppliers.length; i++) {
                await this.page.click(`//*[@id="parent_form_name"]/div/label/span[contains(.,'Directed')]/..//following-sibling::div`);
                await this.page.locator('body').getByRole('document').getByText(new_suppliers[i]).click();
                await this.page.click(`//*[@id="parent_form_name"]/div/label/span[contains(.,'Directed')]/..//following-sibling::div`);
                await WebActions.delay(300);
            }
            await WebActions.delay(300);
            await this.page.click(Button.save_client_directed_area);
            await WebActions.delay(1000);
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForSelector(`//tr//td[text()='${location}']/../td`);
            await WebActions.delay(1000);
            for (let i=0;i<new_suppliers.length;i++){
                if (await (await this.page.$$(`//tr//td[text()='${location}']/../td[contains(.,'${new_suppliers[i]}')]`)).length > 0) added++;
            }
            await expect (await added).toEqual(new_suppliers.length);
            console.info(`${location} was created!`)        
        }
    }

    async removeExistingClientDirectedAreas() {
        console.info(`clicking on Remove`);
        await WebActions.delay(1000);
        var num = await this.page.locator(Link.action_remove).count();
        num=+num;
        console.info(+num);
        for (let i=num; i>0; i--) {
            console.info(Link.remove(i));
            await this.page.click(Link.remove(i));
            await WebActions.delay(500);
            await this.page.click(Button.remove);
            await WebActions.delay(500);
            await this.page.waitForLoadState(`networkidle`);
            await this.page.waitForLoadState(`domcontentloaded`);
            await expect (await this.page.locator(`.spinner`)).toBeHidden();
            await WebActions.delay(500);
        }
    }

}