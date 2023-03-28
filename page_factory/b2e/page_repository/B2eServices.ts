import { expect, Page } from '@playwright/test'
import Button from '@b2e_objects/Button';
import Text from '@b2e_objects/Text';
import Element from '@b2e_objects/Element';
import ENV from '@utils/env';
import WebActions from '@lib/WebActions';
const Chance = require ('chance');
const chance = new Chance();

export default class B2eServices {
    readonly page: Page
    
    constructor(page:Page){
        this.page = page;
    }

    async createNewServiceIssue(){
        console.info(`Creating a new Service Issue.`);
        await this.click_new_issue();
        await this.fillServiceIssue(`${ENV.SERVICE_DESCRIPTION}Guest`);
        await this.click_submit_service_issue();
        await this.verifyIssueSubmitted();
    }

    async click_new_issue(){
        console.info(`Click on the New Issue button.`);
        await WebActions.delay(500);
        await this.page.click(Button.new_issue);
    }

    async fillServiceIssue(issue_description: string){
        console.info(`filling the Service Issue form.`);
        await this.page.waitForSelector(Element.create_service_title);
        await this.page.type(Text.issue_description, issue_description);
    }

    async click_submit_service_issue(){
        console.info(`click on the submit service issue button.`);
        await this.page.click(Button.submit_service_issue);
        //await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(300);
    }

    async verifyIssueSubmitted(){
        console.info(`Verifying that the Service Issue was submitted.`);
        await this.page.waitForSelector(Element.issue_submitted_modal);
        await expect(await this.page.locator(Element.issue_submitted_modal).count()).toEqual(1);
        await this.page.click(Button.view_your_issues);
        await WebActions.delay(500);
        //await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Element.issue_status);
        await WebActions.delay(500);
        await expect(await this.page.locator(Element.service_issue_item(`${ENV.SERVICE_DESCRIPTION}`)).count()).toEqual(1)
    }

}