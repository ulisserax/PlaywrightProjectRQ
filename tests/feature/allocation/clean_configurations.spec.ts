import { expect } from '@playwright/test'
import ENV from '@utils/env'
import test from '@lib/BaseTest'
import link from '@enterprise_objects/Link'

test.describe ("REMOVE all client directed areas", ()=>{
    test.slow();

    test (`Removing existing Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        await client.removeExistingClientDirectedAreas();
    })
})