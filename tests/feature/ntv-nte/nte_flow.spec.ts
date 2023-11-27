import { expect} from "@playwright/test";
import test from '@lib/BaseTest';
import ENV from "@utils/env";
import Element from "@enterprise_objects/Element";


test.describe.parallel('nte flow -- ',()=>{
    test.slow();

    let rqpro_guest_email = `tom_smith_02@nt3reqrqpro.com`;

    test.beforeAll(async ({requestEndpoints, optionEndpoints})=>{
        
        //Create a request for a rqpro company and a eb2e client
        console.info(`Creating an EB2E Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, rqpro_guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
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

    test.describe.serial('NTE submitted by guest and declined by the supplier --',()=>{

        test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
        })

        test("As guest submit the NTE", async ({webActions, b2eHomePage, b2eQuestDetailsPage, b2eQuestsPage, b2eSearchPage}) =>{
            await webActions.navigateTo(ENV.B2E_URL);
            await b2eHomePage.acceptCookies();
            await b2eHomePage.enterCredentials(rqpro_guest_email, ENV.B2E_USER_PASSWORD);
            await b2eHomePage.signIn();
            await b2eSearchPage.viewAllQuests();
            await b2eQuestsPage.viewFutureQuest(ENV.API_REQUEST_UID);
            await b2eQuestDetailsPage.verifyFutureQuest();
            await b2eQuestDetailsPage.requestNTE();
        })
    
        test('As requestor verify the submitted NTE by guest', async ({webActions, reservation})=>{
            console.info(`Verifying the submitted NTE by the guest.`);            
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / checking availability with Supplier`, `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]//span[1][@class='orange']`);
                
                //validate the activity log
        })
    
        test('As supplier verify the submitted NTE by guest and decline the NTE', async ({webActions, reservation})=>{
            console.info(`Verifying the submitted NTE by the guest. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.closeExtensionSubmitted();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / waiting for supplier approval`, `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input ntv-status-action-required')]`);
            console.info(`Declining the NTE.`);
            await reservation.declineExtensionBySupplier();
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Extension declined (see activity log for any additional details)`, `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]//span[@class='ntv-red-text']`);    
                //validate the activity log
        })
    
        test('As requestor validate NTE declined by supplier', async ({webActions, reservation})=>{
            console.info(`Validate nte declined by supplier`);            
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Extension declined (see activity log for any additional details)`, `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]//span[@class='ntv-red-text']`);
                
                //validate the activity log
        })

    })
  
    test.describe.serial('NTE submitted by requestor, accepted by supplier and declined by the requestor -- ',()=>{

        test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
        })

        test('As requestor submit the NTE', async ({webActions, reservation})=>{
            console.info(`Submit NTE by the requestor.`);            
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            await reservation.submitExtension();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / checking availability with Supplier`, Element.ntv_status_waiting);
                
                //validate the activity log
        })
    
        test('As supplier verify the submitted NTE by requestor and approve the NTE', async ({webActions, reservation})=>{
            console.info(`Verifying the submitted NTE by the requestor. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.closeExtensionSubmitted();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / waiting for supplier approval`, Element.ntv_status_action_required);
            console.info(`Approving the NTE.`);
            await reservation.approveExtension();
            await reservation.acceptExtensionRateSegmentsTerms();
            await reservation.verifyNoticeToVacateSubmitted(`Waiting for Requestor Approval / Supplier approved guest extension`, Element.ntv_status_waiting);    
                //validate the activity log
        })
    
       
        test('As requestor decline the NTE', async ({webActions, reservation,dashboard,search})=>{
            console.info(`Declining NTE by the requestor.`);            
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyNoticeToVacateSubmitted(`Supplier approved guest extension / waiting for Requestor approval`, Element.ntv_status_action_required);
            await reservation.declineExtensionByRequestor();
            await dashboard.findReservation(ENV.API_RESERVATION_UID);
            await search.clickReservationIdLink();
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Extension declined (see activity log for any additional details)`, Element.ntv_status_declined);
                
                //validate the activity log
        })

        test('As supplier verify the NTE was declined by the requestor', async ({webActions, reservation})=>{
            console.info(`Verifying extension was declined byt requestor. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Extension declined (see activity log for any additional details)`, Element.ntv_status_declined);
             
                //validate the activity log
        })

    })

    test.describe.serial('NTE submitted by requestor, accepted by supplier and accepted by the requestor -- ',()=>{

        test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
        })

        test('As requestor submit the NTE', async ({webActions, reservation})=>{
            console.info(`Submit NTE by the requestor.`);            
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            await reservation.submitExtension();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / checking availability with Supplier`, Element.ntv_status_waiting);
                
                //validate the activity log
        })
    
        test('As supplier verify the submitted NTE by requestor and approve the NTE', async ({webActions, reservation})=>{
            console.info(`Verifying the submitted NTE by the requestor. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.closeExtensionSubmitted();
            await reservation.verifyNoticeToVacateSubmitted(`Guest requested an Extension / waiting for supplier approval`, Element.ntv_status_action_required);
            console.info(`Approving the NTE.`);
            await reservation.approveExtension();
            await reservation.acceptExtensionRateSegmentsTerms();
            await reservation.verifyNoticeToVacateSubmitted(`Waiting for Requestor Approval / Supplier approved guest extension`, Element.ntv_status_waiting);    
                //validate the activity log
        })
    
       
        test('As requestor accept the NTE', async ({webActions, reservation,dashboard,search})=>{
            console.info(`Accepting NTE by the requestor.`);            
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyNoticeToVacateSubmitted(`Supplier approved guest extension / waiting for Requestor approval`, Element.ntv_status_action_required);
            await reservation.acceptExtensionByRequestor();
            await dashboard.findReservation(ENV.API_RESERVATION_UID);
            await search.clickReservationIdLink();
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Accepted`, Element.ntv_status_accepted);
            
                
                //validate the activity log
        })

        test('As supplier verify the NTE was accepted by the requestor', async ({webActions, reservation})=>{
            console.info(`Verifying extension was accepted by requestor. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Accepted`, Element.ntv_status_accepted);
              
                //validate the activity log
        })

        // test("As Guest verify the accepted NTE", async ({webActions, b2eHomePage, b2eQuestDetailsPage, b2eQuestsPage}) =>{
        //     await webActions.navigateTo(ENV.B2E_URL);
        //     await b2eHomePage.acceptCookies();
        //     await b2eHomePage.enterCredentials(rqpro_guest_email, ENV.B2E_USER_PASSWORD);
        //     await b2eHomePage.signIn();
        //     await b2eQuestsPage.viewFutureQuest(ENV.API_REQUEST_UID);
        //     await b2eQuestDetailsPage.verifyFutureQuest();
        //     await b2eQuestDetailsPage.requestNTV();
        // })


    })

})
