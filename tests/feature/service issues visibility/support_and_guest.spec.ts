import test from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env'
const Chance = require("chance");
const chance = new Chance();

    test.describe (" EB2E - RQPro Service Issue created by Support and visible to Supplier", () => {
    test.slow();
    const idServiceIssue1 = chance.string({length: 6, numeric: true});
    const descriptionServiceIssue1 = `${idServiceIssue1} - Support=>Guest`;
    const idServiceIssue2 = chance.string({length: 6, numeric: true}); 
    const descriptionServiceIssue2 = `${idServiceIssue2} - Guest=>Service`;

    test("POST: Create an EB2E RQPRO Request", async ({requestEndpoints}) => {
        console.info(`Creating an EB2E - RQPro Request through the V1 API.`);
        const _response = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, 
            Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, 
            ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, ENV.GUEST_PHONE);
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

    test("Guest account creation, then review and create a new Service Issue, and also add a comment ", async () => {
        
    })
    
// SMS Testing is out of the scope for all the scenarios (at the moment)

// REQUESTOR and SUPPLIER should NOT have VISIBILITY of ServiceIssue#1 
//        [go to the service tab and verify that the ServiceIssue is NOT PRESENT]
// GUEST should have VISIBILITY of ServiceIssue#1 
//        [Register the eb2e user, activate the account, go to the Reservation Service view, verify that the ServiceIssue#1 IS PRESENT]                              
// GUEST RECEIVES an EMAIL 
//        [verify Guest received the email about ServiceIssue#1 created]
// REQUESTOR and SUPPLIER should NOT receive EMAIL 
//        [verify req and sup do not receives email about ServiceIssue created]]


// GUEST add a comment to ServiceIssue#1
// Guest Creates ServiceIssue #2
// Guest receives an EMAIl about ServiceIssue#1 UPDATED
// Guest and Support should see the ServiceIssue#2 [REQUESTOR should NOT because the setting is OFF]
// Guest and Support should get the EMAIL about ServiceIssue#2 created [REQUESTOR should NOT because the setting is OFF]

// ** SUPPORT add the comment on ServiceIssue#1
// GUEST receives an EMAIL about ServiceIssue#1 updated
// GUEST should see the alert icon on the Service Icon on the Quest detail view
// GUEST resolves ServiceIssue#2 
// GUEST see ServiceIssue#2 with Resolved status

// SUPPORT resolves the ServiceIssue#1
// GUEST receives 2 EMAILS [ServiceIssue#1 updated and How-was-your-service?] 

// GUEST fill out the Survey with 2 stars rating
// SUPPORT receives a survey result email [REQUESTOR should NOT because the setting is OFF]


})