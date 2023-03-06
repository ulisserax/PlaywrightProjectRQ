import Button from "@enterprise_objects/Button";
import Dropdown from "@enterprise_objects/Dropdown";
import Link from "@enterprise_objects/Link";
import Text from "@enterprise_objects/Text";
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

    async fillServiceIssueInformation(): Promise<void>{
        console.info('Filling service issue information');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.selectOption(Dropdown.service_issue_type, {value: `${chance.integer({min:1, max:20})}`});
        await this.page.type(Textarea.describe_issue, 'service issue for testing purpose', {delay:20});
        await WebActions.delay(300);
        await this.page.click(Button.create_new_service_issue);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async resolveServiceIssue(): Promise<void>{
        console.info(`Resolving service issue`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.click(Link.add_a_comment);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.type(Textarea.new_comment, 'service issue for testing purpose is now resolved.', {delay: 50});
        await this.page.click(Button.save_comment);
        await WebActions.delay(800);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.selectOption(Dropdown.issue_status, {value:'RESOLVED'});
        await WebActions.delay(1000);
        await this.page.click(Button.update_service_issue);
        await WebActions.delay(1000);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(await this.page.locator(Text.service_issue_resolved).textContent()).toEqual('RESOLVED');
    }

}