import OptionPage from '@enterprise_pages/OptionPage';
import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe("Test Suite Alternate Option", () => {
    test.slow();

    let guest_email = ENV.GUEST_EMAIL;
    let request_id;
    let client_share_link;
    let reservation_id;

    test("Create a new Request", async({ homePage, dashboard, newRequest, requestShow}) =>{
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.clickNewRequest();
        await newRequest.select_client(ENV.CLIENT);
        await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[0], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE[0],'Miami, FL, USA', `23`);
        await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guest_email,ENV.GUEST_PHONE);
        await newRequest.fillCorporateHousingDetails();
        await newRequest.submitRequest();
        request_id = await requestShow.getRequestId();
        console.info(`Request Id: ${request_id}`);
    })
    test("Bid an existing option", async({ homePage, dashboard, search, requestShow, option}) =>{
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.acceptRequest();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY);
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.fillRateDetails();
        await option.fillFees(ENV.FEES_TYPE[0]);
        await option.submitOption();
        await requestShow.verifyOptionSubmitted();
    })
    test("Check rate and award from option", async ({ homePage, dashboard, search, requestShow, newRequest, option}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.editRequest();
        await newRequest.expireRequest();
        await requestShow.verifyOptionRate();
        await option.awardFromOption()
    })

    test("Alternate option", async ({homePage, dashboard, search, requestShow, option}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.alternateOption(ENV.ACKNOWLEDGE_AWARD[2]);
        await option.selectProperty(ENV.PROPERTY);
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.fillRateDetails();
        await option.fillFees(ENV.FEES_TYPE[0]);
        await option.submitOption();
        await requestShow.verifyOptionSubmitted();
        await requestShow.verifyAlternateOptionSubmitted();
    })

    test("Award alternate option", async ({ homePage, dashboard, search, requestShow}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.awardAlternateOption();
        
    })

    test("Acknowledge award", async ({homePage, dashboard, search, requestShow, reservation}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        await requestShow.viewReservation();
        reservation_id = await reservation.getReservationId();
        console.info(`Reservation Id: ${reservation_id}`);
    })

    test("Verify reservation", async ({homePage, dashboard, search, requestShow, reservation}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findReservation(reservation_id);
        await search.clickRequestIdLink();
        await requestShow.viewReservation();
        await reservation.verifyReservation(reservation_id);
    })
        
})
    
