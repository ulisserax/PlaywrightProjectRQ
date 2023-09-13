import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


test.describe("Client Directed - All Areas", () => {
    // test.describe.configure({ retries:2 });
    test.slow();

    let client_name = 'nt1req_client_directed';
    test("SM-T1377, SM-T1378, SM-T1379, SM-T1380 ==> Create a client directed by area configuration", async({webActions, myAccount, client, dashboard}) =>{
        await webActions.login(`requestor`, ENV.BASE_URL, ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await dashboard.clickMyAccountTab();
        await myAccount.searchAndEditClient(client_name);
        await client.editClientSupplierManagement();
        // SM-T1377 ==> Create a Client Directed by Area Configuration
        await client.createClientByAreaDirectedIncludedAndExcludedSupplier('San Francisco', 'nt1sup','nt3sup');
        await client.validatingClientDirectedArea('San Francisco', 'No', 'nt1sup','nt3sup' );
        // SM-T1378 ==> Client Directed - All Areas - Add and Remove a supplier from the included list
        await client.createClientDirectedAllAreaInclude('nt1sup');
        await client.removeClientDirectedAllAreasIncludedSupplier('nt1sup');
        // SM-T1379 ==> Client Directed - All Areas - Add and Remove a supplier from the excluded list
        await client.createClientDirectedAllAreaExclude('nt3sup');
        await client.removeClientDirectedAllAreasExcludedSupplier('nt3sup');
        // SM-T1380 ==> Edit and Remove a client directed by area configuration
        await client.EditExistingClientDirectedAreas('San Francisco - Updated','nt1sup', 'nt3sup');
        await client.validatingClientDirectedArea('San Francisco - Updated', 'Yes', 'nt3sup','nt1sup' );
        await client.removeExistingClientDirectedAreas();
        
    })
 
})