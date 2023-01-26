import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import Checkbox from "@b2e_objects/Checkbox";
import WebActions from "@lib/WebActions";
import { expect, Page , Browser} from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";
import Link from "@b2e_objects/Link";

export default class B2eSearchPage {

    readonly page: Page;

    constructor(page:Page ){
        this.page = page;        
    }

    async searchDestination(destination: string): Promise<void>{
        console.info(`Searching ${destination} ratecards`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(400);
        await expect(await this.page.url()).toContain(`${ENV.B2E_URL}/b2e/search`);
        await this.page.waitForSelector(Input.search_location);
        await this.page.type(Input.search_location, `${destination}`, {delay:30});
        await this.page.waitForSelector(Element.destination_places);
        await this.page.locator(Element.destination_places).first().click();
        await this.page.click(Button.next);
    }

    async selectDates(): Promise<void>{
        console.info(`Selecting start and end dates`);
        await this.page.click(Button.next_month);
        await this.page.locator(Element.start_date).first().click();
        await this.page.locator(Element.end_date).last().click();
        await this.page.click(Button.next);
    }

    async housingOptionsCorporate(): Promise<void>{
        console.info(`Customizing the housing options`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await expect(await this.page.locator(Text.customize_housing_options).textContent()).toContain(`Customize your housing`);
        await this.page.click(Checkbox.include_hotels);
        await this.page.click(Button.plus_bedrooms);
        await this.page.click(Button.next);
    }

    async selectRatecard(): Promise<void>{
        console.info(`Selecting first ratecard`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.locator(Button.ratecard_details).first().click();
        await WebActions.delay(1200);  
        let currentPage = await this.page.url();
        ENV.REQUEST_ID = await WebActions.getRequestId(currentPage);
        ENV.PROPERTY_NAME = await this.page.context().pages()[1].locator(Text.property_name).textContent();
        ENV.PROPERTY_ADDRESS = await this.page.context().pages()[1].locator(Text.proeprty_address).textContent();
        console.log(ENV.PROPERTY_NAME);
        console.log(ENV.PROPERTY_ADDRESS.trim());  
    }

    async viewAllQuests(){
        console.info(`Clicking on Quests`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Link.quests);
        await this.page.click(Link.quests);
    }

    async optionReceived(){
        console.info(`Accepting the received option`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector(Element.new_option_modal);
        await expect(await this.page.locator(Element.new_option_modal).count()).toEqual(1);
        await this.page.click(Button.continue);
        await WebActions.delay(600);
        await this.page.waitForLoadState('domcontentloaded');
        await WebActions.delay(500);
        await this.page.waitForSelector(Button.new);
        await this.page.click(Button.new);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async bookingAlternateOption(){
        console.info(`Start booking the alternate option`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector(Element.alternate_option_card);
        await expect(await this.page.locator(Element.alternate_option_card).count()).toEqual(1);
        await expect(await this.page.locator(Element.unavailable_option_card).count()).toEqual(1);
        await this.page.click(Button.book_alternate_option);
        
    }

   
}