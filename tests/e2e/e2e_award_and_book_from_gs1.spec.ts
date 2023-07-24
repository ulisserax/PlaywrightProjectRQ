import test from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env';
const Chance = require("chance");
const chance = new Chance();

test.describe.serial.only("Award a Corporate option from the GS1.0", () => {
    test.slow();

    test("POST: Create an Enterprise - Corporate Housing - Request", async ({requestEndpoints}) => {
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
        const _response = JSON.parse(_res);
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        //Expiring the request
        console.info(`Expiring the Request.`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, ENV.REQUESTOR_API_KEY, ENV.API_REQUEST_UID, _current_date);
    })

    test("Share a Corporate option and Award from the GS1.0", async({homePage, dashboard, search, requestShow, shareOption, webActions}) =>{
        console.info('Sharing the option with the Guest using GS1.0');
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.API_REQUEST_UID);
        await search.clickRequestIdLink();
        const currentPage = await requestShow.getCurrentLink();
        const shareLink = await shareOption.shareWithGuest();
        await webActions.navigateTo(shareLink);
        await shareOption.awardOption();
    })

})

test.describe.only("Book a Hotel room from the GS1.0", () => {
    test.slow();
    let guestEmail = ENV.GUEST_EMAIL.toLocaleLowerCase();
    let count = 0;

    test("Book an Enterprise - Hotel Only - Request", async ({webActions, homePage, hotelSearchPage, shareOption, dashboard, newRequest, requestShow }) => {
        console.info(`Creating an Enterprise Request through the Enterprise UI.`);
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickNewRequest();
        await newRequest.select_client(ENV.CLIENT);
        await newRequest.fillRequestDetails(ENV.REQUEST_TYPE['Hotels'], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE['Standard'],'Miami, FL, USA', `15`);
        await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guestEmail,ENV.GUEST_PHONE);
        await newRequest.fillHotelDetails('1','2');
        await newRequest.submitHotelRequest();
        await requestShow.getRequestId();
        await requestShow.searchHotelOptions();
        let hotel_selected = await hotelSearchPage.searchHotelRoomProcess(-1);
        count = await hotelSearchPage.unavailableRoom();
        if(count!=0){ 
            console.info(`No available rooms, searching again...`);
            await hotelSearchPage.backToSearchResults();
            await hotelSearchPage.searchHotelRoomProcess(hotel_selected);
            count = await hotelSearchPage.unavailableRoom();
            if(count!=0){
                console.info(`No available rooms...`);
                test.skip();
            }
        }
        await hotelSearchPage.addHotelRoom();
        await hotelSearchPage.hotelBackToRequest();
        const currentPage = await requestShow.getCurrentLink();
        const shareLink = await shareOption.shareWithGuest();
        await webActions.navigateTo(shareLink);
        await shareOption.bookOption();
        // SM-18198 will fix a Production issue, then we can un-comment the below lines
        //await hotelSearchPage.verifyHotelRoomBooking();
        //console.info(`Hotel reservation Id: ${ENV.HOTEL_RESERVATION_ID}`);
    })
})
