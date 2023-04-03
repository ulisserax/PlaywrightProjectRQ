import Database from "@lib/Database";
import test from "@playwright/test";

test.only("testing the random", async ()=> {

  // const results =  await Database.execute('SELECT * FROM smart_company WHERE name = "nt1sup"');

  // const results = await Database.execute('UPDATE smart_company SET name="nt1sup" where id = 500;');
  // console.log(results);

  const result =  await Database.execute('SELECT name FROM smart_company WHERE id = 500');
  console.log(result);

})