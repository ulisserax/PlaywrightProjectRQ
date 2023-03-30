import Database from "@lib/Database";
import WebActions from "@lib/WebActions";
import test from "@playwright/test";

test.only("testing the random", async ()=> {

    // for (let i = 0 ; i <= 20 ; i++){
        
    //     console.log(await WebActions.generateRandom(0,10,[8])); 
    // }

    const con = await Database.dbConnection(process.env.DB_URL, process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD);
    console.log(con);
    const result = await Database.execute(con,`select rq_pro from smart_request where uid= "F943F8"`);
    console.log(result);
    //await Database.disposeDb(con);
})