import { expect} from "@playwright/test";
import test from '@lib/BaseTest';
import Database from "@lib/Database";
import ENV from "@utils/env";
const Chance = require ('chance');
const chance = new Chance();


test.describe('Share option with fees - Guest Pay On and Collect Credit Card On',  ()=>{
    test.slow();

    test("SM-T1129: Requestor shares an option with a Fees, Client's default permissions are set to can award only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, shareOption})=>{

        let fees_amount     = {"parking_amount":chance.floating({min:100, max:350, fixed:2}),"pet_fee_amount":chance.floating({min:100, max:250, fixed:2}),"application_fee_amount":chance.floating({min:70, max:250, fixed:2}),"redecoration_fee_amount":chance.floating({min:60, max:350, fixed:2}),"pet_deposit_amount":chance.floating({min:10, max:450, fixed:2}),"security_deposit_amount":chance.floating({min:10, max:650, fixed:2})};
        let data_object     = JSON.parse(ENV.NT6_PREFERENCE_DATA_OBJECT);
        let company_query   = `UPDATE smart_company SET enable_management_services = 1, enable_eb2e = 1, enable_guest_share_version_2 = 1, enabled_guest_pay = 1, guest_pay_collect_cc = 1, can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',false)`;

        await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on,  guest_pay=on, guest_pay_collect_cc=on and advanced_sharing_settings=not_visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=off in the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, `${data_object.requestor_api_key}`, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, data_object.guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res  = await optionEndpoints.optionCreateFull(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day'],1,1,2,fees_amount.parking_amount,"FLAT",fees_amount.pet_fee_amount,fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.security_deposit_amount);
        
        const _response = JSON.parse(_res);
        await expect(_response.submitted).toEqual(true);
        let first_option_id;
        first_option_id = `${_response.option_id}`;
        console.info(`First option id: ${first_option_id}`);
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
        await shareOption.completeGuestShare(data_object.guest_email);
        await shareOption.validateShareLogHistory(true,false);
        const guest_share_link      = await shareOption.getSharedLink();
        let token                   = guest_share_link.substring(guest_share_link.indexOf('Token=')).replace("Token=","");
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${data_object.guest_email}' and sta.token = '${token}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        console.info('Validating database values');
        await expect(option_permissions_obj[0].opt_id).toEqual(first_option_id);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeTruthy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeFalsy();

    })

    test("SM-T1138: Requestor shares an option with a Fees, Client's default permissions are set to can set preferences only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, shareOption})=>{

        let fees_amount     = {"parking_amount":chance.floating({min:100, max:350, fixed:2}),"pet_fee_amount":chance.floating({min:100, max:250, fixed:2}),"application_fee_amount":chance.floating({min:70, max:250, fixed:2}),"redecoration_fee_amount":chance.floating({min:60, max:350, fixed:2}),"pet_deposit_amount":chance.floating({min:10, max:450, fixed:2}),"security_deposit_amount":chance.floating({min:10, max:650, fixed:2})};
        let data_object     = JSON.parse(ENV.NT6_PREFERENCE_DATA_OBJECT);
        let company_query   = `UPDATE smart_company SET enable_management_services = 1, enable_eb2e = 1, enable_guest_share_version_2 = 1, enabled_guest_pay = 1, guest_pay_collect_cc = 1 , can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data , '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted', false, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true)`;

        await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on, guest_pay=on, guest_pay_collect_cc=on and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=off and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, data_object.guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res  = await optionEndpoints.optionCreateFull(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day'],1,1,2,fees_amount.parking_amount,"FLAT",fees_amount.pet_fee_amount,fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.security_deposit_amount);
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
        await shareOption.validateShareModal('not visible', 'visible');
        await shareOption.completeGuestShare(data_object.guest_email);
        await shareOption.validateShareLogHistory(false,true);
        const guest_share_link      = await shareOption.getSharedLink();
        let token                   = guest_share_link.substring(guest_share_link.indexOf('Token=')).replace("Token=","");
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${data_object.guest_email}' and sta.token='${token}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        console.info('Validating database values');
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeTruthy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(1);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();

    })

    test("SM-T1139, SM-T1155, SM-T1158, SM-T1160, SM-T1165, SM-T1166: Requestor shares an option with a Fees, Client's default permissions are set to can set preferences and can award", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, shareOption,b2eHomePage,b2eCheckoutPage,b2eOptionsPage, b2eBookingPage, b2eQuestDetailsPage})=>{

        let fees_amount     = {"parking_amount":chance.floating({min:100, max:350, fixed:2}),"pet_fee_amount":chance.floating({min:100, max:250, fixed:2}),"application_fee_amount":chance.floating({min:70, max:250, fixed:2}),"redecoration_fee_amount":chance.floating({min:60, max:350, fixed:2}),"pet_deposit_amount":chance.floating({min:10, max:450, fixed:2}),"security_deposit_amount":chance.floating({min:10, max:650, fixed:2})};
        let data_object     = JSON.parse(ENV.NT6_PREFERENCE_DATA_OBJECT); 
        let company_query   = `UPDATE smart_company SET enable_management_services = 1, enable_eb2e = 1, enable_guest_share_version_2 = 1, enabled_guest_pay = 1, guest_pay_collect_cc = 1, can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true)`;

        await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on, guest_pay=on, guest_pay_collect_cc=on and advanced_sharing_settings= not visible on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, data_object.guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
            
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res  = await optionEndpoints.optionCreateFull(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day'],1,1,2,fees_amount.parking_amount,"FLAT",fees_amount.pet_fee_amount,fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.security_deposit_amount);
        const _res1 = await optionEndpoints.optionCreate(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.second_property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _res2 = await optionEndpoints.optionCreateNoParkingNoFeesNoTaxesNoMaidServices(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.second_property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response  = JSON.parse(_res);
        const _response1 = JSON.parse(_res1);
        const _response2 = JSON.parse(_res2);
        await expect(_response.submitted).toEqual(true);
        await expect(_response1.submitted).toEqual(true);
        await expect(_response2.submitted).toEqual(true);
        let first_option_id, second_option_id, third_option_id;
        first_option_id  = `${_response.option_id}`;
        second_option_id = `${_response1.option_id}`;
        third_option_id = `${_response2.option_id}`;
        console.info(`First option id: ${first_option_id}`);
        console.info(`Second option id: ${second_option_id}`);
        console.info(`Third option id: ${third_option_id}`);
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
        await shareOption.completeGuestShare(data_object.guest_email);
        await shareOption.validateShareLogHistory(true,true);
        const guest_share_link = await shareOption.getSharedLink();
        await webActions.navigateTo(guest_share_link);
        let token = guest_share_link.substring(guest_share_link.indexOf('Token=')).replace("Token=","");
        await b2eHomePage.eb2eLogin(ENV.B2E_USER_PASSWORD);
        //==> SM-T1155
        await b2eOptionsPage.validateHereYourOptionsModal();
        await b2eOptionsPage.clickSelectSpecificOption(second_option_id);
        //==> SM-T1158
        await b2eOptionsPage.validateSelectedPropertyName(data_object.second_property_name);
        // await b2eOptionsPage.validateOptionPreferenceSelected(second_option_id,ENV.OPTIONS_PREFERENCES.third);
        await b2eOptionsPage.selectOptionPreferences(first_option_id,ENV.OPTIONS_PREFERENCES.first);
        await b2eOptionsPage.validateSelectedPropertyName(data_object.property_name);
        await b2eOptionsPage.selectOptionPreferences(second_option_id,ENV.OPTIONS_PREFERENCES.second);
        await b2eOptionsPage.selectOptionPreferences(third_option_id,ENV.OPTIONS_PREFERENCES.third);
        await b2eOptionsPage.validateFees(first_option_id,'Yes',true);
        await b2eOptionsPage.validateFees(second_option_id,'Yes',false);
        await b2eOptionsPage.validateFees(third_option_id,'No',false);
        await b2eOptionsPage.verifyOptionPreference(ENV.OPTIONS_PREFERENCES.first);
        //==> SM-T1160
        await b2eOptionsPage.acceptTerms();
        //==> SM-T1165
        await b2eOptionsPage.validateGuestResponsabilityModal(data_object.property_name);
        await b2eOptionsPage.validateGuestResponsabilitySharedOption(data_object.property_name, ENV.OPTIONS_PREFERENCES.first);
        await b2eOptionsPage.showGuestResponsabilityPropertyFees(data_object.property_name);
        let parking_charge = Number(((Number(fees_amount.parking_amount)/(Number(ENV.LENGTH)+1))*30).toFixed(2));
        // console.log(ENV.LENGTH);
        // console.log(parking_charge);
        await b2eOptionsPage.validateFeesAndDepositPaidByGuest(fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.parking_amount);
        await b2eOptionsPage.validateFeesAndDepositPaidByCompany();
        await b2eOptionsPage.validateOtherChoiceInGuestResponsabilitModal(data_object.second_property_name, ENV.OPTIONS_PREFERENCES.second);
        await b2eOptionsPage.validateOtherChoiceInGuestResponsabilitModal(data_object.second_property_name, ENV.OPTIONS_PREFERENCES.third);
        await b2eOptionsPage.clickContinueButton();
        //==> SM-T1166
        await b2eOptionsPage.validateOptionCharges(first_option_id);
        await b2eOptionsPage.validateBillToGuestCharges(data_object.property_name, fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,parking_charge);
        //THIS WAS COMMENTED DUE TO THE BILL TO GUEST CHANGES
        //await b2eOptionsPage.validateBookButton();
        //await b2eOptionsPage.acknowledgeFeesAndDeposits();
        //await b2eOptionsPage.validateBookButton();
        await b2eCheckoutPage.paymentInformation('4242424242424242','09/39','233','33331');
        await b2eCheckoutPage.completeYourQuest();
        await b2eBookingPage.verifySpecificSharedPendingQuest(data_object.property_name);
        await b2eQuestDetailsPage.verifySharedQuestDetails(data_object.property_name, fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.parking_amount);

        
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${data_object.guest_email}' and sta.token='${token}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        var opt_permissions         = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        var __FOUND                 = opt_permissions.findIndex(function(post, index) {
            if(post.opt_id == `${first_option_id}`)
                return true;
        });
        // console.log(__FOUND)
        // console.log(opt_permissions);
        // console.log(opt_permissions[__FOUND]);
        console.info(`Validating the permissions stored in the db.`);
        await expect(opt_permissions[__FOUND].opt_id).toEqual(first_option_id);
        await expect(opt_permissions[__FOUND].is_awardable_by_guest).toBeTruthy();
        await expect(opt_permissions[__FOUND].collect_money_from_guest).toBeTruthy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();  
    
    })

    test("SM-T1150: Requestor shares an option with a Fees, Requestor sets sharing permissions to can award only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, shareOption})=>{

        let fees_amount     = {"parking_amount":chance.floating({min:100, max:350, fixed:2}),"pet_fee_amount":chance.floating({min:100, max:250, fixed:2}),"application_fee_amount":chance.floating({min:70, max:250, fixed:2}),"redecoration_fee_amount":chance.floating({min:60, max:350, fixed:2}),"pet_deposit_amount":chance.floating({min:10, max:450, fixed:2}),"security_deposit_amount":chance.floating({min:10, max:650, fixed:2})};
        let data_object     = JSON.parse(ENV.NT6_PREFERENCE_DATA_OBJECT); 
        let company_query   = `UPDATE smart_company SET enable_management_services = 1, enable_eb2e = 1, enable_guest_share_version_2 = 1, enabled_guest_pay = 1, guest_pay_collect_cc = 1 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1  = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',false )`;

        await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on, guest_pay=on, guest_pay_collect_cc=on and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=off on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, data_object.guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res  = await optionEndpoints.optionCreateFull(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day'],1,1,2,fees_amount.parking_amount,"FLAT",fees_amount.pet_fee_amount,fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.security_deposit_amount);
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
        await shareOption.validateAdvancedSettings(true, false);
        await shareOption.uncheckGuestCanAward(true);
        await shareOption.completeGuestShare(data_object.guest_email);
        await shareOption.validateShareLogHistory(false,false);
        const guest_share_link      = await shareOption.getSharedLink();
        let token                   = guest_share_link.substring(guest_share_link.indexOf('Token=')).replace("Token=","");
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${data_object.guest_email}' and sta.token='${token}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        console.info('Validating database values');
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeTruthy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(1);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeFalsy();

    })

    test("SM-T1151: Requestor shares an option with a Fees, Requestor sets sharing permissions to can set preferences only", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, shareOption})=>{

        let fees_amount     = {"parking_amount":chance.floating({min:100, max:350, fixed:2}),"pet_fee_amount":chance.floating({min:100, max:250, fixed:2}),"application_fee_amount":chance.floating({min:70, max:250, fixed:2}),"redecoration_fee_amount":chance.floating({min:60, max:350, fixed:2}),"pet_deposit_amount":chance.floating({min:10, max:450, fixed:2}),"security_deposit_amount":chance.floating({min:10, max:650, fixed:2})};
        let data_object = JSON.parse(ENV.NT6_PREFERENCE_DATA_OBJECT); 
        let company_query = `UPDATE smart_company SET enable_management_services = 1, enable_eb2e = 1, enable_guest_share_version_2 = 1, enabled_guest_pay = 1, guest_pay_collect_cc = 1 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',false, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true )`;

        await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on, guest_pay=on, guest_pay_collect_cc=on and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=off and guest_can_select_preferences=on on the client',client_query_2);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, data_object.guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res  = await optionEndpoints.optionCreateFull(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day'],1,1,2,fees_amount.parking_amount,"FLAT",fees_amount.pet_fee_amount,fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.security_deposit_amount);
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
        await shareOption.validateShareModal('visible', 'visible');
        await shareOption.validateAdvancedSettings(false, true);
        await shareOption.completeGuestShare(data_object.guest_email);
        await shareOption.validateShareLogHistory(false,true);
        const guest_share_link      = await shareOption.getSharedLink();
        let token                   = guest_share_link.substring(guest_share_link.indexOf('Token=')).replace("Token=","");
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${data_object.guest_email}' and sta.token = '${token}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        let option_permissions_obj  = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        
        await expect(option_permissions_obj[0].opt_id).toEqual(ENV.API_OPTION_ID);
        await expect(option_permissions_obj[0].is_awardable_by_guest).toBeTruthy();
        await expect(option_permissions_obj[0].collect_money_from_guest).toBeTruthy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(1);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();

    })

    test("SM-T1152, SM-T1155, SM-T1158, SM-T1160, SM-T1165, SM-T1167: Requestor shares an option with Fees, Requestor sets sharing permissions to can set preferences and can award", async({requestEndpoints, optionEndpoints,webActions, homePage, dashboard, search, shareOption,b2eHomePage, b2eOptionsPage,b2eBookingPage,b2eCheckoutPage,b2eQuestDetailsPage})=>{

        let fees_amount     = {"parking_amount":chance.floating({min:100, max:350, fixed:2}),"pet_fee_amount":chance.floating({min:100, max:250, fixed:2}),"application_fee_amount":chance.floating({min:70, max:250, fixed:2}),"redecoration_fee_amount":chance.floating({min:60, max:350, fixed:2}),"pet_deposit_amount":chance.floating({min:10, max:450, fixed:2}),"security_deposit_amount":chance.floating({min:10, max:650, fixed:2})};
        let data_object = JSON.parse(ENV.NT6_PREFERENCE_DATA_OBJECT);   
        let company_query = `UPDATE smart_company SET enable_management_services = 1, enable_eb2e = 1, enable_guest_share_version_2 = 1, enabled_guest_pay = 1, guest_pay_collect_cc = 1 , can_view_advanced_permissions_when_sharing = "ROLE_REQUESTOR" WHERE id  = ${data_object.req_company_id}`;
        let client_query_1 = `UPDATE smart_client SET enable_eb2e = 1  WHERE id  = ${data_object.client_id}`;
        let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_SELECT_ADVANCED_OPTION_PREFERENCES.granted',true)`;
        let client_query_3 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_ADVANCED_OPTION_PREFERENCES.granted',true)`;


        await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on, guest_pay=on, guest_pay_collect_cc=on and advanced_sharing_settings=visible to requestor on the company',company_query);
        await Database.execute('Set eb2e=on on the client',client_query_1);
        await Database.execute('Set guest_can_award=on and guest_can_select_preferences=on on the client',client_query_2);
        await Database.execute('Set enable_advanced_preferences=on on the client',client_query_3);

        console.info(`Creating a Request through the V1 API.`);
        const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, data_object.requestor_api_key, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, data_object.guest_email, `7863256523`, ENV.API_REQUEST_TYPE['Corporate']);
        ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
        const _res  = await optionEndpoints.optionCreateFull(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day'],1,1,2,fees_amount.parking_amount,"FLAT",fees_amount.pet_fee_amount,fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.security_deposit_amount);
        const _res1 = await optionEndpoints.optionCreate(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.second_property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _res2 = await optionEndpoints.optionCreateNoParkingNoFeesNoTaxesNoMaidServices(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.second_property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day']);
        const _response  = JSON.parse(_res);
        const _response1 = JSON.parse(_res1);
        const _response2 = JSON.parse(_res2);
        await expect(_response.submitted).toEqual(true);
        await expect(_response1.submitted).toEqual(true);
        await expect(_response2.submitted).toEqual(true);
        let first_option_id, second_option_id, third_option_id;
        first_option_id  = `${_response.option_id}`;
        second_option_id = `${_response1.option_id}`;
        third_option_id = `${_response2.option_id}`;
        console.info(`First option id: ${first_option_id}`);
        console.info(`Second option id: ${second_option_id}`);
        console.info(`Third option id: ${third_option_id}`);
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
        await shareOption.completeGuestShare(data_object.guest_email);
        await shareOption.validateShareLogHistory(true,true);
        const guest_share_link = await shareOption.getSharedLink();
        await webActions.navigateTo(guest_share_link);
        let token = guest_share_link.substring(guest_share_link.indexOf('Token=')).replace("Token=","");
        await b2eHomePage.eb2eLogin(ENV.B2E_USER_PASSWORD);
        //==> SM-T1155
        await b2eOptionsPage.validateHereYourOptionsModal();
        await b2eOptionsPage.clickSelectSpecificOption(second_option_id);
        //==> SM-T1158
        await b2eOptionsPage.validateSelectedPropertyName(data_object.second_property_name);
        await b2eOptionsPage.validateOptionPreferenceSelected(second_option_id,ENV.OPTIONS_PREFERENCES.first);
        await b2eOptionsPage.selectOptionPreferences(first_option_id,ENV.OPTIONS_PREFERENCES.too_far);
        await b2eOptionsPage.selectOptionPreferences(second_option_id,ENV.OPTIONS_PREFERENCES.too_far);
        await b2eOptionsPage.selectOptionPreferences(third_option_id,ENV.OPTIONS_PREFERENCES.not_my_style);
        await b2eOptionsPage.validateFees(first_option_id,'Yes',true);
        await b2eOptionsPage.validateFees(second_option_id,'Yes',false);
        await b2eOptionsPage.validateFees(third_option_id,'No',false);
        await b2eOptionsPage.verifyOptionPreference(ENV.OPTIONS_PREFERENCES.too_far);
        //==> SM-T1160
        await b2eOptionsPage.acceptTerms();
        //==> SM-T1165
        await b2eOptionsPage.validateGuestResponsabilityModal(data_object.property_name);
        await b2eOptionsPage.validateGuestResponsabilitySharedOption(data_object.property_name, ENV.OPTIONS_PREFERENCES.too_far);
        await b2eOptionsPage.showGuestResponsabilityPropertyFees(data_object.property_name);
        await b2eOptionsPage.validateFeesAndDepositPaidByGuest(fees_amount.pet_fee_amount,fees_amount.redecoration_fee_amount,fees_amount.pet_deposit_amount,fees_amount.parking_amount);
        await b2eOptionsPage.validateFeesAndDepositPaidByCompany();
        await b2eOptionsPage.validateOtherChoiceInGuestResponsabilitModal(data_object.second_property_name, ENV.OPTIONS_PREFERENCES.too_far);
        await b2eOptionsPage.validateOtherChoiceInGuestResponsabilitModal(data_object.second_property_name, ENV.OPTIONS_PREFERENCES.not_my_style);
        await b2eOptionsPage.clickContinueButton();
        // //==> SM-T1167
        await b2eOptionsPage.validateModalHeader('Preference(s) selected!');
        await b2eHomePage.acceptCookies();
        await b2eOptionsPage.validateCardOptionPreference(data_object.property_name,ENV.OPTIONS_PREFERENCES.too_far);

        
        let guest_permission_query  = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = '${data_object.guest_email}' and sta.token='${token}'`;
        let result                  = await Database.execute('select the option_permissions value',guest_permission_query);
        var opt_permissions         = JSON.parse(result[0].option_permissions);
        let data_obj                = JSON.parse(result[0].data);
        var __FOUND                 = opt_permissions.findIndex(function(post, index) {
            if(post.opt_id == `${first_option_id}`)
                return true;
        });
        // console.log(__FOUND)
        // console.log(opt_permissions);
        // console.log(opt_permissions[__FOUND]);
        console.info(`Validating the permissions stored in the db.`);
        
        await expect(opt_permissions[__FOUND].opt_id).toEqual(first_option_id);
        await expect(opt_permissions[__FOUND].is_awardable_by_guest).toBeTruthy();
        await expect(opt_permissions[__FOUND].collect_money_from_guest).toBeTruthy();
        await expect(result[0].understand_guest_can_award_checkbox).toEqual(0);
        await expect(data_obj.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted).toBeTruthy();

    })
})