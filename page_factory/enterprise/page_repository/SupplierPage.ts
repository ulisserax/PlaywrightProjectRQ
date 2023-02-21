import {Page, expect} from '@playwright/test';
import Input from '@enterprise_objects/Input';
import Button from '@enterprise_objects/Button';
import Link from '@enterprise_objects/Link';
import Checkbox from '@enterprise_objects/Checkbox';
import Element from '@enterprise_objects/Element';
import Switch from '@enterprise_objects/Switch';
import WebActions from '@lib/WebActions';
import Area from './AreaPage';

const Chance = require("chance");
const chance = new Chance();

export default class Supplier {
    readonly page: Page;
    readonly area:Area;

    constructor(page: Page){
        this.page = page;
        this.area = new Area(page);
    }

    async approveSupplier(supplierName: string){
        console.info(`Find a Supplier by Company Name.`);
        await this.filterSupplierByName(supplierName);
        await this.verifySupplierFound(supplierName);
        await this.clickOnSupplierId();
        await this.verifySupplierOverview();
        await this.addSupplier();
        await this.verifySupplierAdded(supplierName);
    }

    async approveSupplierArea(areaName: string){
        console.info(`Approving a Supplier Area.`);
        await this.addArea();
        await this.approveArea(areaName);
        await this.verifyAreaApproved();
    }

    async editSupplierArea(){
        console.info(`Editing the Supplier Area Coverage`);
        await this.disableManualPush();
        await this.verifyManualPushUpdate();
    } 

    async addExceptionFeeAndReferralCommision(location: string){
        console.info(`Addding an Exception Fee and a Referral fee to the aproved Supplier`);
        await this.page.click(Element.supplier_referral_icon);
        await this.addExceptionFee(location);
        await this.verifyExpectionFee(location);
        await this.addDefaultReferralFee();
        await this.verifyDefaultReferralFee();
    }

    async createCustomArea(customAreaLocation: string, customAreaName: string){
        console.info(`Creating a Custom Area`);
        await this.page.click(Element.supplier_area_icon);
        await this.page.click(Button.create_area);
        await this.area.createNewArea(customAreaLocation, customAreaName);
        await this.area.validateCustomAreaCreated(customAreaName);
    }

    async addDefaultReferralFee(){
        console.info(`Click on the edit link in the Default Referral Fee box.`);
        await this.page.click(Link.default_referral_fee);
        await WebActions.delay(300);
        await this.page.fill(Input.default_referral_fee,'');
        await this.page.type(Input.default_referral_fee, `${chance.integer({ min: 11, max: 15 })}`, {delay: 50});
        await WebActions.delay(300);
        await this.page.keyboard.press('Enter');
        await WebActions.delay(300);
        await this.page.click(Button.save_default_referral);
    }

    async verifyDefaultReferralFee(){
        console.info(`Verifying that the default referral fee was successfully updated.`);
        await this.page.click(Element.supplier_referral_icon);
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator(Element.default_referral_fee)).not.toContainText('0.00');
    }

    async disableManualPush(){
        console.info(`Turn OFF the Manual Push for the approved Supplier.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Switch.manual_push);
        await WebActions.delay(300);
    }

    async verifyManualPushUpdate(){
        console.info(`Verifying that the manualPush was successfully updated.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await expect (await this.page.locator(Element.supplier_seting_updated)).toBeVisible();
        await this.page.click(Button.close);
        await WebActions.delay(300);
    }

    async addExceptionFee(location:string){
        console.info(`Adding an Exception Fee`);
        await this.page.click(Link.add_exception_fee);
        await this.page.waitForLoadState('networkidle');
        await expect (await this.page.locator(Element.supplier_fee_modal)).toBeVisible();
        await this.page.type(Input.referral_commision, `${chance.integer({ min: 5, max: 9 })}`, {delay: 40});
        await this.page.type(Input.desired_location, location, {delay: 60});
        await WebActions.delay(200);
        await this.page.locator(Link.desired_location).first().click();
        await this.page.keyboard.press('Enter');
        await this.page.click(Button.save_area_fee);
    }

    async verifyExpectionFee(location: string){
        console.info(`Verifying that the Exception Fee was successfully created.`);
        this.page.waitForLoadState('networkidle');
        await expect (await this.page.locator(`//table[@id='area_fee_list'] //td[text()='${location}']`)).toBeVisible();
    }

    async addArea(){
        console.info(`Clicking on the Area icon.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Element.supplier_area_icon);
        await WebActions.delay(300);
    }

    async approveArea(areaName){
        console.info(`Approving an Area.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle'); 
        await this.page.click(`(//a[text()='${areaName}']/parent::span/parent::div/preceding-sibling::i[@class='glyphicon glyphicon-unchecked'])`);
        await this.page.click(Button.area_right_arrow);
        await this.page.click(Button.confirm_area);
        await WebActions.delay(300);
    }

    async verifyAreaApproved(){
        console.info(`Verifying that the Area was successfully appproved.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await expect (await this.page.locator(Element.area_confirmation_title)).toBeVisible();
        await this.page.click(Button.modal_close);
        await WebActions.delay(300);
    }

    async filterSupplierByName(supplierName:string) {
        console.info(`Filter a Supplier by Name.`);
        await this.page.type(Input.supplier_filter, supplierName, {delay:60});
        await this.page.click(Button.search_supplier);
        await WebActions.delay(300);
    }

    async verifySupplierFound(supplierName: string) {
        console.info(`Verifying that the filtered Supplier was found.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await expect(await this.page.locator(`//td[text()='${supplierName}']`)).toHaveCount(1);
        await WebActions.delay(300);
    }

    async clickOnSupplierId(){
        console.info(`Click on the Supplier ID.`);
        await this.page.click(Link.supplier_id);
        await WebActions.delay(300);
    }

    async verifySupplierOverview(){
        console.info(`Verifying that navigated to the Supplier Overivew page.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(/\/add/);
    }

    async addSupplier(){
        console.info(`Clicking on the add this supplier Link.`);
        await this.page.click(Link.add_supplier);
    }

    async verifySupplierAdded(supplierName: string){
        console.info(`Verifying that the Supplier was successfully added.`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await expect (await this.page.locator(`//h1[contains(text(),'${supplierName}')]`)).toBeVisible();
        await WebActions.delay(300);
    }

}