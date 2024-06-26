import Button from "@enterprise_objects/Button";
import Dropdown from "@enterprise_objects/Dropdown";
import Link from "@enterprise_objects/Link";
import Textarea from "@enterprise_objects/Textarea";
import WebActions from "@lib/WebActions";
import { Page } from "@playwright/test";
import ENV from "@utils/env";
import Input from "../object_repository/Input";
import Element from "@enterprise_objects/Element";
import OptionPage from "./OptionPage";
const Chance = require ('chance');
const chance = new Chance();

export default class PropertyPage {

   readonly page: Page;
   readonly optionPage: OptionPage;

   constructor(page:Page){
      this.page = page;
      this.optionPage = new OptionPage(page);
   }
   
   async fillPropertyOverview(property_name:string, location:string, background_req:string, air_conditioning:string, room_types:string, pet_policy:string ): Promise<void>{
      console.info(`Filling the property overview`);
      let number = chance.integer({min:1,max:9999});
      await this.page.type(Input.property_name, `${property_name}_${number}${chance.word({ length: 2 })}`);
      await this.page.type(Input.property_location, `${location}`, {delay:60});
      await this.page.waitForLoadState('networkidle');
      await this.page.keyboard.press('ArrowDown');
      await WebActions.delay(600);
      await this.page.keyboard.press('Tab');
      await WebActions.delay(600);
      await this.page.type(Input.property_number, `#${number}`,{delay:30});
      await this.page.selectOption(Dropdown.background_req, {label:`${background_req}`});
      await this.page.selectOption(Dropdown.select_air_conditioning, {label:`${air_conditioning}`});
      await WebActions.delay(400);
      await this.page.click(Input.property_room_types)
      await this.page.type(Input.property_room_types, `${room_types}`, {delay:30});
      await this.page.keyboard.press('Enter');
      await this.page.selectOption(Dropdown.select_pet_policy, {label:`${pet_policy}`});
      if(pet_policy=='Pet Friendly'){
         await this.page.type(Textarea.pet_restictions, `max 50 pounds pets`, {delay:30});
      }
      await this.page.type(Input.property_description, "This is a Property created by the Automation Project and it'll be used for for testing purposes only")
      await this.page.type(Input.property_features, "This is a Property created by the Automation Project and it'll be used for for testing purposes only")
      await this.page.type(Input.property_amenities, "This is a Property created by the Automation Project and it'll be used for for testing purposes only")
   }

   async cancellationAndTaxFeePolicy(): Promise<void>{
      console.info(`Selecting cancellation and tax fee policies`);
      await this.page.selectOption(Dropdown.cancellation_policy, {index:1});
      await this.page.selectOption(Dropdown.tax_fee_policy, {index:1});
   }
   
   async createNewProperty(): Promise<void>{
      console.info(`Creating the new property`);
      await this.page.click(Button.create_property);
      await this.page.click(Button.close);

   }

   async clickAddProperty(): Promise<void>{
      console.info(`Clicking on the Add Property button`);
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.click(Button.add_property);
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');
   }

   async addImage(image_path:string): Promise<void>{
      console.info(`Adding property images`); 
      await this.page.waitForLoadState('domcontentloaded');
      for(let i = 0; i < 3; i++){
          await this.page.click(Button.add_image);
          await WebActions.delay(300);
          await this.page.setInputFiles(Input.image_upload_file, `${image_path}`);
          await this.page.click(Button.crop_and_use);
          await this.page.waitForLoadState('networkidle');
          await this.page.waitForSelector(Element.insert_image_modal, {state: 'hidden'});
      }
   }
   
   async editProperty(){
      console.info(`Editing property`);
      let number = chance.integer({min:1,max:9999});
      ENV.PROPERTY_DESCRIPTION = chance.sentence();
      ENV.PROPERTY_FEATURES = chance.sentence();
      ENV.PROPERTY_AMENITIES = chance.sentence();
      ENV.PROPERTY_NAME = `nt1sup_property_#_${number}${chance.character({ alpha: true , casing: 'lower'})}`;

      await this.page.locator(Link.edit_property).first().click();
      await this.page.fill(Input.property_name,'');
      await this.optionPage.addPropertyImages(ENV.IMAGE_PATH);
      await this.page.type(Input.property_name, ENV.PROPERTY_NAME, {delay: 50});
      await this.page.fill(Input.property_number,'');
      await this.page.type(Input.property_number,`#${number}`, {delay:40});
      await this.page.fill(Input.property_description, '');
      await this.page.fill(Input.property_features, '');
      await this.page.fill(Input.property_amenities, '');
      await this.page.type(Input.property_description, `${ENV.PROPERTY_DESCRIPTION}`);
      await this.page.type(Input.property_features, `${ENV.PROPERTY_FEATURES}`);
      await this.page.type(Input.property_amenities, `${ENV.PROPERTY_AMENITIES}`);
      await this.optionPage.fillContactInformation(`${ENV.SUPPLIER_ADMIN}`);
      await this.page.click(Button.update_property);
      await this.page.click(Button.close);
      await WebActions.delay(2000);
   }
}