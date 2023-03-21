import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


test.describe("Test Suite Exception Fee", () => { //serial
    test.slow();
    const location = ["New York State, USA","Central Park North, Manhattan, New York, NY, USA","Melrose, Manhattan, NY, USA","Manhattan, New York, NY, USA","New York, NY, USA","Queens, NY, USA","Bronx, NY, USA"];

    for(let i = 0; i < location.length; i++){
        test(`Create a new Request via api and validate the exception fee for ${location[i]}`, async({requestEndpoints, webActions,homePage, dashboard, search, requestShow, option}) =>{
            const _response = await requestEndpoints.createRequest(ENV.BASE_URL,ENV.REQUESTOR_API_KEY, Number(ENV.EXCEPTION_FEE_CLIENT_ID), location[i], ENV.START_DATE, ENV.END_DATE);
            ENV.REQUEST_ID = JSON.parse(_response).request_id;
            console.info(`Request Id: ${ENV.REQUEST_ID}`);
            await webActions.navigateTo(ENV.BASE_URL);
            await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await homePage.signIn();
            await dashboard.findCurrentRequest(ENV.REQUEST_ID);
            await search.clickRequestIdLink();
            await requestShow.bidOption();
            await option.fillRateDetails();
            await option.verifyExceptionFeeApplied(location[i]);
        })
    }   
})
    
