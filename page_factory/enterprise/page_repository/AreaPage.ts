import { Page, expect } from "@playwright/test";
import Button from "@enterprise_objects/Button";
import Input from "@enterprise_objects/Input";
import WebActions from "@lib/WebActions";
import Element from "@enterprise_objects/Element";
import Link from "@enterprise_objects/Link";

export default class AreaPage {
    readonly page:Page;

    constructor (page:Page){
        this.page = page;
    }
async clickAddAnArea(): Promise<void>{
    console.info(`Clicking on the Add an Area button.`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.click(Button.add_an_area);
}

async createNewArea(location:string, areaName: string): Promise<void>{
    console.info(`filling the new area form.`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.type(Input.area_name, areaName, { delay:50 });
    await this.page.type(Input.area_location, location, { delay:70 });
    await WebActions.delay(600);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(Link.desired_location).first().click();
    await WebActions.delay(600);
    await this.page.keyboard.press('Enter');
    await WebActions.delay(600);
    await this.page.click(Button.submit);
}

async validateAreaCreated(areaName: string): Promise<void>{
    console.info(`Verifying that the Area is correctly created`);
    await WebActions.delay(600);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await expect (await this.page.locator(Element.areas_of_coverage)).toBeVisible();;
    await expect (await this.page.locator(`//a[contains(text(),'${areaName}')]`)).toBeVisible();
}

async validateCustomAreaCreated(areaName: string): Promise<void>{
    console.info(`Verifying that the Custom area was successfully created.`);
    await WebActions.delay(600);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await expect (await this.page.locator(Element.custom_area)).toBeVisible();;
    await expect (await this.page.locator(`//a[contains(text(),'${areaName}')]`)).toBeVisible();
}

}