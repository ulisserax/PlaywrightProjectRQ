import test from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env';
const Chance = require("chance");
const chance = new Chance();

test.describe.serial.only("Award from the GS1.0", () => {
    test.slow();
    

    test("POST: Create an Enterprise Request", async ({requestEndpoints}) => {
        console.info(`Creating an Enterprise Request through the V1 API.`);
        const _response = await requestEndpoints.createRequest(ENV.BASE_URL, ENV.REQUESTOR_API_KEY, 
            Number(ENV.CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, 
            ENV.GUEST_LASTNAME, ENV.RQPRO_GUEST_FOR_SERVICE, ENV.GUEST_PHONE, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.API_REQUEST_UID = `${JSON.parse(_response).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
    })

    test("POST: Submit an Option to the Enterprise Request", async ({optionEndpoints, requestEndpoints}) => {
        console.info(`Submitting an Option to the Enterprise Request through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, ENV.SUPPLIER_API_KEY, ENV.SUPPLIER_EMAIL, ENV.API_REQUEST_UID, Number(ENV.API_NT1_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Night']);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        //Expiring the request
        console.info(`Expiring the Request.`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, ENV.REQUESTOR_API_KEY, ENV.API_REQUEST_UID, _current_date);
    })

    test("Share a Corporate option and Award form the GS1.0", async({homePage, dashboard, search, requestShow, shareOption, webActions}) =>{
        console.info('Sharing the option with the Guest using GS1.0');
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.API_REQUEST_UID);
        await search.clickRequestIdLink();
        const currentPage = await requestShow.getCurrentLink();
        const shareLink = await shareOption.shareWithGuest();
        await webActions.navigateTo(shareLink);
        
    })

})

test.describe("Book from the GS1.0", () => {
    test.slow();
    
    test("POST: Create an Enterprise Request", async ({requestEndpoints}) => {
        console.info(`Creating an Enterprise Request through the V1 API.`);
        const _response = await requestEndpoints.createRequest(ENV.BASE_URL, ENV.REQUESTOR_API_KEY, 
            Number(ENV.CLIENT), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, 
            ENV.GUEST_LASTNAME, ENV.RQPRO_GUEST_FOR_SERVICE, ENV.GUEST_PHONE, ENV.API_REQUEST_TYPE['Hotels']);
        ENV.API_REQUEST_UID = `${JSON.parse(_response).request_id}`;
        console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
    })



})
