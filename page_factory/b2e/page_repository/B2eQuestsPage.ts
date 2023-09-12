import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";
import Link from "@b2e_objects/Link";
 

export default class B2eQuestsPage {

    readonly page: Page;
    readonly webActions: WebActions

    constructor(page:Page ){
        this.page = page;
        this.webActions = new WebActions(this.page);        
    }

    async confirmNewOption(request_id:string){
        console.info(`Confirming the a new option was bided`);
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.new_quest(request_id));
        await expect(await this.page.locator(Button.new_quest(request_id)).count()).toEqual(1);
        await this.page.click(Element.quests_card(request_id));
    }

    async viewFutureQuest(request_id){
        console.info(`Viewing future quest`);
        await WebActions.delay(1000);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.future_quest(request_id));
        await expect(await this.page.locator(Button.future_quest(request_id)).count()).toEqual(1);
        await this.webActions.clickElementJS(Button.future_quest(request_id));
        await WebActions.delay(500);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(2000);
        ENV.API_RESERVATION_ID = await this.page.url().split('/')[5].trim();
        console.info(`res_id: ${ENV.API_RESERVATION_ID}`);
    }

    async confirmAlternateQuest(request_id: string ){
        console.info(`Confirming the alternate option`);
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.alternate_option(request_id));
        await expect(await this.page.locator(Button.alternate_option(request_id)).count()).toEqual(1);
        await this.webActions.clickElementJS(Button.alternate_option(request_id));
    }

    async confirmDeclinedQuest(request_id:string){
        console.info(`Confirming the declined option`);
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.declined_option(request_id));
        await expect(await this.page.locator(Button.declined_option(request_id)).count()).toEqual(1);
    }

    async clickFutureQuestByGuest(){

    }

    async openQuests(request_id:string){
        console.info(`Confirming the declined option`);
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        if(await this.page.locator(Button.quest_option(request_id)).count()==0){
            await this.page.click(Link.quests);
            await WebActions.delay(300);
            await this.page.waitForLoadState(`domcontentloaded`);
        }
    }
}