import Button from "@enterprise_objects/Button";
import Checkbox from "@enterprise_objects/Checkbox";
import Dropdown from "@enterprise_objects/Dropdown";
import Element from "@enterprise_objects/Element";
import Link from "@enterprise_objects/Link";
import Text from "@enterprise_objects/Text";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Input from "../object_repository/Input";
const Chance = require ('chance');
const chance = new Chance();

export default class OptionPage {

   readonly page: Page;

   constructor(page:Page){
      this.page = page;
   }
   
   async fillNewProperty(location:string, background_req:string, room_types:string ){
      
   }
     
}