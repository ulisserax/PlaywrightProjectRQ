import test  from '@lib/BaseTest';
import ENV  from '@utils/env';



test.describe("Test Suite Exception Fee @BeforeBilling @Smoke @Request @SM-T1119", () => { //serial
    test.slow();
    const exception_obj = [
        {
            "location": "Buffalo, NY, USA",
            "nt1_referral_commission": "8%",
            "nt1_reloquest_fee": "22.00",
            "nt2_referral_commission": "15.00",
            "nt2_reloquest_fee": "7%",
            "nt3_referral_commission": "13.00",
            "nt3_reloquest_fee": "9%"
        },
        {
            "location": "Weston, FL, USA",
            "nt1_referral_commission": "20",
            "nt1_reloquest_fee": "11.00",
            "nt2_referral_commission": "20.00",
            "nt2_reloquest_fee": "11.00",
            "nt3_referral_commission": "20.00",
            "nt3_reloquest_fee": "11.00"
        },
        {
            "location": "Tampa, FL, USA",
            "nt1_referral_commission": "20.00",
            "nt1_reloquest_fee": "11.00",
            "nt2_referral_commission": "20.00",
            "nt2_reloquest_fee": "11.00",
            "nt3_referral_commission": "20.00",
            "nt3_reloquest_fee": "11.00"
        },
        {
            "location": "Las Vegas, NV, USA",
            "nt1_referral_commission": "15.00",
            "nt1_reloquest_fee": "7%",
            "nt2_referral_commission": "15.00",
            "nt2_reloquest_fee": "7%",
            "nt3_referral_commission": "15.00",
            "nt3_reloquest_fee": "7%"
        },
        {
            "location": "Atlanta, GA, USA",
            "nt1_referral_commission": "18.00",
            "nt1_reloquest_fee": "26.00",
            "nt2_referral_commission": "6%",
            "nt2_reloquest_fee": "6.6%",
            "nt3_referral_commission": "15.00",
            "nt3_reloquest_fee": "7%"
        },
        {
            "location": "Columbus, GA, USA",
            "nt1_referral_commission": "15.00",
            "nt1_reloquest_fee": "7%",
            "nt2_referral_commission": "6%",
            "nt2_reloquest_fee": "6.6%",
            "nt3_referral_commission": "15.00",
            "nt3_reloquest_fee": "7%"
        }
    ];
    let nt1_option_id, nt2_option_id, nt3_option_id;
    for(let i = 0; i < exception_obj.length; i++){
        

        test(`Create a new Request via api and validate the exception fee for ${exception_obj[i].location}`, async({requestEndpoints, optionEndpoints}) =>{

            const _response = await requestEndpoints.createRequest(ENV.BASE_URL,ENV.REQUESTOR_API_KEY, Number(ENV.NT1_EXCEPTION_FEE_CLIENT_ID), exception_obj[i].location, ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL, '7863652563', ENV.API_REQUEST_TYPE['Corporate']);

            ENV.REQUEST_ID = JSON.parse(_response).request_id;
            console.info(`Request Id: ${ENV.REQUEST_ID}`);

            //bid option from nt1sup_admin_api_key property_id = 131907
            const _res_nt1  = await optionEndpoints.optionCreate(ENV.BASE_URL, `nt1sup_admin_api_key`, `jane_doe@nt1sup.com`, ENV.REQUEST_ID, 131907, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Night']);
            const _resp_nt1 = JSON.parse(_res_nt1)
            nt1_option_id = `${_resp_nt1.option_id}`;
            console.info(`nt1 Option id: ${nt1_option_id}`);
            //bid option from nt2sup
            const _res_nt2  = await optionEndpoints.optionCreate(ENV.BASE_URL, `nt2sup_admin_api_key`, `jane_doe@nt2sup.com`, ENV.REQUEST_ID, 46115, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Night']);
            const _resp_nt2 = JSON.parse(_res_nt2)
            nt2_option_id = `${_resp_nt2.option_id}`;
            console.info(`nt2 Option id: ${nt2_option_id}`);
            //bid option from nt3sup
            const _res_nt3  = await optionEndpoints.optionCreate(ENV.BASE_URL, `nt3sup_admin_api_key`, `jane_doe@nt3sup.com`, ENV.REQUEST_ID, 129823, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Night']);
            const _resp_nt3 = JSON.parse(_res_nt3)
            nt3_option_id = `${_resp_nt3.option_id}`;
            console.info(`nt3 Option id: ${nt3_option_id}`);

        })

        test(`Verify exception fee applied for nt1sup - area ${exception_obj[i].location}`, async ({webActions, homePage,option})=>{
            await webActions.navigateTo(`${ENV.BASE_URL}/option/edit/${nt1_option_id}`);
            await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
            await homePage.signIn();
            await option.verifyExceptionFeeApplied('nt1sup',exception_obj[i].nt1_referral_commission, exception_obj[i].nt1_reloquest_fee);
        })

        test(`Verify exception fee applied for nt2sup - area ${exception_obj[i].location}`, async ({webActions, homePage,option})=>{
            await webActions.navigateTo(`${ENV.BASE_URL}/option/edit/${nt2_option_id}`);
            await homePage.enterCredentials("nt2sup_admin", ENV.SUPPLIER_ADMIN_PASSWORD);
            await homePage.signIn();
            await option.verifyExceptionFeeApplied('nt2sup',exception_obj[i].nt2_referral_commission, exception_obj[i].nt2_reloquest_fee);
        })

        test(`Verify exception fee applied for nt3sup - area ${exception_obj[i].location}`, async ({webActions, homePage,option})=>{
            await webActions.navigateTo(`${ENV.BASE_URL}/option/edit/${nt3_option_id}`);
            await homePage.enterCredentials("nt3sup_admin", ENV.SUPPLIER_ADMIN_PASSWORD);
            await homePage.signIn();
            await option.verifyExceptionFeeApplied('nt3sup',exception_obj[i].nt3_referral_commission, exception_obj[i].nt3_reloquest_fee);
        })
    }   
})
    
