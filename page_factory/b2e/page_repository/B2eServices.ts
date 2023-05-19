import { expect, Page } from '@playwright/test'
import Button from '@b2e_objects/Button';
import Text from '@b2e_objects/Text';
import Textarea from '@b2e_objects/Textarea';
import Element from '@b2e_objects/Element';
import WebActions from '@lib/WebActions';


export default class B2eServices {
    readonly page: Page
    readonly webAction: WebActions;
    
    constructor(page:Page){
        this.page = page;
        this.webAction = new WebActions(page);
    }

    async createNewServiceIssue(description: string): Promise<void> {
        console.info(`Creating a new Service Issue.`);
        await this.click_new_issue();
        await this.fillServiceIssue(description);
        await this.click_submit_service_issue();
        await this.verifyIssueSubmitted(description);
    }

    async click_new_issue(): Promise<void> {
        console.info(`Click on the New Issue button.`);
        await WebActions.delay(500);
        await this.page.click(Button.new_issue);
    }

    async fillServiceIssue(issue_description: string): Promise<void> {
        console.info(`filling the Service Issue form.`);
        await this.page.waitForSelector(Element.create_service_title);
        await this.page.type(Text.issue_description, `Service Issue for testing purpose - ${issue_description}`, {delay:20});
    }

    async click_submit_service_issue(): Promise<void> {
        console.info(`click on the submit service issue button.`);
        await this.webAction.clickElementJS(Button.submit_service_issue);
        //await this.page.waitForLoadState(`networkidle`);
        await WebActions.delay(500);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(1500);
    }

    async verifyIssueSubmitted(description: string): Promise<void> {
        console.info(`Verifying that the Service Issue was submitted.`);
        await WebActions.delay(1000);
        await this.page.waitForSelector(Element.issue_submitted_modal);
        await expect(await this.page.locator(Element.issue_submitted_modal).count()).toEqual(1);
        await this.page.click(Button.view_your_issues);
        await WebActions.delay(500);
        //await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Element.issue_status);
        await WebActions.delay(500);
        await this.verifyServiceDescriptionOnList(description);
    }

    async verifyServiceDescriptionOnList(description: string): Promise<void> {
        console.info(`Verifying that the service Issue description is present.`);
        await WebActions.delay(300);
        //await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(2000);
        await this.page.waitForSelector(Element.service_issue_item(description));
        await expect(await this.page.locator(Element.service_issue_item(description)).count()).toEqual(1);
        await WebActions.delay(2000);
    }

    async openServiceItem(description: string): Promise<void> {
        console.info(`Click on the Service Issue item to open it up.`);
        await this.page.click(Element.service_issue_item(description));
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        //await this.page.waitForLoadState(`networkidle`);
        await WebActions.delay(500);
    }

    async submitService(): Promise<void> {
        console.info(`Click on the submit button.`);
        await this.page.click(Button.submit_comment);
    }

    async validateCommentsubmitted(): Promise<void> {
        console.info(`Validating the Service Comment was submitted.`);
        await this.page.waitForSelector(Element.comment_modal);
        await expect(await this.page.locator(Button.modal_close).count()).toEqual(1);
        await this.page.click(Button.modal_close);
        await WebActions.delay(500);
    }
    
    async closeServiceItem(): Promise<void> {
        console.info(`Closing the Service Issue List view.`);
        await this.page.click(Element.close_services_list);
    }

    async addServiceComment(user: string, description: string): Promise<void> {
        console.info(`Adding a Service Issue comment.`);
        await this.openServiceItem(description);
        await this.page.type(Textarea.service_issue_comment, `Comment added by ${user} for the ${description}`, {delay:30});
        await this.submitService();
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        //await this.page.waitForLoadState(`networkidle`);
        await WebActions.delay(500);
        await this.validateCommentsubmitted();
        await this.closeServiceItem();
    }

    async markAsResolved(): Promise<void> {
        console.info(`Clicking on the - Mark as Resolved - button.`);
        await this.page.click(Button.mark_as_resolved);
        await WebActions.delay(500);
        await this.page.waitForSelector(Element.are_you_sure_modal);
        await this.page.click(Button.resolved_confirmation);
        await WebActions.delay(1000);
        await this.page.waitForLoadState(`domcontentloaded`);
        //await this.page.waitForLoadState(`networkidle`);
        await WebActions.delay(2000);
    }

    async verifyServiceResolved(description: String): Promise<void> {
        console.info(`Verifying if the Servie Issue status is Resolved.`);
        await WebActions.delay(1000);
        await this.page.waitForLoadState(`domcontentloaded`);
        //await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForSelector(Element.service_issue_item(description));
        await expect(await this.page.locator(Element.service_issue_resolved(description)).count()).toEqual(1);
    }

    async verifyServiceIssueIsNotVisible(description: string): Promise<void> {
        console.info(`Verifying that the Service issue is not visible for the Guest.`);
        await WebActions.delay(1000);
        await this.page.waitForLoadState(`domcontentloaded`);
        //await this.page.waitForLoadState(`networkidle`);
        await expect(await this.page.locator(Element.service_issue_item(description)).count()).toEqual(0);
        await WebActions.delay(500);
    }

}