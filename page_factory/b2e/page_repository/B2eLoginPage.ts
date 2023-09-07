import Checkkox from "@b2e_objects/Checkbox";
import Element from "@b2e_objects/Element";
import Input from "@b2e_objects/Input";
import WebActions from "@lib/WebActions";
import { expect, Page } from "@playwright/test";
import Button from "../object_repository/Button";
import B2eHomePage from "./B2eHomePage";
import ENV from "@utils/env";


export default class B2eLoginPage {

    readonly page: Page;
    readonly b2eHome: B2eHomePage;

    constructor(page:Page){
        this.page = page;
        this.b2eHome = new B2eHomePage(page);
    }

    async registerNewUser(firstname: string, lastname: string, email: string, password: string){
        console.info(`Filling new user information`);
        await this.page.type(Input.firstname,`${firstname}`, {delay:30});
        await this.page.type(Input.lastname,`${lastname}`, {delay:30});
        await this.page.type(Input.email,`${email}`, {delay:30});
        await this.page.type(Input.confirm_email,`${email}`, {delay:30});
        await this.page.type(Input.user_password,`${password}`, {delay:30});
        await this.page.type(Input.confirm_password,`${password}`, {delay:30});
        await this.page.type(Input.phone, `7863256523`, {delay:30});
        await this.page.click(Checkkox.terms);
        await WebActions.delay(500);
        await this.page.click(Button.register);
    }

    async verifyRegisterSuccess(){
        console.info(`Confirming the registration was successfully`);
        await this.page.waitForSelector(Element.check_your_email);
        await expect (await this.page.locator(Element.check_your_email).count()).toBeGreaterThan(0);
    }

    async verifyEmailSendSuccessfull(){
        console.info(`Email sent successfully`);
        await WebActions.delay(2500);
        await this.page.waitForSelector(Element.check_your_email_icon);
        await expect (await this.page.locator(Element.check_your_email_icon).count()).toBeGreaterThan(0);
    }

    async sendLink(email: string){
        console.info(`Sending link to email: ${email}`);
        await this.page.waitForSelector(Input.email);
        await this.page.type(Input.email, email, {delay:30});
        await expect (await this.page.locator(Element.check_your_email_icon).count()).toBeGreaterThan(0);
    }

    async completeEb2eRegistration(firstName: string, lastName: string, password: string, domain: string) {
        console.info (`Completing the EB2E Registration on the - Reservation Confirmation - email.`);
        await this.b2eHome.acceptCookies();
        //console.info(ENV.GUEST_PHONE);
        await this.page.type(Input.firstname,`${firstName}`, {delay:30});
        await this.page.type(Input.lastname,`${lastName}`, {delay:30});
        await this.page.type(Input.user_password,`${password}`, {delay:30});
        await this.page.type(Input.confirm_password,`${password}`, {delay:30});
        await this.page.click(Checkkox.terms);
        await WebActions.delay(500);
        await this.page.click(Button.register);
        await WebActions.delay(1000);
        await this.page.waitForLoadState(`networkidle`);
        await this.verifyEmailActivationSent();
        await this.page.goto(`${domain}/configuration/instance`);
    }

    async verifyEmailActivationSent(){
        console.info(`Actvation email successfully sent.`);
        await WebActions.delay(1200);
        await this.page.waitForSelector(Element.email_activation_sent);
        await expect (await this.page.locator(Element.email_activation_sent).count()).toBeGreaterThan(0);
    }

    async registerNewGuest(firstname: string, lastname: string, password: string){
        console.info(`Filling new user information`);
        await this.page.type(Input.firstname,`${firstname}`, {delay:30});
        await this.page.type(Input.lastname,`${lastname}`, {delay:30});
        await this.page.type(Input.user_password,`${password}`, {delay:30});
        await this.page.type(Input.confirm_password,`${password}`, {delay:30});
        await this.page.click(Checkkox.terms);
        await WebActions.delay(500);
        await this.page.click(Button.register);

    }

}    