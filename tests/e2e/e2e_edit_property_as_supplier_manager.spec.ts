import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe("Edit property as supplier manager", () => {
    test.slow();
    
    test("Edit property as supplier manager", async ({webActions, homePage, dashboard, property, requestEndpoints, search, requestShow, option}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_MANAGER, ENV.SUPPLIER_MANAGER_PASSWORD);
        await homePage.signIn();
        await dashboard.clickPropertyTab();
        await property.editProperty();
        const res = await requestEndpoints.createRequest(ENV.BASE_URL,ENV.REQUESTOR_API_KEY, Number(ENV.EXCEPTION_FEE_CLIENT_ID), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL, '7863652563');
        const _response = JSON.parse(res);
        ENV.REQUEST_ID = _response.request_id;
        console.info(`Request Id: ${ENV.REQUEST_ID}`);
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.acceptRequest();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY_NAME);
        await option.propertyEditValidation();
    })


 })