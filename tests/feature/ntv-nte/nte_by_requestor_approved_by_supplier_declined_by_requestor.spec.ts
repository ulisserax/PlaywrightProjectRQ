import { expect} from "@playwright/test";
import test from '@lib/BaseTest';
import ENV from "@utils/env";


test.describe.serial('nte by requestor, approved by supplier and declined by requestor',()=>{

    let rqpro_guest_email = `juan_1314@nt3reqrqpro.com`;

    test("POST: Create an EB2E RQPRO Request", async ({requestEndpoints}) => {
        console.info(`Creating an EB2E Request through the V1 API.`);
        const _response = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, rqpro_guest_email, `7863256523`);
        ENV.API_REQUEST_UID = `${JSON.parse(_response).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
        // I need to update the requestEndpoints() to accept the daily_rate as a parameter
    })

    test("POST: Submit an Option to the EB2E RQPRO Request", async ({optionEndpoints}) => {
        console.info(`Submitting an Option to an EB2E Request through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.RQPRO_BASE_URL, ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_REQUEST_UID, Number(ENV.API_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);
    })

    test("POST: Award the Option", async ({optionEndpoints, requestEndpoints}) => {
        console.info(`Awarding an Option to create an EB2E - RQPRO Reservation.`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_REQUEST_UID, _current_date);
        const _res = await optionEndpoints.optionAward(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, ENV.API_OPTION_ID);
        const _response = JSON.parse(_res)
        ENV.API_RESERVATION_UID = `${_response[0].reservationNumber}`;
        console.info(`Reservation uid: ${ENV.API_RESERVATION_UID}`);
        await expect(_response[0].awarded).toEqual(true);
    })

   test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
        console.info(`Acknowledging the Reservation.`);
        await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
    })

    test('As requestor submit the NTE', async ({webActions, reservation})=>{
        console.info(`Submit NTE by the requestor.`);            
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
        await reservation.submitExtension();
        await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / checking availability with Supplier`);
            
            //validate the activity log
    })

    test('As supplier verify the submitted NTE by requestor and approve the NTE', async ({webActions, reservation})=>{
        console.info(`Verifying the submitted NTE by the requestor. ${ENV.API_RESERVATION_UID}`);
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await reservation.closeExtensionSubmitted();
        await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / waiting for supplier approval`);
        console.info(`Approving the NTE.`);
        await reservation.approveExtension();
        await reservation.acceptExtensionRateSegmentsTerms();
        await reservation.verifyNoticeToVacateSubmitted(`Waiting for Requestor Approval / Supplier approved guest extension`);    
            //validate the activity log
    })

   
    test('As requestor decline the NTE', async ({webActions, reservation})=>{
        console.info(`Declining NTE by the requestor.`);            
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
        //await reservation.submitExtension();
        await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / checking availability with Supplier`);
            
            //validate the activity log
    })

    

    

    // test('As requestor validate NTE declined by supplier', async ({webActions, reservation})=>{
    //     console.info(`Validate nte declined by supplier`);            
    //     await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
    //     await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
    //     await reservation.verifyNoticeToVacateSubmitted(`Notice given / Extension declined (see activity log for any additional details)`);
            
    //         //validate the activity log
    // })


})
