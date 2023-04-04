import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


test.describe.serial("Test Suite Alternate Option", () => {
    
    // test.describe.configure({ retries:2 });

    test.slow();
    let guest_email = ENV.GUEST_EMAIL.toLocaleLowerCase();

    test("Create a new Request", async({webActions, homePage, dashboard, newRequest, requestShow}) =>{
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickNewRequest();
        await newRequest.select_client(ENV.CLIENT);
        await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[0], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE[0],'Miami, FL, USA', `23`);
        await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guest_email,ENV.GUEST_PHONE);
        await newRequest.fillCorporateHousingDetails();
        await newRequest.submitRequest();
        await requestShow.getRequestId();
        console.info(`Request Id: ${ENV.REQUEST_ID}`);
    })
    test("Bid an existing option", async({ webActions,homePage, dashboard, search, requestShow, option}) =>{
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY);
        await option.addPropertyImages(`images/property1.jpeg`);
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.fillRateDetails();
        await option.fillFees(ENV.FEES_TYPE[0]);
        await option.submitOption();
        await requestShow.verifyOptionSubmitted();
    })
    test("Check rate and award from option", async ({webActions, homePage, dashboard, search, requestShow, newRequest, option}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.editRequest();
        await newRequest.expireRequest();
        await requestShow.verifyOptionRate();
        await option.awardFromOption()
    })

    test("Alternate option", async ({webActions, homePage, dashboard, search, requestShow, option}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
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

    test("Award alternate option", async ({webActions, homePage, dashboard, search, requestShow}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.awardAlternateOption();
        
    })

    test("Acknowledge award", async ({webActions, homePage, dashboard, search, requestShow, reservation}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        await requestShow.viewReservation();
        await reservation.getReservationId();
        console.info(`Reservation Id: ${ENV.RESERVATION_ID}`);
    })

    test("Verify reservation", async ({webActions, homePage, dashboard, search, requestShow, reservation}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findReservation(ENV.RESERVATION_ID);
        await search.clickRequestIdLink();
        await requestShow.viewReservation();
        await reservation.verifyReservation(ENV.RESERVATION_ID);
    })
        
})
    
