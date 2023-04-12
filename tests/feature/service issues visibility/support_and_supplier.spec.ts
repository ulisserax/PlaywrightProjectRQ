import test from '@lib/BaseTest'
import { expect } from '@playwright/test'
import ENV from '@utils/env';

const Chance = require("chance");
const chance = new Chance();

test.describe.serial.only ("EB2E - RQPro Service Issue between Supplier and Support", () => {
    test.slow();
    const idServiceIssue1 = chance.string({length: 6, numeric: true});
    const descriptionServiceIssue1 = `${idServiceIssue1} - Supplier=>Support`;
    const descriptionServiceIssue1a = `${idServiceIssue1} - Support=>Supplier`;
    const descriptionServiceIssue2 = `${chance.string({length: 6, numeric: true})} - Support=>Supplier`;
    ENV.GUEST_PHONE = `7869250000`;
    ENV.RQPRO_GUEST_FOR_SERVICE = `supplier-support-serviceissue@${ENV.RQPRO_COMPANY}.com`;

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

    test("Acknowledge the EB2E - RQPro Reservation and Creating a Service Issue.", async ({webActions, requestShow}) => {
        console.info(`Acknowledging the Reservation and creating a Service Issue.`);
        await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        await requestShow.validateServiceIssueTab();
        ENV.ROLE_VISIBILITY = ['NO'];
        await requestShow.createServiceIssue(descriptionServiceIssue1 ,ENV.ROLE_VISIBILITY);
        await requestShow.validateServiceIssueWasCreated(descriptionServiceIssue1);
    })

    test("Support adds a comment to the Service Issue and creates a new one", async ({webActions,dashboard, requestShow, serviceIssue}) => {
        console.info(`Support adds a comment in a service issue and create another one.`);
        await webActions.login(`superadmin`,`${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`,ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await dashboard.impersonate(`relosupport`);
        await requestShow.clickOnServiceIssueTab();
        await requestShow.validateServiceIssueWasCreated(descriptionServiceIssue1);
        await requestShow.editServiceIssue(descriptionServiceIssue1);
        await serviceIssue.addServiceIssueComment(`Support`, descriptionServiceIssue1a);
        ENV.ROLE_VISIBILITY = ['SUPPLIER'];
        await requestShow.createServiceIssue(descriptionServiceIssue2 ,ENV.ROLE_VISIBILITY);
        await requestShow.validateServiceIssueWasCreated(descriptionServiceIssue2);
    })

    test("Supplier adds a comment and resolves a Service Issue", async ({webActions,dashboard, requestShow, serviceIssue}) => {
        console.info(`Supplier adds a comment and resolves a service issue.`);
        await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await requestShow.clickOnServiceIssueTab();
        await requestShow.validateServiceIssueWasCreated(descriptionServiceIssue2);
        await requestShow.editServiceIssue(descriptionServiceIssue1);
        await serviceIssue.addServiceIssueComment(`Supplier`, descriptionServiceIssue1);
        await requestShow.editServiceIssue(descriptionServiceIssue1);
        await serviceIssue.validateCommentAdded(descriptionServiceIssue1a);
        await serviceIssue.resolveService(descriptionServiceIssue1);
    })

    test("Verifying that the Requestor and Guest can't see the Service Issue.", async ({webActions, requestShow, b2eHomePage, b2eQuestDetailsPage, b2eQuestsPage, b2eServices}) => {
        console.info(`Verifying that the Requestor and Guestcan't see the RQPro Services.`);
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/request/show/${ENV.API_REQUEST_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await requestShow.clickOnServiceIssueTab();
        await requestShow.validateServiceIssueIsNotVisible(descriptionServiceIssue1);
        await b2eHomePage.login(`eb2e user`, ENV.RQPRO_B2E_URL, ENV.RQPRO_GUEST_FOR_SERVICE, ENV.B2E_USER_PASSWORD);
        await b2eQuestsPage.viewFutureQuest(ENV.API_REQUEST_UID);
        await b2eQuestDetailsPage.requestServiceIssue();
        await b2eServices.verifyServiceIssueIsNotVisible(descriptionServiceIssue1);
    })

})