import { expect } from "@playwright/test";
import test from "@lib/BaseTest";
import ENV from "@utils/env";
import Database from "@lib/Database";
const moment = require('moment');
const Chance = require('chance');
const chance = new Chance();

test.describe.parallel.only('RQ Pro scenarios -- ',()=>{
    test.slow();
    let rqpro_guest_email = `edit-lock2@nt3reqrqpro.com`;

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

    test.describe.serial.only('Edit a non-locked RQ Pro Reservation -- ',()=>{
        
        test("SM-T1632, SM-T1623 ==> Implementing RQ Pro NOT Locked UI and API", async ({webActions, requestShow, reservation, reservationEndpoints}) =>{
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
            
            let four_days_after_arrival = moment().add(-4,"day").format("YYYY-MM-DD")
            let rate_segment = `{
                "rate_segments": [
                     {
                         "start_date": "${four_days_after_arrival}",
                         "end_date": "${ENV.END_DATE}",
                         "rate": "264.0000000000",
                         "property": ${Number(ENV.API_NT3_PROPERTY_ID)},
                         "apartment_no":"APTO-3321"
                         
                     }
                ]
             }`
            
            let update_reservation_response = await reservationEndpoints.updateReservation(`${ENV.SUPPLIER_DOMAIN}`,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID, rate_segment);
            console.log(update_reservation_response);
            await requestShow.viewReservation();
            await reservation.validateNumberOfDepositsSegments(0);
            await reservation.clickEditSegmentLink();
            await reservation.expandDepositsSection();
            await reservation.addNewDeposit(0,1);
            await reservation.submitSegmentChanges();
            await reservation.validateNumberOfDepositsSegments(1);

            //let date = moment().add(-5,"day").format("YYYY-MM-DD")
            let get_reservation_response = await reservationEndpoints.getReservationByUid(`${ENV.SUPPLIER_DOMAIN}`,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID);
            let fee_seg = JSON.parse(get_reservation_response).fee_segments;
            let segments = JSON.stringify(fee_seg).replace('[','').replace(']','');         
            let fee_segments = `{
                "fee_segments": [
                    ${segments},
                    {
                      "start_date": "${ENV.START_DATE}",
                      "end_date": "${ENV.END_DATE}",
                      "calculation_method": "FLAT",
                      "fee_description":"Security Deposit",
                      "fee_basis_amount": "300.000000",
                      "fee_type": 15,
                      "fee_type_name": "DEPOSIT"
                    }
                ]
                
             }`
            update_reservation_response = await reservationEndpoints.updateReservation(`${ENV.SUPPLIER_DOMAIN}`,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID, fee_segments);
            console.log(update_reservation_response);
            await expect(JSON.parse(update_reservation_response).submitted).toBeTruthy();
            await webActions.refresh();
            await reservation.validateNumberOfDepositsSegments(2);

            let five_days_after_arrival = moment().add(-5,"day").format("YYYY-MM-DD")
            let new_rate_segment = `{
                "rate_segments": [
                     {
                         "start_date": "${five_days_after_arrival}",
                         "end_date": "${ENV.END_DATE}",
                         "rate": "264.0000000000",
                         "property": ${Number(ENV.API_NT3_PROPERTY_ID)},
                         "apartment_no":"APTO-3321"
                         
                     }
                ]
             }`
            
            let updateReservation_response = await reservationEndpoints.updateReservation(`${ENV.SUPPLIER_DOMAIN}`,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID, new_rate_segment);
            console.log(updateReservation_response);
            await webActions.refresh();
            await reservation.clickEditSegmentLink();
            await reservation.validateLockModal();

            let last_rate_segment = `{
                "rate_segments": [
                     {
                         "start_date": "${ENV.START_DATE}",
                         "end_date": "${ENV.END_DATE}",
                         "rate": "264.0000000000",
                         "property": ${Number(ENV.API_NT3_PROPERTY_ID)},
                         "apartment_no":"APTO-3321"
                         
                     }
                ]
             }`
            
           updateReservation_response = await reservationEndpoints.updateReservation(`${ENV.SUPPLIER_DOMAIN}`,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID, last_rate_segment);
            console.log(updateReservation_response);
            await expect(JSON.parse(updateReservation_response).submitted).toBeFalsy();
            await expect(JSON.parse(updateReservation_response).errorMessage).toEqual("We are implementing a new process - please contact: Reservations@ReloQuest.comif you need to make any changes to this Reservation.");
        })

    })

    test.describe.serial('Edit a locked RQ Pro Reservation -- ',()=>{

        test("SM-T1595, SM-T1620 ==> Implementing RQ Pro Locked UI and API", async ({webActions, requestShow, reservationEndpoints})=>{
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
            let date = moment().add(-5,"day").format("YYYY-MM-DD")
            let body = `{
                "rate_segments": [
                     {
                         "start_date": "${date}",v
                         "end_date": "${ENV.END_DATE}",
                         "rate": "264.0000000000",
                         "property": ${Number(ENV.API_NT3_PROPERTY_ID)},
                         "apartment_no":"APTO-3321"
                         
                     }
                ]
             }`
            
            let updateReservation_response = await reservationEndpoints.updateReservation(`${ENV.SUPPLIER_DOMAIN}`,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID, body);
            console.log(updateReservation_response);
            await webActions.refresh();
            
            

       })
    })
})