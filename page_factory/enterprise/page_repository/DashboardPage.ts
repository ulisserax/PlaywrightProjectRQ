import { expect, Page } from "@playwright/test";
import Button from "@enterprise_objects/Button";
import Input from "@enterprise_objects/Input";
import Card from "@enterprise_objects/Card";
import WebActions from "@lib/WebActions";


export default class DashboardPage {

    readonly page : Page;

    constructor(page: Page){
        this.page = page;
    }

    async cardSummary(){
        let cards_sum = 0;
        let card;
        for (const cards of await this.page.$$(Card.dashboard_cards)){
            card =  Number(await cards.textContent());
            if (!isNaN(Number(card))){
                cards_sum = cards_sum + card;
            }
        }
        console.info(`Dashboard Summary: ${await this.page.locator(Card.dashboard_summary).textContent()} - Cards Sum: ${cards_sum}`)
        await expect(await this.page.locator(Card.dashboard_summary).textContent()).toEqual(cards_sum.toString());
    }
    async validateDashboard(): Promise<void>{
        console.info('Validating dashboard url');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/\/dashboard/);
    }

    async clickNewRequest(): Promise<void>{
        console.info("Clicking New Request");
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.newRequest);
        await this.page.waitForLoadState('networkidle');
    }

    async clickCurrentTab(): Promise<void>{
        console.info("Clicking current tab");
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.current);
        await this.page.waitForLoadState('domcontentloaded');
        
    }

    async findCurrentRequest(request_id): Promise<void>{
        console.info("Finding a current request");
        await WebActions.delay(400);
        await this.page.type(Input.search_by, request_id, {delay:35});
        await this.page.keyboard.press('Enter');
    }

    async findReservation(reservation_id): Promise<void>{
        console.info("Finding a current request");
        await WebActions.delay(400);
        await this.page.type(Input.search_by, reservation_id, {delay:35});
        await this.page.keyboard.press('Enter');
    }

    async clickReadyToBeAwardedCard(): Promise<void>{
        console.info("Clicking ready to be awarded card");
        await this.page.click(Card.ready_to_be_awarded_card);
    }

    async clickMyAccountTab(): Promise<void>{
        console.info("Clicking on the my account tab");
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.click(Button.myAccount);
    }
}