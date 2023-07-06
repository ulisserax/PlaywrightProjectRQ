import { expect} from "@playwright/test";
import test from '@lib/BaseTest';
import Database from "@lib/Database";
import ENV from "@utils/env";
const Chance = require ('chance');
const chance = new Chance();



test.describe.serial.only('Share option with fees - No Guest Pay',  ()=>{
    test.slow();

    let data_object = {"req_company_name":"nt4req","req_company_id":911,"client_id":1238,"sup_company_name":"nt4sup","sup_company_id":928,"property_id":4428,"requestor_api_key":"nt4req_admin_api_key","supplier_api_key":"nt4sup_admin_api_key", "requestor_user":"nt4req_admin", "supplier_user":"nt4sup_admin"}

    test("SM-T1133: Requestor shares an option with fees, Client's default permissions are set to can set preferences only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

             
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;

        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;

        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',false)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=off and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, `7863256523`);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, data_object.supplier_api_key, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        console.info(`Expiring request ${ENV.REQUEST_ID} deadline`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, data_object.requestor_api_key, ENV.REQUEST_ID, _current_date);

        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(data_object.requestor_user, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await shareOption.shareWithGuestAndValidateModal();
        
        //Verify "Advanced sharing preferences" section or the "I underestand that the Guest will be able to award" checkbox are NOT Visible
        //Click on the send email

       

    })

    test("SM-T1134: Requestor shares an option with fees, Client's default permissions are set to can award only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

             
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;

        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;

        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',false, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted', true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=off on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, `7863256523`);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, data_object.supplier_api_key, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        console.info(`Expiring request ${ENV.REQUEST_ID} deadline`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, data_object.requestor_api_key, ENV.REQUEST_ID, _current_date);

        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(data_object.requestor_user, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await shareOption.shareWithGuestAndValidateModal();
        
       

    })

    test("SM-T1135: Requestor shares an option with fees, Client's default permissions are set to can set preferences and can award", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

             
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;

        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;

        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, `7863256523`);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, data_object.supplier_api_key, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        console.info(`Expiring request ${ENV.REQUEST_ID} deadline`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, data_object.requestor_api_key, ENV.REQUEST_ID, _current_date);

        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(data_object.requestor_user, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await shareOption.shareWithGuestAndValidateModal();
        
       

    })

    test("SM-T1140: Requestor shares an option with fees, Requestor sets sharing permissions to can set preferences only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

             
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;

        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;

        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',false)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=off and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, `7863256523`);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, data_object.supplier_api_key, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        console.info(`Expiring request ${ENV.REQUEST_ID} deadline`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, data_object.requestor_api_key, ENV.REQUEST_ID, _current_date);

        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(data_object.requestor_user, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await shareOption.shareWithGuestAndValidateModal();
        
       

    })

    test("SM-T1141: Requestor shares an option with fees, Requestor sets sharing permissions to can award only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

             
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;

        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;

        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',false, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=off on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, `7863256523`);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, data_object.supplier_api_key, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        console.info(`Expiring request ${ENV.REQUEST_ID} deadline`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, data_object.requestor_api_key, ENV.REQUEST_ID, _current_date);

        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(data_object.requestor_user, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await shareOption.shareWithGuestAndValidateModal();
        
       

    })

    test("SM-T1142: Requestor shares an option with fees, Requestor sets sharing permissions to can set preferences and can award", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

             
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;

        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;

        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, ENV.GUEST_EMAIL, `7863256523`);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, data_object.supplier_api_key, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response = JSON.parse(_res)
        ENV.API_OPTION_ID = `${_response.option_id}`;
        console.info(`Option id: ${ENV.API_OPTION_ID}`);
        await expect(_response.submitted).toEqual(true);

        console.info(`Expiring request ${ENV.REQUEST_ID} deadline`);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, data_object.requestor_api_key, ENV.REQUEST_ID, _current_date);

        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(data_object.requestor_user, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await shareOption.shareWithGuestAndValidateModal();
        
       

    })
})