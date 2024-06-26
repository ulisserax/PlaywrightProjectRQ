import test from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env';


test.describe.serial("EB2E RQPRO API main flow", ()=>{


    test("POST: Create an EB2E RQPRO Request @BeforeBilling @Smoke @Request @SM-T1105", async ({requestEndpoints}) => {
        console.info(`Creating an EB2E Request through the V1 API.`);

        const _response = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.RQPRO_GUEST_EMAIL, ENV.GUEST_PHONE, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.API_REQUEST_UID = `${JSON.parse(_response).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
        // I need to update the requestEndpoints() to accept the daily_rate as a parameter
    })

    test("POST: Submit an Option to the EB2E RQPRO Request @BeforeBilling @Smoke @Options @SM-T1106", async ({optionEndpoints}) => {
        console.info(`Submitting an Option to an EB2E Request through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.SUPPLIER_COMPANY_FOR_RQPRO_EMAIL, ENV.API_REQUEST_UID, Number(ENV.API_NT3_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Night']);
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
})