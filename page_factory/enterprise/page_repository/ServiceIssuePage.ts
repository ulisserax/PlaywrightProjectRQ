import Button from "@enterprise_objects/Button";
import Checkbox from "@enterprise_objects/Checkbox";
import Dropdown from "@enterprise_objects/Dropdown";
import Textarea from "@enterprise_objects/Textarea";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
const Chance = require ('chance');
const chance = new Chance();


export default class ServiceIssuePage {
    readonly page: Page;

    constructor(page){
        this.page = page;
        
    }

    async fillServiceIssueInformation(){
        console.info('Filling service issue information');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.selectOption(Dropdown.service_issue_type, {value: `${chance.integer({min:1, max:20})}`});
        await this.page.type(Textarea.describe_issue, 'service issue for testing purpose', {delay:100});
        await WebActions.delay(300);
        await this.page.click(Button.create_new_service_issue);
        await this.page.waitForLoadState('domcontentloaded');
    }
}