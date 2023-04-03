import Database from "@lib/Database";
import WebActions from "@lib/WebActions";
import test from "@playwright/test";
import ENV from "@utils/env";

test.skip("testing the random", async ()=> {

    // for (let i = 0 ; i <= 20 ; i++){
        
    //     console.log(await WebActions.generateRandom(0,10,[8])); 
    // }

  Database.dbConnection(ENV.DB_URL, ENV.DB_NAME, ENV.DB_USERNAME, ENV.DB_PASSWORD, 'SELECT * from `smart_request` where `uid`= "F943F8"');
    //Database.execute(con, 'SELECT * from `smart_request` where `uid`= "F943F8"');
})