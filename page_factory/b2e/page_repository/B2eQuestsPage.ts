import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";
 

export default class B2eQuestsPage {

    readonly page: Page;
    readonly webActions: WebActions

    constructor(page:Page ){
        this.page = page;
        this.webActions = new WebActions(this.page);        
    }

    async confirmNewOption(){
        console.info(`Confirming the a new option was bided`);
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.new_quest(ENV.REQUEST_ID));
        await expect(await this.page.locator(Button.new_quest(ENV.REQUEST_ID)).count()).toEqual(1);
        await this.page.click(Element.quests_card(ENV.REQUEST_ID));
    }

    async viewFutureQuest(request_id){
        console.info(`Viewing future quest`);
        await WebActions.delay(1000);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.future_quest(request_id));
        await expect(await this.page.locator(Button.future_quest(request_id)).count()).toEqual(1);
        await this.webActions.clickElementJS(Button.future_quest(request_id));
    }

    async confirmAlternateQuest(){
        console.info(`Confirming the alternate option`);
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.alternate_option(ENV.REQUEST_ID));
        await expect(await this.page.locator(Button.alternate_option(ENV.REQUEST_ID)).count()).toEqual(1);
        await this.webActions.clickElementJS(Button.alternate_option(ENV.REQUEST_ID));
    }

    async confirmDeclinedQuest(){
        console.info(`Confirming the declined option`);
        await WebActions.delay(300);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForSelector(Button.declined_option(ENV.REQUEST_ID));
        await expect(await this.page.locator(Button.declined_option(ENV.REQUEST_ID)).count()).toEqual(1);
    }

    async clickFutureQuestByGuest(){

    }
}