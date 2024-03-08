import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


test.describe.serial("Test Suite Alternate Option", () => {
    
    // test.describe.configure({ retries:2 });

    test.slow();
    let guestEmail = ENV.GUEST_EMAIL;

    test("Create a new Request @BeforeBilling @Regression @Create @SM-T1113", async({webActions, homePage, dashboard, newRequest, requestShow}) =>{
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickNewRequest();
        await newRequest.select_client(ENV.CLIENT);
        await newRequest.fillRequestDetails(ENV.REQUEST_TYPE['Corporate'], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE['Standard'],'Miami, FL, USA', `23`);
        await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guestEmail,ENV.GUEST_PHONE);
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
        await option.fillUnitDetails(ENV.UNIT_TYPE['Apartment'], ENV.KITCHEN_TYPE['Full Kitchen'],ENV.STYLE['A+'],ENV.BEDROOMS['One Bedroom'],ENV.BATHROOMS['One Bathroom']);
        await option.fillRateDetails();
        await option.fillFees(ENV.RATE_FEE_TYPE['Day']);
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
        await requestShow.alternateOption(ENV.ACKNOWLEDGE_AWARD['Submit New Option']);
        await option.selectProperty(ENV.PROPERTY);
        await option.fillUnitDetails(ENV.UNIT_TYPE['Apartment'], ENV.KITCHEN_TYPE['Full Kitchen'],ENV.STYLE['A+'],ENV.BEDROOMS['One Bedroom'],ENV.BATHROOMS['One Bathroom']);
        await option.fillRateDetails();
        await option.fillFees(ENV.RATE_FEE_TYPE['Day']);
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
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
        await requestShow.viewReservation();
        await reservation.getReservationId();
        console.info(`Reservation Id: ${ENV.RESERVATION_ID}`);
    })

    test("Verify reservation @BeforeBilling @Smoke @Reservation @SM-T1114", async ({webActions, homePage, dashboard, search, requestShow, reservation}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findReservation(ENV.RESERVATION_ID);
        await search.clickRequestIdLink();
        await requestShow.viewReservation();
        await reservation.verifyReservation(ENV.RESERVATION_ID);
    })
        
})
    
