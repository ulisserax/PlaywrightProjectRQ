import Database from "@lib/Database";
import test from "@playwright/test";
import ENV from "@utils/env";

test.only("Test case for test purpose", async ()=> {

  // const results = await Database.execute('UPDATE smart_company SET name="nt1sup" where id = 500;');
  // console.log(results);

  // const results = await Database.execute('UPDATE smart_company SET name="nt1sup" where id = 500;');
  // console.log(results);

  //const result =  await Database.execute('Testing query test case','SELECT id,name,sub_domain,default_company_name FROM smart_company WHERE name = "nt3reqrqpro"');
  //console.log(result);

  let data_object = JSON.parse(ENV.PREFERENCE_DATA_OBJECT);
  console.log(data_object.req_company_name);


})