import { expect} from "@playwright/test";
import test from '@lib/BaseTest';
import Database from "@lib/Database";
import ENV from "@utils/env";
const Chance = require ('chance');
const chance = new Chance();




test.describe('Share option with fees - No Guest Pay',  ()=>{
    test.slow();

    test("SM-T1133: Requestor shares an option with fees, Client's default permissions are set to can set preferences only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

        let data_object     = JSON.parse(ENV.PREFERENCE_DATA_OBJECT);
        let guest_email     = `${chance.first()}_${chance.integer({min:0,max:9999})}@${data_object.req_company_name}.com`.toLocaleLowerCase();
        let company_query   = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',false)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=off and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, `${data_object.requestor_api_key}`, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, guest_email, `7863256523`);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
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
        await shareOption.shareOptionWithGuest();
        await shareOption.validateShareModal('not visible', 'not visible');
        await shareOption.completeGuestShare(guest_email);
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${guest_email}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        console.info('Validating database values');
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeFalsy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeFalsy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();

        //Pending the UI Permision validation
      
    })

    test("SM-T1134: Requestor shares an option with fees, Client's default permissions are set to can award only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

        let data_object     = JSON.parse(ENV.PREFERENCE_DATA_OBJECT);
        let guest_email     = `${chance.first()}_${chance.integer({min:0,max:9999})}@${data_object.req_company_name}.com`.toLocaleLowerCase();
        let company_query   = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',false, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted', true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=off on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, guest_email, `7863256523`);
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
        await shareOption.shareOptionWithGuest();
        await shareOption.validateShareModal('not visible', 'not visible');
        await shareOption.completeGuestShare(guest_email);
        
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${guest_email}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        console.info('Validating database values');
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeFalsy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeFalsy();

        //Pending the UI Permision validation

    })

    test("SM-T1135: Requestor shares an option with fees, Client's default permissions are set to can set preferences and can award", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

        let data_object     = JSON.parse(ENV.PREFERENCE_DATA_OBJECT); 
        let guest_email     = `${chance.first()}_${chance.integer({min:0,max:9999})}@${data_object.req_company_name}.com`.toLocaleLowerCase();
        let company_query   = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, guest_email, `7863256523`);
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
        await shareOption.shareOptionWithGuest();
        await shareOption.validateShareModal('not visible', 'not visible');
        await shareOption.completeGuestShare(guest_email);
        
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${guest_email}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        console.info('Validating database values');
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeFalsy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();

        //Pending the UI Permision validation
    })

    test("SM-T1140: Requestor shares an option with fees, Requestor sets sharing permissions to can set preferences only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

        let data_object     = JSON.parse(ENV.PREFERENCE_DATA_OBJECT); 
        let guest_email     = `${chance.first()}_${chance.integer({min:0,max:9999})}@${data_object.req_company_name}.com`.toLocaleLowerCase();
        let company_query   = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',false)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=off and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, guest_email, `7863256523`);
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
        await shareOption.shareOptionWithGuest();
        await shareOption.validateShareModal('visible', 'not visible');
        await shareOption.completeGuestShare(guest_email);
        
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${guest_email}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        console.info('Validating database values');
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeFalsy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeFalsy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();

        //Pending the UI Permision validation

    })

    test("SM-T1141: Requestor shares an option with fees, Requestor sets sharing permissions to can award only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

        let data_object = JSON.parse(ENV.PREFERENCE_DATA_OBJECT); 
        let guest_email = `${chance.first()}_${chance.integer({min:0,max:9999})}@${data_object.req_company_name}.com`.toLocaleLowerCase();
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',false, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=off on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, guest_email, `7863256523`);
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
        await shareOption.shareOptionWithGuest();
        await shareOption.validateShareModal('visible', 'not visible');
        await shareOption.completeGuestShare(guest_email);
        
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${guest_email}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeFalsy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeFalsy();

        //Pending the UI Permision validation

    })

    test("SM-T1142: Requestor shares an option with fees, Requestor sets sharing permissions to can set preferences and can award", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, requestShow, shareOption})=>{

        let data_object = JSON.parse(ENV.PREFERENCE_DATA_OBJECT);   
        let guest_email = `${chance.first()}_${chance.integer({min:0,max:9999})}@${data_object.req_company_name}.com`.toLocaleLowerCase();
        let company_query = `UPDATE smart_company SET enabled_guest_pay = 0, enable_guest_share_version_2 = 1, enable_management_services = 1, enable_eb2e = 1, guest_pay_collect_cc = 0 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true)`;

        await Database.execute('Set guest_pay=off, guest_share_version_2=on, rqpro=on, eb2e=on, guest_pay_collect_cc=off and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, guest_email, `7863256523`);
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
        await shareOption.shareOptionWithGuest();
        await shareOption.validateShareModal('visible', 'not visible');
        await shareOption.completeGuestShare(guest_email);
        
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${guest_email}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeFalsy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();

        //Pending the UI Permision validation

    })
})