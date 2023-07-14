import Database from "@lib/Database";
import test from "@playwright/test";
import ENV from "@utils/env";

test.skip("Test case for test purpose", async ()=> {

  // const results = await Database.execute('UPDATE smart_company SET name="nt1sup" where id = 500;');
  // console.log(results);

  // const results = await Database.execute('UPDATE smart_company SET name="nt1sup" where id = 500;');
  // console.log(results);

  //const result =  await Database.execute('Testing query test case','SELECT id,name,sub_domain,default_company_name FROM smart_company WHERE name = "nt3reqrqpro"');
  //console.log(result);

  // let data_object = JSON.parse(ENV.PREFERENCE_DATA_OBJECT);
  // console.log(data_object.req_company_name);

  // SELECT 
	// 	c.id, c.name, perm.data, JSON_EXTRACT(perm.data, CONCAT('$.', 'EXTENDED_PERMISSIONS_ENABLE_CORE_INVENTORY', '.granted')) AS core_inventory	
  //   FROM 
  //   	smart_inline_permission_set perm 
	// INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id 
	// 	AND permTmpl.name = 'share_profile_guest'
	// INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id
	// INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id 
	// 	AND c.id = 387

    // let query = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = 'lucas_5881@nt1req.com'`
    // const result =  await Database.execute('Testing query test case',query);
    // console.log(result);


    // let data_object     = JSON.parse(ENV.NT4_PREFERENCE_DATA_OBJECT);
    //     let company_query   = `UPDATE smart_company SET enable_management_services = ${1}, enable_eb2e = ${1}, enable_guest_share_version_2 = ${1}, enabled_guest_pay = ${0}, guest_pay_collect_cc = ${0}, can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;

    //     console.log(company_query)
    //     // let client_query_1  = `UPDATE smart_client SET enable_eb2e = ${1}  WHERE id  = ${data_object.client_id}`;
    //     // let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',${false}), perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',${true})`;

    //     await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on,  guest_pay=off, guest_pay_collect_cc=off and advanced_sharing_settings = not visible on the company',company_query);


    let data_object     = JSON.parse(ENV.NT5_PREFERENCE_DATA_OBJECT);
    console.log(data_object.second_property_id);

})