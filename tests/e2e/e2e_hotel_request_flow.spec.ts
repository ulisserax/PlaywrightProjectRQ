import test  from '@lib/BaseTest';
import WebActions from '@lib/WebActions';
import ENV  from '@utils/env';


test.describe.serial("Create Hotel request, cancel reservation and validate emails", () => {
    test.slow();
    let guest_email = ENV.GUEST_EMAIL.toLocaleLowerCase();
    let count = 0;

    test("Create a hotel request and cancel reservation", async ({webActions, homePage, dashboard, newRequest, requestShow, hotelSearchPage, search}, testInfo) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.validateDashboard();
        await dashboard.clickNewRequest();
        await newRequest.select_client(ENV.CLIENT);
        await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[1], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE[0],'Miami, FL, USA', `15`);
        await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guest_email,ENV.GUEST_PHONE);
        await newRequest.fillHotelDetails('1','2');
        await newRequest.submitHotelRequest();
        await requestShow.getRequestId();
        console.info(`Request Id: ${ENV.REQUEST_ID}`);
        await requestShow.validateHotelSpecialInformation();
        await requestShow.searchHotelOptions();
        await hotelSearchPage.searchHotelRoomProcess();
        count = await hotelSearchPage.unavailableRoom();
        if(count!=0){
            console.info(`No available rooms...`);
            test.skip();
        }
        await hotelSearchPage.bookHotelRoom();
        await hotelSearchPage.verifyHotelRoomBooking();
        console.info(`Hotel reservation Id: ${ENV.HOTEL_RESERVATION_ID}`);
        await hotelSearchPage.backToRequest();
        await requestShow.unawardOption();
        await dashboard.findCurrentRequest(ENV.HOTEL_RESERVATION_ID);
        //await search.clickReservationIdLink();
        await hotelSearchPage.verifyReservationWasCancelled(ENV.HOTEL_RESERVATION_ID);

    })
    
    test("Validate basic emails", async ({webActions, homePage, configurationInstance, mailCatcher}) => {
        if(count!=0){
            test.skip();
        }
        await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await configurationInstance.mailPush();
        await webActions.navigateTo(ENV.MAILCATCHER_URL);
        await mailCatcher.verifyHotelsEmails(`Reservation Confirmation for supplier`, `Reservation Confirmation for ${ENV.INTERNAL_ID}`, ENV.REQUESTOR_ADMIN_EMAIL, `ReloQuest - Success! - Reservation Confirmation for ${ENV.INTERNAL_ID}`, `//div[@class='hotel-confirmation-header' and contains (div,'Your Booking is Confirmed') and contains(div,"${ENV.HOTEL_RESERVATION_ID}")]`);
        await mailCatcher.verifyHotelsEmails(`Reservation Confirmation for guest`, `Reservation Confirmation for ${ENV.INTERNAL_ID}` , guest_email, `ReloQuest - Success! - Reservation Confirmation for ${ENV.INTERNAL_ID}`, `//div[@class='hotel-confirmation-header' and contains (div,'Your Booking is Confirmed') and contains(div,"${ENV.HOTEL_RESERVATION_ID}")]`);
        await mailCatcher.verifyHotelsEmails(`Billing confirmation`,`SABRE_HOTEL / ${ENV.REQUESTOR_COMPANY.toLocaleUpperCase()} hotel reservation`, ENV.BILLING_EMAIL, `SABRE_HOTEL / ${ENV.REQUESTOR_COMPANY.toLocaleUpperCase()} hotel reservation`, `//div[@class='hotel-confirmation-header' and contains (div,'Your Booking is Confirmed') and contains(div,"${ENV.HOTEL_RESERVATION_ID}")]`);
        if(ENV.AWARD_IN_PROGRESS > 0){
            console.info('The Hotel award is in progress, can not be cancelled until the award is completed...')
        }else{
            await WebActions.delay(500);
            await mailCatcher.verifyHotelsEmails(`Cancellation confirmation for requestor`, `${ENV.REQUESTOR_COMPANY}: Cancelled Hotel Reservation, ${ENV.FULL_GUEST_NAME}`,ENV.REQUESTOR_ADMIN_EMAIL, `${ENV.REQUESTOR_COMPANY}: Cancelled Hotel Reservation, ${ENV.FULL_GUEST_NAME}`, `//span//p[contains(normalize-space(),'The hotel reservation for Internal ID') and contains(text(),'has been cancelled')]`);
        }
    })
})




    
