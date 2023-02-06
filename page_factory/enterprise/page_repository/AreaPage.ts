import { Page, expect } from "@playwright/test";
import Button from "@enterprise_objects/Button";
import Input from "@enterprise_objects/Input";
import WebActions from "@lib/WebActions";
import Element from "@enterprise_objects/Element";

export default class Area {
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
    await this.page.type(Input.area_location, location, { delay:50 });
    await this.page.keyboard.press('ArrowDown');
    await WebActions.delay(600);
    await this.page.keyboard.press('Tab');
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

}