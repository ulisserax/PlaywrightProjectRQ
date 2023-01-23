import Input from "@b2e_objects/Input";
import Text from "@b2e_objects/Text";
import Checkbox from "@b2e_objects/Checkbox";
import WebActions from "@lib/WebActions";
import { expect, Page , Browser} from "@playwright/test";
import Button from "../object_repository/Button";
import Element from "../object_repository/Element";
import ENV from "@utils/env";
import Link from "@b2e_objects/Link";

export default class B2eQuestsPage {

    readonly page: Page;

    constructor(page:Page ){
        this.page = page;        
    }

    async confirmNewOption(){
        console.info(`Confirming the a new option was bided`);
        await this.page.waitForLoadState(`networkidle`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await WebActions.delay(800);
        await expect(await this.page.locator(Button.new_quest(ENV.REQUEST_ID)).count()).toEqual(1);
        await this.page.click(Element.quests_card(ENV.REQUEST_ID));
    }
}