import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


test.describe("Client Directed - All Areas", () => {
    // test.describe.configure({ retries:2 });
    test.slow();

    let client_name = 'nt1req_client_directed';
    test.skip("SM-T1377 ==> Create a client directed by area configuration", async({webActions, myAccount, client, dashboard, requestShow}) =>{
        await webActions.login(`requestor`, ENV.BASE_URL, ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await dashboard.clickMyAccountTab();
        await myAccount.searchAndEditClient(client_name);
        await client.editClientSupplierManagement();
        
        await client.createClientDirectedAllAreaInclude('nt1sup');
        await client.createClientDirectedAllAreaExclude('nt3sup');
        await client.createClientByAreaDirected('San Francisco', ['nt1sup']);
        await client.removeExistingClientDirectedAreas();
    })
 
    // test("SM-T1378 ==> Add and Remove a Supplier form the included list", async({webActions, homePage, dashboard, newRequest, requestShow}) =>{})

    // test("SM-T1379 ==> Add and Remove a Supplier form the excluded list", async({webActions, homePage, dashboard, newRequest, requestShow}) =>{})

    // test("SM-T1380 ==> Edit and remove a client directed by area configuration", async({webActions, homePage, dashboard, newRequest, requestShow}) =>{})
})