import Database from "@lib/Database";
import test from "@playwright/test";

test("Test case for test purpose", async ()=> {

  // const results = await Database.execute('UPDATE smart_company SET name="nt1sup" where id = 500;');
  // console.log(results);

  // const results = await Database.execute('UPDATE smart_company SET name="nt1sup" where id = 500;');
  // console.log(results);

  const result =  await Database.execute('SELECT id,name,sub_domain,default_company_name FROM smart_company WHERE name = "nt3reqrqpro"');
  console.log(result);

})