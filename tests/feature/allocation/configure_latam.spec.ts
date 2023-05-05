import { expect } from '@playwright/test'
import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe ("LATAM - Configurating Client data for the allocation testing", ()=>{
    test.slow();
    const latam = ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Falkland Islands', 
    'French Guiana', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'];
    
    ENV.ALLOCATION_SUPPLIERS = [`Synergy Global Housing`];

    test (`Configure LATAM Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL3}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<latam.length; i++){
            await client.createClientByAreaDirected(latam[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })
})