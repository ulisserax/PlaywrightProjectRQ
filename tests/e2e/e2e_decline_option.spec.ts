import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe.only("Test Suite Decline Option", () => {
    //test.slow();

    let guest_email = ENV.GUEST_EMAIL;
    let request_id;
    let client_share_link;
    let reservation_id ;

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
    test("Bid an existing option and a new option", async({ homePage, dashboard, search, requestShow, option}) =>{
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
        await requestShow.bidOption();
        
    })
    
})
    
