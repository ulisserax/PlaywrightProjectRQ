import Input from "@b2e_objects/Input";
import WebActions from "@lib/WebActions";
import {  Page } from "@playwright/test";
import Button from "../object_repository/Button";
import Link from "@b2e_objects/Link";


export default class B2eProfilePage {

    readonly page: Page;
    readonly webActions: WebActions;

    constructor(page:Page ){
        this.page = page;  
        this.webActions = new WebActions(this.page);      
    }

    async updatePassword(password: string, new_password:string): Promise<void>{
        console.info(`Updating the password profile`);
        await this.page.waitForLoadState(`domcontentloaded`);
        await this.page.waitForLoadState(`networkidle`);
        await WebActions.delay(1200);
        await this.page.waitForSelector(Link.change_password);
        await this.webActions.clickElementJS(Link.change_password);
        await this.page.waitForSelector(Input.current_password);
        await this.page.type(Input.current_password, password, {delay:40});
        await this.page.type(Input.user_password, new_password, {delay:40});
        await this.page.type(Input.confirm_password, new_password, {delay:40});
        await this.page.click(Button.save);
    }

}