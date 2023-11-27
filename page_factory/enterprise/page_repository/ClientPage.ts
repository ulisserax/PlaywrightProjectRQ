import Button from '@enterprise_objects/Button';
import Input from '@enterprise_objects/Input';
import Element from '@enterprise_objects/Element';
import { Page, expect } from '@playwright/test';
import WebActions from '@lib/WebActions';
import Checkbox from '@enterprise_objects/Checkbox';
import Link from '@enterprise_objects/Link';
import Dropdown from '@enterprise_objects/Dropdown';
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
                if (await (await this.page.$$(`//tr//td[text()='${location}']/../td[contains(.,'${suppliers[i]}')]`)).length == 0) 
                new_suppliers.push(suppliers[i]);
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
            await WebActions.delay(1000);
            for (var i=0; i<new_suppliers.length; i++) {
                await this.page.click(`//*[@id="parent_form_name"]/div/label/span[contains(.,'Directed')]/..//following-sibling::div`);
                await this.page.locator('body').getByRole('document').getByText(new_suppliers[i]).click();
                await this.page.click(`//*[@id="parent_form_name"]/div/label/span[contains(.,'Directed')]/..//following-sibling::div`);
                await WebActions.delay(300);
            }
            await WebActions.delay(300);
            await this.page.click(Button.save_client_directed_area);
            await WebActions.delay(1000);
            await expect(await this.page.locator(Element.notificationModal('Created')).count()).toBeGreaterThan(0);
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
        for (let i=0; i<num; i++) {
            console.info(`Removing area ${i}`);
            await this.page.locator(Link.remove_directed_area).nth(i).click();;
            await WebActions.delay(500);
            await this.page.click(Button.remove);
            await WebActions.delay(500);
            await this.page.waitForLoadState(`networkidle`);
            await this.page.waitForLoadState(`domcontentloaded`);
            await expect (await this.page.locator(`.spinner`)).toBeHidden();
            await WebActions.delay(500);
        }
    }

    async createClientDirectedAllAreaInclude(supplier: string) {
        console.info(`Creating a Client Directed - All Area include`);
        await WebActions.delay(1000);
        if (await this.page.locator(Element.clientDirectedRemoveIncludeAllArea(supplier)).count()>0){
            await WebActions.delay(1000);
            await this.page.click(Element.clientDirectedRemoveIncludeAllArea(supplier));
        }   
        
        await this.page.click(Dropdown.select_include_supplier);
        await this.page.click(Dropdown.includeSupplier(supplier));
        await this.page.keyboard.press('Escape');
        await this.page.keyboard.press('Tab');
        await WebActions.delay(1000);
        console.info(`Validating the saved confirmation modal was displayed.`);
        await this.page.waitForSelector(Element.notificationModal('Saved'));
        await expect(await this.page.locator(Element.notificationModal('Saved')).count()).toBeGreaterThan(0);
    }

    async createClientDirectedAllAreaExclude(supplier: string) {
        console.info(`Creating a Client Directed - All Area exclude`);
        await WebActions.delay(1000);
        if (await this.page.locator(Element.clientDirectedRemoveExcludeAllArea(supplier)).count()>0){
            await WebActions.delay(1000);
            await this.page.click(Element.clientDirectedRemoveExcludeAllArea(supplier));
        }   
        
        await this.page.click(Dropdown.select_exclude_supplier);
        await this.page.click(Dropdown.excludeSupplier(supplier));
        await this.page.keyboard.press('Escape');
        await this.page.keyboard.press('Tab');
        await WebActions.delay(1000);
        console.info(`Validating the saved confimration modal was displayed.`);
        await this.page.waitForSelector(Element.notificationModal('Saved'));
        await expect(await this.page.locator(Element.notificationModal('Saved')).count()).toBeGreaterThan(0);
    }

    async createClientByAreaDirectedIncludedAndExcludedSupplier(location: string, included_supplier: string, excluded_supplier: string) {
        console.info(`Creating a Client Direct by Area rule for ${location}.`);
        await WebActions.delay(2500);
        let count = await this.page.locator(Link.remove_directed_area).count();
        console.info(count);
        if (count>0){
            for (let i=count-1; i>=0; i--){
                console.info(`Removing area ${i}`);
                await this.page.locator(Link.remove_directed_area).nth(i).click();;
                await WebActions.delay(500);
                await this.page.click(Button.remove);
                await WebActions.delay(500);
                await this.page.waitForLoadState(`networkidle`);
                await this.page.waitForLoadState(`domcontentloaded`);
            }
        } 
            await this.page.click(Link.add_client_direct_area);
            await this.page.type(Input.client_area_name, location);
            await this.page.type(Input.client_area_location, location);
            await WebActions.delay(500);
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForLoadState('networkidle');
            await this.page.locator(Link.desired_location).first().click();
            await WebActions.delay(500);
            //await this.page.keyboard.press('Enter');
            await WebActions.delay(1000);
            await this.page.click(Dropdown.modal_include_supplier);
            await this.page.click(Dropdown.includeSupplierModal(included_supplier));
            await this.page.click(Dropdown.modal_include_supplier);
            //await this.page.keyboard.press('Escape');
            //await this.page.keyboard.press('Tab');
            await this.page.click(Dropdown.modal_exclude_supplier);
            await this.page.click(Dropdown.excludeSupplierModal(excluded_supplier));
            //await this.page.keyboard.press('Escape');
            //await this.page.keyboard.press('Tab');
            await WebActions.delay(1000);
            await this.page.click(Button.save_client_directed_area);
            await WebActions.delay(1500);
            await this.page.waitForSelector(Element.notificationModal('Created'));
            await expect(await this.page.locator(Element.notificationModal('Created')).count()).toBeGreaterThan(0);
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForLoadState('domcontentloaded');
            //await this.page.waitForSelector(`//tr//td[text()='${location}']/../td`);
            await WebActions.delay(1000);
            console.info(`${location} was created!`)        
        
    }

    async removeClientDirectedAllAreasIncludedSupplier(included_supplier:string) {
        console.info(`clicking on Remove existed client directed all areas for included supplier`);
        await WebActions.delay(1000);
        await this.page.click(Element.clientDirectedRemoveIncludeAllArea(included_supplier));
        await this.page.keyboard.press('Tab');
        console.info(`Validating the saved confirmation modal was displayed.`);
        await WebActions.delay(1000);
        await this.page.waitForSelector(Element.notificationModal('Saved'));
        await expect(await this.page.locator(Element.notificationModal('Saved')).count()).toBeGreaterThan(0);
    }

    async removeClientDirectedAllAreasExcludedSupplier(excluded_supplier:string) {
        console.info(`clicking on Remove existed client directed all areas for excluded supplier`);
        await WebActions.delay(1000);
        await this.page.click(Element.clientDirectedRemoveExcludeAllArea(excluded_supplier));
        await this.page.keyboard.press('Tab');
        console.info(`Validating the saved confirmation modal was displayed.`);
        await WebActions.delay(1000);
        await this.page.waitForSelector(Element.notificationModal('Saved'));
        await expect(await this.page.locator(Element.notificationModal('Saved')).count()).toBeGreaterThan(0);
    }

    async EditExistingClientDirectedAreas(area_name: string, directed_supplier: string, excluded_supplier:string) {
        console.info(`Editing the existed direct area.`);
        await WebActions.delay(1000);
        await this.page.locator(Link.edit_directed_area).nth(0).click();
        await this.page.fill(Input.client_area_name,'');
        await this.page.type(Input.client_area_name, area_name);
        await this.page.click(Element.removingDirectedSupplier(directed_supplier));
        await this.page.click(Element.removingExcludedSupplier(excluded_supplier));
        await WebActions.delay(1000);
        await this.page.click(Dropdown.modal_include_supplier);
        await this.page.click(Dropdown.includeSupplierModal(excluded_supplier));
        await this.page.click(Dropdown.modal_include_supplier);
        await this.page.click(Dropdown.modal_exclude_supplier);
        await this.page.click(Dropdown.excludeSupplierModal(directed_supplier));
        await WebActions.delay(1000);
        await this.page.click(Checkbox.send_to_supplier_network);
        await this.page.click(Button.save_client_directed_area);
        await WebActions.delay(1500);
        await this.page.waitForSelector(Element.notificationModal('Saved'));
        await expect(await this.page.locator(Element.notificationModal('Saved')).count()).toBeGreaterThan(0);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        //await this.page.waitForSelector(`//tr//td[text()='${location}']/../td`);
        await WebActions.delay(1000);
        console.info(`${area_name} was Updated!`)
    }

    async validatingClientDirectedArea(area_name:string, send_to_network:string, directed_supplier:string, excluded_supplier:string){
        console.info(`Validating client directed area with name '${area_name}', send to network '${send_to_network}', directed supplier '${directed_supplier}' and exluded supplier '${excluded_supplier}'`);
        await WebActions.delay(2000);
        await this.page.waitForSelector(Element.clientDirectedArea(area_name, send_to_network, directed_supplier, excluded_supplier));
        await expect(await this.page.locator(Element.clientDirectedArea(area_name, send_to_network, directed_supplier, excluded_supplier)).isVisible()).toBeTruthy();
    }

}

