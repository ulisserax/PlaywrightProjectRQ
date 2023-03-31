import test from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env'

test.describe (" EB2E - RQPro Service Issue created by Support and visible to Supplier", () => {
    test.slow();
    test("POST: Create an EB2E RQPRO Request", async ({requestEndpoints}) => {
        console.info(`Creating an EB2E - RQPro Request through the V1 API.`);
        const _response = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE);
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

    test("As a Support user, create a Service Issue", async ({webActions, dashboard, requestShow}) => {
        console.info(`Create a Service Issue as Support`);
        await webActions.login(`superadmin`,`${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`,ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await dashboard.impersonate(`relosupport`);
        await requestShow.createServiceIssue();

    })

})