import WebActions from "@lib/WebActions";
import test from "@playwright/test";

test.skip("testing the random", async ()=> {

    for (let i = 0 ; i <= 20 ; i++){
        
        console.log(await WebActions.generateRandom(0,10,[8])); 
    }
})