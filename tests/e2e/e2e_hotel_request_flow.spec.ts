import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


    

test.describe("Create Hotel request, cancel reservation and validate emails", () => {

    let guest_email = ENV.GUEST_EMAIL;
    let request_id ;
    let hotel_reservation_id;
    

    test.only("Create a hotel request and cancel reservation", async ({homePage, dashboard, newRequest, requestShow, hotelSearchPage, search}) => {
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
        console.info(`Request Id: ${request_id}`);
        await requestShow.validateHotelSpecialInformation();
        await requestShow.searchHotelOptions();
        await hotelSearchPage.searchHotelRoomProcess();
        await hotelSearchPage.bookHotelRoom();
        hotel_reservation_id = await hotelSearchPage.verifyHotelRoomBooking();
        console.info(`Hotel reservation Id: ${hotel_reservation_id}`);
        await hotelSearchPage.backToRequest();
        await requestShow.unawardOption();
        await dashboard.findCurrentRequest(hotel_reservation_id);
        await search.clickReservationIdLink();
        await hotelSearchPage.verifyReservationWasCancelled();
    
        
    })
    
    test("Validate basic emails", async ({homePage, configurationInstance, mailCatcher}) => {
            
        await homePage.openHomePage(`${ENV.BASE_URL}/configuration/instance`);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await configurationInstance.mailPush();
        await homePage.openHomePage(ENV.MAILCATCHER_URL);
        await mailCatcher.verifyHotelsEmails(`Reservation Confirmation for supplier`, ``,ENV.SUPPLIER_EMAIL, `Reservation Confirmation for internal_id-`, `//div[@class='hotel-confirmation-header' and contains (div,'Your Booking is Confirmed') and contains(div,"${hotel_reservation_id}")]`);
        await mailCatcher.verifyHotelsEmails(`Reservation Confirmation for guest`, ``,ENV.SUPPLIER_EMAIL, `Reservation Confirmation for internal_id-`, `//div[@class='hotel-confirmation-header' and contains (div,'Your Booking is Confirmed') and contains(div,"${hotel_reservation_id}")]`);
        await mailCatcher.verifyHotelsEmails(`Reservation Confirmation for supplier`,``, ENV.SUPPLIER_EMAIL, `Reservation Confirmation for internal_id-`, `//div[@class='hotel-confirmation-header' and contains (div,'Your Booking is Confirmed') and contains(div,"${hotel_reservation_id}")]`);
        await mailCatcher.verifyHotelsEmails(`Reservation Confirmation for supplier`, ``,ENV.SUPPLIER_EMAIL, `Reservation Confirmation for internal_id-`, `//div[@class='hotel-confirmation-header' and contains (div,'Your Booking is Confirmed') and contains(div,"${hotel_reservation_id}")]`);
        
    })

})




    
