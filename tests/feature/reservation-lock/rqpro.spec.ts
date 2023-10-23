import { expect } from "@playwright/test";
import test from "@lib/BaseTest";
import ENV from "@utils/env";
import Element from "@enterprise_objects/Element";
const moment = require('moment');
const Chance = require('chance');
const chance = new Chance();
import link from "@enterprise_objects/Link";
import ReservationEndpoints from "@api/v1/ReservationEndpoints";
import ReservationPage from "@enterprise_pages/ReservationPage";
import Database from "@lib/Database";

test.describe.only('RQ Pro scenarios -- ',()=>{

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

    test.describe.serial('Edit a non-locked RQ Pro Reservation -- ',()=>{
        
        test("SM-T1632, SM-T1623, SM-T1595, SM-T1620 ==> Validating RQ Pro NOT Locked UI - API, and RQ Pro Locked UI - API", async ({webActions, requestShow, reservation, reservationEndpoints}) =>{
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
                      "fee_basis_amount": "390.000000",
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

        // JOSE
        test.skip("T1601, T1602, T1603, T1614, T1620 Support Unlock validations -- ", async ({webActions, reservation, dashboard })=> {
            
            // T1602 => AS Support with NO privileges to unlock Reservations, navigate to the Reservation and validate that there is no Lcik to unlock
            console.info(`Logina as a Support and navigate to the Locked Reservation`);
            await webActions.login(`superadmin`, `${ENV.SUPPLIER_DOMAIN}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
            await dashboard.impersonate(ENV.SUPPORT_NO_UNLOCK);
            await reservation.allowSupplierEditIsNotVisible();
            await dashboard.exit_impersonation();

            // T1601 => As a support user with the permission to unlock a reservation i should be able to unlock the reservation
            await dashboard.impersonate(ENV.SUPPORT_UNLOCK);
            await webActions.navigateTo(`${ENV.SUPPLIER_DOMAIN}/reservation/${ENV.API_RESERVATION_UID}`);
            await reservation.allowSupplierEditIsVisible();
            await reservation.unlockResevation();
            await reservation.validateUnlockedLabel();
            await reservation.validateActivityLog(ENV.SUPPORT_UNLOCK, 'Allow Supplier edits until:');

            // T1614 => Reservation activity log shows the unlock_until, in user's time zone and This field should only be visible to SUPPORT, SUPER_ADMIN
            // Pending to implement the amount of hours for the unlock and the user timezone format
            
        })

        test.skip ("T612, T1621, T623, T1633 -- Suplier editing an Unlocked Reservation", async ({webActions, reservation, reservationEndpoints})=>{

            // T1612 => As a Supplier when viewing a unlocked I should see the message but not the activity log
            console.info(`Logina as a Supplier and navigate to the Unlocked Reservation`);
            //await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
            await webActions.login(`supplier`, `https://supstage.reloquest.com/reservation/RQR48D4E8`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);   
            
            await reservation.validateUnlockedLabel();
            await reservation.notVisibleActivityLog(ENV.SUPPLIER_FOR_RQPRO_ADMIN,'Allow Supplier edits until:');
    
            //       => As a Supplier I should be able to edit a Reservation (UI)
            await reservation.validateNumberOfDepositsSegments(2);
            await reservation.clickEditSegmentLink();
            await reservation.expandDepositsSection();
            await reservation.addNewDeposit(2,3);
            await reservation.submitSegmentChanges();
            await reservation.validateNumberOfDepositsSegments(3);
            // T1623 => API Supplier should be able to edit a unlocked Reservation (API)
            let newDate = moment().add(-7,"day").format("YYYY-MM-DD")
            let newRate = `{
                "rate_segments": [
                    {
                        "start_date": "${newDate}",
                        "end_date": "${ENV.END_DATE}",
                        "rate": "104.0000000000",
                        "property": ${Number(ENV.API_NT3_PROPERTY_ID)},
                        "apartment_no":"APTO-3321" 
                    }
                ]
            }`
            ENV.API_RESERVATION_UID = 'RQR48D4E8';
            let reservationUpdate = await reservationEndpoints.updateReservation(ENV.RQPRO_BASE_URL,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID, newRate);
             console.log(reservationUpdate)
    
            // Expire the reservation_unlocked time
            ENV.API_RESERVATION_UID = 'RQR48D4E8';
            let expire_unlocked_time = `UPDATE smart_reservation SET reservation_edit_unlock_until = NOW() WHERE reservation_number = '${ENV.API_RESERVATION_UID}'`;
            await Database.execute('expire reservation_unlock time to lock it back',expire_unlocked_time);

            // T1633 => As a Supplier I should not be able to edit a locked Reservation (unlocked expired)

            
            // T1621 => API Supplier should not be able to edit a locked Reservation (unlocked expired)



        })

        // JOSE

        test("Submit an NTE as Requestor", async ({webActions, reservation}) => {
            console.info(`Submit NTE by the requestor.`);            
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            await reservation.submitExtension();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / checking availability with Supplier`, Element.ntv_status_waiting);
                
        })
        //
        test('SM-T1592, SM-T1593 ==> As supplier verify the submitted NTE by requestor and approve the NTE', async ({webActions, reservation})=>{
            console.info(`Verifying the submitted NTE by the requestor.`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.closeExtensionSubmitted();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / waiting for supplier approval`, Element.ntv_status_action_required);
            console.info(`Approving the NTE.`);
            await reservation.approveExtension();
            await reservation.discardChanges();
            await reservation.clickEditSegmentLink();
            await reservation.acceptExtensionRateSegmentsTerms();
            await reservation.verifyNoticeToVacateSubmitted(`Waiting for Requestor Approval / Supplier approved guest extension`, Element.ntv_status_waiting);    
                //validate the activity log
        })

        test('Validating RQ Pro reservation is Locked for support user without permission', async ({webActions, reservation})=>{
            console.info(`Validating RQ Pro reservation is Locked for support user without permission.`);
            await webActions.login(`support wihtout permission`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.closeExtensionSubmitted();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / waiting for supplier approval`, Element.ntv_status_action_required);
            console.info(`Approving the NTE.`);
            await reservation.approveExtension();
            await reservation.discardChanges();
            await reservation.clickEditSegmentLink();
            await reservation.acceptExtensionRateSegmentsTerms();
            await reservation.verifyNoticeToVacateSubmitted(`Waiting for Requestor Approval / Supplier approved guest extension`, Element.ntv_status_waiting);    
                //validate the activity log
        })

    })


})