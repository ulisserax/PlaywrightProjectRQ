import { expect} from "@playwright/test";
import test from '@lib/BaseTest';
import ENV from "@utils/env";


test.describe.parallel.only('ntv submission',()=>{


    test.beforeAll(async ({requestEndpoints, optionEndpoints})=>{

        //Create a request for a rqpro company and a eb2e client
        console.info(`Creating an EB2E Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, ENV.GUEST_PHONE);
        ENV.API_REQUEST_UID = `${JSON.parse(_createRequestResponse).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
    
        //Bid a option for the request
        console.info(`Submitting an Option to an EB2E RQPro Request through the V1 API.`);
        const _optionCreateResponse = await optionEndpoints.optionCreate(ENV.BASE_URL, ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_REQUEST_UID, Number(ENV.API_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE);
        const _optionCreateRes = JSON.parse(_optionCreateResponse)
        ENV.API_OPTION_ID = `${_optionCreateRes.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_optionCreateRes.submitted).toEqual(true);
    
        //Award the request
        console.info(`Awarding an Option to create an EB2E - RQPRO Reservation.`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_REQUEST_UID, _current_date);
        const _optionAwardResponse = await optionEndpoints.optionAward(ENV.BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_OPTION_ID);
        const _optionAwardRes = JSON.parse(_optionAwardResponse);
        ENV.API_RESERVATION_UID = `${_optionAwardRes[0].reservationNumber}`;
        console.info(`Reservation uid: ${ENV.API_RESERVATION_UID}`);
        await expect(_optionAwardRes[0].awarded).toEqual(true);
    
        
    })

    test.describe.serial('submitted by requestor',()=>{

        test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        })

        test('Submit a Notice by requestor and validate submission', async ({webActions, reservation})=>{
            console.info(`Submit a Notice by requestor`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            await reservation.submitNoticeToVacate();
            console.info(`validate submission by requestor`);
            await reservation.verifyNoticeToVacateSubmitted();
            
            //validate the activity log
        })

        test('Validate submission by supplier', async ({webActions, reservation})=>{
            console.info(`submitted by requestor. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            //await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            //await reservation.submitNoticeToVacate();
            await reservation.verifyNoticeToVacateSubmitted();
            
            //validate the activity log
        })

    })
    

    test.describe.serial('submitted by guest',()=>{

        test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
            console.info(`Acknowledging the Reservation.`);
            console.info(`submitted by guest. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
           // await requestShow.validateServiceIssueTab();
        })

        test('submitted by guest', ()=>{
            console.info(`submitted by guest. ${ENV.API_RESERVATION_UID}`);
        })

    })

})
