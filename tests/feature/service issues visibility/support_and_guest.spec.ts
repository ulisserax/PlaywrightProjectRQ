import B2eHomePage from '@b2e_pages/B2eHomePage';
import B2eQuestDetailsPage from '@b2e_pages/B2eQuestDetailsPage';
import B2eQuestsPage from '@b2e_pages/B2eQuestsPage';
import B2eServices from '@b2e_pages/B2eServices';
import MailCatcher from '@enterprise_pages/MailCatcherPage';
import ServiceIssuePage from '@enterprise_pages/ServiceIssuePage';
import test from '@lib/BaseTest';
import WebActions from '@lib/WebActions';
import { expect } from '@playwright/test';
import ENV from '@utils/env'
const Chance = require("chance");
const chance = new Chance();

test.describe.serial(" EB2E - RQPro Service Issue created by Support and visible to Supplier", () => {
    test.slow();
    const idServiceIssue = chance.string({length: 6, numeric: true});
    const descriptionServiceIssue1 = `${idServiceIssue} - Support=>Guest`;
    const descriptionServiceIssue2 = `${idServiceIssue} - Guest=>Service`;
    ENV.GUEST_PHONE = `7869250000`;


    test("POST: Create an EB2E RQPRO Request", async ({requestEndpoints}) => {
        console.info(`Creating an EB2E - RQPro Request through the V1 API.`);
        const _response = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, 
            Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, 
            ENV.GUEST_LASTNAME, ENV.RQPRO_GUEST_FOR_SERVICE, ENV.GUEST_PHONE);
        ENV.API_REQUEST_UID = `${JSON.parse(_response).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
    })

    test("POST: Submit an Option to the EB2E RQPRO Request", async ({optionEndpoints}) => {
        console.info(`Submitting an Option to an EB2E RQPro Request through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_REQUEST_UID, Number(ENV.API_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);
    })

    test("POST: Award the Option", async ({optionEndpoints, requestEndpoints}) => {
        console.info(`Awarding an Option to create an EB2E - RQPRO Reservation.`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_REQUEST_UID, _current_date);
        const _res = await optionEndpoints.optionAward(ENV.BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_OPTION_ID);
        const _response = JSON.parse(_res)
        ENV.API_RESERVATION_UID = `${_response[0].reservationNumber}`;
        console.info(`Reservation uid: ${ENV.API_RESERVATION_UID}`);
        await expect(_response[0].awarded).toEqual(true);
    })

    test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
        console.info(`Acknowledging the Reservation.`);
        await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        await requestShow.validateServiceIssueTab();
    })

    test("Support user creates a Service Issue , sets visibility to Guest and add a comment", async ({webActions, dashboard, requestShow}) => {
        console.info(`Create a Service Issue as Support`);
        await webActions.login(`superadmin`,`${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`,ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await dashboard.impersonate(`relosupport`);
        ENV.ROLE_VISIBILITY = ['EMPLOYEE'];
        await requestShow.createServiceIssue(descriptionServiceIssue1 ,ENV.ROLE_VISIBILITY);
        await requestShow.validateServiceIssueWasCreated(descriptionServiceIssue1);
        await requestShow.addServiceIssueComment(descriptionServiceIssue1);
    })

    test("Guest account creation, then review and create a new Service Issue, and also add a comment ", async ({webActions, configurationInstance, mailCatcher, b2eLoginPage, b2eHomePage, b2eQuestsPage, b2eQuestDetailsPage, b2eServices}) => {
        console.info(`Guest user creation to review and creates a Service Issue`);
        await b2eHomePage.login(`eb2e-rqpro user`, `${ENV.RQPRO_B2E_URL}/b2e/quests`, ENV.RQPRO_GUEST_FOR_SERVICE, ENV.B2E_USER_PASSWORD);
        await b2eQuestsPage.viewFutureQuest(ENV.API_REQUEST_UID);
        await b2eQuestDetailsPage.validateServiceRedBadge();
        await b2eQuestDetailsPage.requestServiceIssue();
        await b2eServices.verifyServiceDescriptionOnList(descriptionServiceIssue1);
        await b2eServices.addServiceComment(descriptionServiceIssue1);
        await b2eServices.createNewServiceIssue(descriptionServiceIssue2);
        await b2eServices.verifyServiceDescriptionOnList(descriptionServiceIssue2);
    })

    test("Support adds a comment and resolves a Service Issue", async ({webActions,dashboard, requestShow, serviceIssue}) => {
        console.info(`Support adds a comment and resolves a service issue.`);
        await webActions.login(`superadmin`,`${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`,ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await dashboard.impersonate(`relosupport`);
        await requestShow.clickOnServiceIssueTab();
        await requestShow.validateServiceIssueWasCreated(descriptionServiceIssue2);
        await requestShow.editServiceIssue(descriptionServiceIssue1);
        await serviceIssue.resolveService(descriptionServiceIssue1);
    })

    test("Guest resolves a Service Issue and validates the -resolved- status", async ({b2eHomePage, b2eQuestsPage, b2eQuestDetailsPage, b2eServices}) =>{
        console.info(`Resolving a Service Isuse and validating it has the correct status.`);
        await b2eHomePage.login(`eb2e user`, ENV.RQPRO_B2E_URL, ENV.RQPRO_GUEST_FOR_SERVICE, ENV.B2E_USER_PASSWORD);
        await b2eQuestsPage.viewFutureQuest(ENV.API_REQUEST_UID);
        await b2eQuestDetailsPage.requestServiceIssue();
        await b2eServices.openServiceItem(descriptionServiceIssue2);
        await b2eServices.markAsResolved();
        await b2eServices.verifyServiceResolved(descriptionServiceIssue2);
    })

    test("Verifying that Suppier and Requestor can't see RQPro Service Issues.", async ({webActions, requestShow, dashboard}) => {
        console.info(`Verifying that Supplier and Requestor can't see the RQPro Services.`);
        await webActions.login(`superadmin`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await dashboard.impersonate(ENV.SUPPLIER_FOR_RQPRO_ADMIN);
        await requestShow.clickOnServiceIssueTab();
        await requestShow.validateServiceIssueIsNotVisible(descriptionServiceIssue1);
        await requestShow.validateServiceIssueIsNotVisible(descriptionServiceIssue2);
        await dashboard.exit_impersonation();
        await dashboard.impersonate(ENV.RQPRO_REQ_ADMIN);
        await webActions.navigateTo(`${ENV.RQPRO_BASE_URL}/request/show/${ENV.API_REQUEST_UID}`);
        await requestShow.validateServiceIssueIsNotVisible(descriptionServiceIssue1);
        await requestShow.validateServiceIssueIsNotVisible(descriptionServiceIssue2);
    })

    test.skip("Guest complete the - How was your Servicve? - Survey ", async ({}) => {
        console.info(`Guest fills out the Service Survey.`);
        console.info(`THIS TEST SHOULD BE IMPLEMENTED AFTER SOLVING THE ISSUE WITH THE MS-NOTIFICATION EMAILS NOT AVAILABLE ON THE MAILCATCHER!`);

    })

    test.skip("Validating Service Issue emails", async ({}) => {
        console.info(`Validating al the emails related to the Support-Guest RQPRO Service Issue flow`);
        console.info(`THIS TEST SHOULD BE IMPLEMENTED AFTER SOLVING THE ISSUE WITH THE MS-NOTIFICATION EMAILS NOT AVAILABLE ON THE MAILCATCHER!`);
    })

})