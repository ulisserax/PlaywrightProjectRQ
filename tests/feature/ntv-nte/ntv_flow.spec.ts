import { expect} from "@playwright/test";
import test from '@lib/BaseTest';
import ENV from "@utils/env";


test.describe.parallel('ntv flow',()=>{

    let rqpro_guest_email = `juan_1314@nt3reqrqpro.com`;

    test.beforeAll(async ({requestEndpoints, optionEndpoints})=>{
        
        //Create a request for a rqpro company and a eb2e client
        console.info(`Creating an EB2E Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, Number(ENV.RQPRO_EB2E_CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, rqpro_guest_email, `7863256523`);
        ENV.API_REQUEST_UID = `${JSON.parse(_createRequestResponse).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
    
        //Bid a option for the request
        console.info(`Submitting an Option to an EB2E RQPro Request through the V1 API.`);
        const _optionCreateResponse = await optionEndpoints.optionCreate(ENV.RQPRO_BASE_URL, ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_REQUEST_UID, Number(ENV.API_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE);
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
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Accepted`);
            
            //validate the activity log
        })

        test('Validate submission by supplier', async ({webActions, reservation})=>{
            console.info(`submitted by requestor. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Accepted`);
            
            //validate the activity log
        })

    })
    

    test.describe.serial('submitted by guest',()=>{

        test("Acknowledge the EB2E - RQPro Reservation", async ({webActions, requestShow}) => {
            console.info(`Acknowledging the Reservation.`);
            await webActions.login(`supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.API_REQUEST_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
           // await requestShow.validateServiceIssueTab();
        })

        // test("Guest Registration", async ({webActions, configurationInstance,  mailCatcher, b2eHomePage, b2eLoginPage}) =>{
        //     await webActions.login(`superadmin`, `${ENV.RQPRO_BASE_URL}/configuration/instance`, ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        //     await configurationInstance.mailPush();
        //     let subject = "ReloQuest - Success! - Reservation Confirmation";
        //     await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        //     await mailCatcher.searchEmail(ENV.RQPRO_GUEST_EMAIL.toLocaleLowerCase(), subject);
        //     let register_link = await mailCatcher.getCreateAccountLink(ENV.GUEST_EMAIL.toLocaleLowerCase());
        //     await webActions.navigateTo(register_link);
        //     await b2eHomePage.acceptCookies(); 
        //     await b2eLoginPage.registerNewGuest(ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, 'Test123!');
        //     await b2eLoginPage.verifyRegisterSuccess();
        // })

        test("As Guest submit the NTV", async ({webActions, b2eHomePage, b2eQuestDetailsPage, b2eQuestsPage}) =>{
            await webActions.navigateTo(ENV.B2E_URL);
            await b2eHomePage.acceptCookies();
            await b2eHomePage.enterCredentials(rqpro_guest_email, ENV.B2E_USER_PASSWORD);
            await b2eHomePage.signIn();
            await b2eQuestsPage.viewFutureQuest(ENV.API_REQUEST_UID);
            await b2eQuestDetailsPage.verifyFutureQuest();
            await b2eQuestDetailsPage.requestNTV();
        })

        test('Submit a Notice by requestor and validate submission', async ({webActions, reservation})=>{
            console.info(`validate submission by requestor`);            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            await reservation.verifyRqProReservationAcknowledge(ENV.API_RESERVATION_UID);
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Accepted`);
            
            //validate the activity log
        })

        test('Validate submission by supplier', async ({webActions, reservation})=>{
            console.info(`submitted by requestor. ${ENV.API_RESERVATION_UID}`);
            await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/reservation/${ENV.API_RESERVATION_UID}`, ENV.SUPPLIER_FOR_RQPRO_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await reservation.verifyNoticeToVacateSubmitted(`Notice given / Accepted`);
            
            //validate the activity log
        })

    })

})
