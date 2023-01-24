import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import Checkbox from "@b2e_objects/Checkbox";
import WebActions from "@lib/WebActions";
import { expect, Page , Browser} from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";
import Link from "@b2e_objects/Link";

export default class B2eQuestDetailsPage {

    readonly page: Page;

    constructor(page:Page ){
        this.page = page;        
    }

    async verifyPendingQuest(){
        console.info(`Verifying pending quest`);
        await this.page.waitForSelector(Element.quest_detail_section);
        await expect(await this.page.locator(Text.pending_quest).count()).toEqual(1);
        let booking_number = await this.page.locator(Text.pending_quest).textContent();
        ENV.RESERVATION_ID = booking_number.substring(booking_number.search('#'));
        console.info(ENV.RESERVATION_ID);
    }
}