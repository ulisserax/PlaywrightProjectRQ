import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import Checkbox from "@b2e_objects/Checkbox";
import WebActions from "@lib/WebActions";
import { expect, Page , Browser} from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";

export default class B2eSearchPage {

    readonly page: Page;

    constructor(page:Page ){
        this.page = page;        
    }

    async searchDestination(destination: string){
        console.info(`Searching ${destination} ratecards`);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(600);
        await expect(await this.page.url()).toContain(`${ENV.B2E_URL}/b2e/search`);
        await this.page.type(Input.search_location, `${destination}`, {delay:30});
        await WebActions.delay(300);
        await this.page.locator(Element.destination_places).first().click();
        await this.page.click(Button.next);
    }

    async selectDates(){
        console.info(`Selecting start and end dates`);
        await this.page.click(Button.next_month);
        await WebActions.delay(300);
        await this.page.locator(Element.start_date).first().click();
        await WebActions.delay(300);
        await this.page.locator(Element.end_date).last().click();
        await this.page.click(Button.next);
    }

    async housingOptionsCorporate(){
        console.info(`Customizing the housing options`);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(600);
        await expect(await this.page.locator(Text.customize_housing_options).textContent()).toContain(`Customize your housing`);
        await this.page.click(Checkbox.include_hotels);
        await this.page.click(Button.plus_bedrooms);
        await this.page.click(Button.next);
    }

    async selectRatecard(){
        console.info(`Selecting first ratecard`);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(600);
        await this.page.locator(Button.ratecard_details).first().click();
        await WebActions.delay(1200);    
    }

   
}