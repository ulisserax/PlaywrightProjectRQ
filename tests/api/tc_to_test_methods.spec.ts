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

    let query = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = 'lucas_5881@nt1req.com'`
    const result =  await Database.execute('Testing query test case',query);
    console.log(result);
})