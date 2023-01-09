import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


    let guest_email = ENV.GUEST_EMAIL;
    let request_id ;
    let hotel_reservation_id;


test("Create a hotel request and cancel reservation", async ({homePage, dashboard, newRequest, requestShow, hotelSearchPage, search}) => {
    test.slow();
    await homePage.openHomePage(ENV.BASE_URL);
    await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
    await homePage.signIn();
    await dashboard.validateDashboard();
    await dashboard.cardSummary();
    await dashboard.clickNewRequest();
    await newRequest.select_client(ENV.CLIENT);
    await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[1], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE[0],'Miami, FL, USA', `15`);
    await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guest_email,ENV.GUEST_PHONE);
    await newRequest.fillHotelDetails('1','2');
    await newRequest.submitHotelRequest();
    request_id = await requestShow.getRequestId();
    await requestShow.validateHotelSpecialInformation();
    await requestShow.searchHotelOptions();
    await hotelSearchPage.searchHotelRoomProcess();
    await hotelSearchPage.bookHotelRoom();
    hotel_reservation_id = await hotelSearchPage.verifyHotelRoomBooking();
    await hotelSearchPage.backToRequest();
    await requestShow.unawardOption();
    await dashboard.findCurrentRequest(hotel_reservation_id);
    await search.clickReservationIdLink();
    await hotelSearchPage.verifyReservationWasCancelled();
})



    
