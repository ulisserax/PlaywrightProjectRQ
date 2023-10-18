import { expect } from "@playwright/test";
import test from "@lib/BaseTest";
import ENV from "@utils/env";

test.describe.parallel.only('Reservation-Edit-Lock for RQ Pro -- ', ()=>{
    test.slow();
    let rqpro_guest_email = `edit-lock1@nt3reqrqpro.com`;

    test.beforeAll(async ({requestEndpoints, optionEndpoints})=>{
        //Create a request for a rqpro company and a eb2e client
        console.info(`Creating an EB2E Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, Number(ENV.NT3REQ_RQPRO_EDIT_LOCK), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, rqpro_guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.API_REQUEST_UID = `${JSON.parse(_createRequestResponse).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
    
        //Bid a option for the request
        console.info(`Submitting an Option to an EB2E RQPro Request through the V1 API.`);
        const _optionCreateResponse = await optionEndpoints.optionCreate(ENV.RQPRO_BASE_URL, ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.SUPPLIER_COMPANY_FOR_RQPRO_EMAIL, ENV.API_REQUEST_UID, Number(ENV.API_NT3_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Night']);
        const _optionCreateRes = JSON.parse(_optionCreateResponse)
        ENV.API_OPTION_ID = `${_optionCreateRes.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_optionCreateRes.submitted).toEqual(true);
    
        //Award the request
        console.info(`Awarding an Option to create an EB2E - RQPRO Reservation.`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_REQUEST_UID, _current_date);
        const _optionAwardResponse = await optionEndpoints.optionAward(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_OPTION_ID);
        const _optionAwardRes = JSON.parse(_optionAwardResponse);
        ENV.API_RESERVATION_UID = `${_optionAwardRes[0].reservationNumber}`;
        console.info(`Reservation uid: ${ENV.API_RESERVATION_UID}`);
        await expect(_optionAwardRes[0].awarded).toEqual(true);
    
    })

    test.describe.serial('Edit a non-locked RQ Pro Reservation -- ',()=>{

        test('T1590 - Edit through the UI a non-locked non-RQ Pro Reservation', async ({webActions, requestShow, reservation}) => {
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
            await requestShow.viewReservation();
            await reservation.clickEditSegmentLink();
        })
        
        // Test Cases
    })
})