import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import Checkbox from "@b2e_objects/Checkbox";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";
import Link from "@b2e_objects/Link";
import Dropdown from "@b2e_objects/Dropdown";
const Chance = require ('chance');
const chance = new Chance();

export default class B2eSearchPage {

    readonly page: Page;

    constructor(page:Page ){
        this.page = page;        
    }

    async validateUrl(url: string){
        console.info(`Validate url`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(1900);
        await expect(await this.page.url()).toContain(url);
    }

    async newSearch(){
        console.info(`Clicking in the new search`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(1900);
        await this.page.click(Link.new_search);
    }

    async searchDestination(destination: string): Promise<void>{
        console.info(`Searching ${destination} ratecards`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(1000);
        await this.page.waitForSelector(Input.search_location);
        await this.page.type(Input.search_location, `${destination}`, {delay:150});
        await this.page.waitForSelector(Element.destination_places);
        await this.page.locator(Element.destination_places).first().click();
        await WebActions.delay(500);
        await this.page.click(Button.next);
    }

    async selectDates(): Promise<void>{
        console.info(`Selecting start and end dates`);
        await this.page.click(Button.next_month);
        await this.page.locator(Element.start_date).first().click();
        await this.page.locator(Element.end_date).nth(1).click();
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

    async hotelOptions(): Promise<void>{
        console.info(`Customizing the housing options`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await expect(await this.page.locator(Text.customize_housing_options).textContent()).toContain(`Customize your housing`);
        await this.page.click(Checkbox.include_corporate_apartment);
        await this.page.click(Button.plus_adults);
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
        ENV.PROPERTY_ADDRESS = await this.page.context().pages()[1].locator(Text.property_address).textContent();
        console.log(ENV.PROPERTY_NAME);
        console.log(ENV.PROPERTY_ADDRESS.trim());  
    }

    async selectHotel(): Promise<void>{
        console.info(`Selecting a random hotel`);
        await this.page.waitForLoadState(`domcontentloaded`);
        //await this.page.waitForLoadState(`networkidle`);
        await WebActions.delay(2000);
        let hotel_count = await this.page.locator(Button.hotel_details).count();
        console.info(hotel_count);
        let hotel_selected = chance.integer({min:0, max:hotel_count-1});
        console.log(hotel_selected);
        await this.page.locator(Button.hotel_details).nth(hotel_selected).click();
        await WebActions.delay(1000); 
        let currentPage = await this.page.url();
        ENV.REQUEST_ID = await WebActions.getRequestId(currentPage);
        ENV.PROPERTY_NAME = await this.page.context().pages()[1].locator(Text.property_name).textContent();
        ENV.PROPERTY_ADDRESS = await (await this.page.context().pages()[1].locator(Text.property_address).textContent()).trim();
        console.log(ENV.PROPERTY_NAME);
        console.log(ENV.PROPERTY_ADDRESS);  
    }

    async viewAllQuests(){
        console.info(`Clicking on Quests`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(600);
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
        await WebActions.delay(400);
        await this.page.click(Button.book_alternate_option);
        
    }

    async requestedOptions(){
        console.info(`Viewing requested options`);
        await this.page.waitForSelector(Button.requested_options);
        await expect(await this.page.locator(Button.requested_options).count()).toEqual(1);
        await this.page.click(Button.requested_options);
    }

    async requestAgain(){
        console.info(`Requesting ratecard again`);
        await this.page.waitForSelector(Button.request_again);
        await expect(await this.page.locator(Button.request_again).count()).toEqual(1);
        await this.page.click(Button.request_again);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async sort(by: string){
        console.info(`Sorting properties result by: '${by}'`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.hotel_details);
        await WebActions.delay(2500);
        await this.page.click(Button.sort);
        await WebActions.delay(300);
        await this.page.click(Text.sortBy(by));
        await WebActions.delay(500);
    }

    async openProfile(){
        console.info(`Openning the user profile`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Dropdown.user_name);
        await this.page.click(Dropdown.user_name);
        await this.page.click(Link.profile);
        await WebActions.delay(300);
    }

    async searchPropertyName(property_name:string){
        console.info(`Searching property by Name`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(1200);
        await this.page.type(Input.search_property_name, property_name, {delay:100});
        await WebActions.delay(1000);
    }

    async filterByBrand(brand_name:string){
        console.info(`Filtering property by brand`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.click(Element.plus_icon_brands);
        await this.page.click(Link.uncheck_all);
        await this.page.click(Checkbox.brand_name(brand_name));
        await this.page.click(Button.apply_filters);
    }

    async selectNewHotel(exclude: Array<number>): Promise<void>{
        console.info(`Selecting a random hotel`);
        await this.page.waitForLoadState(`domcontentloaded`);
        //await this.page.waitForLoadState(`networkidle`);
        await WebActions.delay(2000);
        let hotel_count = await this.page.locator(Button.hotel_details).count();
        console.info(hotel_count);
        await this.page.locator(Button.hotel_details).nth(chance.integer({min:1, max:hotel_count})).click();
        await WebActions.delay(1000); 
        let currentPage = await this.page.url();
        ENV.REQUEST_ID = await WebActions.getRequestId(currentPage);
        ENV.PROPERTY_NAME = await this.page.context().pages()[1].locator(Text.property_name).textContent();
        ENV.PROPERTY_ADDRESS = await (await this.page.context().pages()[1].locator(Text.property_address).textContent()).trim();
        console.log(ENV.PROPERTY_NAME);
        console.log(ENV.PROPERTY_ADDRESS);  
    }

   
}