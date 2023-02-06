import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe("Test Suite Decline Option", () => {

    let guest_email   = ENV.GUEST_EMAIL;
    const property_name = ENV.SUPPLIER_COMPANY + "Property_#";


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
    test("Bid an existing option and a new option", async({webActions, homePage, dashboard, search, requestShow, option, property}) =>{
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY);
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.fillRateDetails();
        await option.fillFees(ENV.FEES_TYPE[0]);
        await option.submitOption();
        await requestShow.verifyOptionSubmitted();
        await requestShow.bidOption();
        await option.clickNewProperty();
        await property.fillPropertyOverview(property_name, 'miami beach','Yes','Central A/C','1 bedroom','No Pets');
        await property.addImage(`images/property2.jpeg`);
        await property.cancellationAndTaxFeePolicy();
        await option.fillContactInformation(ENV.SUPPLIER_EMAIL);
        await property.createNewProperty();
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.fillRateDetails();
        await option.fillFees(ENV.FEES_TYPE[0]);
        await option.submitOption();
        await requestShow.verifyOptionSubmitted();
    })

    test("Verify option avialability", async ({webActions, homePage, dashboard, search, requestShow, newRequest}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.editRequest();
        await newRequest.expireRequest();
        await requestShow.verifyOptionAvailability();
    })

    test("Confirm option avialability", async ({webActions, homePage, dashboard, search, requestShow}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.confirmOptionAvailability();
    })

    test("Share with guest and Award by preference", async ({webActions, homePage, dashboard, search, requestShow, shareOption}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        const current_page = await requestShow.getCurrentLink();
        const share_link = await shareOption.shareWithGuest();
        await webActions.navigateTo(share_link);
        await shareOption.submitPreferences();
        await webActions.navigateTo(current_page);
        await requestShow.awardByPreference();
    })

    test("Decline award", async ({webActions, homePage, dashboard, search, requestShow}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.declineOption(ENV.ACKNOWLEDGE_AWARD[1]);
    })

    test("Award option", async ({webActions, homePage, dashboard, search, requestShow}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.awardSecondChoiceOption();
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
    
