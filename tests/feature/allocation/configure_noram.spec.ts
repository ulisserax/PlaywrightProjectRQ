import { expect } from '@playwright/test'
import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe.only ("NORAM - Configurating Client data for the allocation testing", ()=>{
    test.slow();
    const other_noram = ['Canada', 'Greenland', 'Mexico', 'Saint Pierre and Miquelon', 'United States', 'Belize', 'Costa Rica', 
    'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama', 'Anguilla', 'Antigua and Barbuda', 'Aruba', 'The Bahamas',
    'Barbados', 'Bermuda', 'British Virgin Islands', 'Cayman Islands', 'Cuba', 'Dominica', 'Dominican Republic', 'Grenada', 
    'Guadeloupe', 'Haiti', 'Jamaica', 'Martinique', 'Montserrat', 'Netherlands Antilles', 'Puerto Rico', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'Turks and Caicos Islands', 'U.S. Virgin Islands'];
    
    const norcal = [`Sunnyvale`, `Menlo Park`, `Santa Clara`, `San Francisco`, `Fremont`]; 
    const seattle_nyc = [`New York State, USA`, `Seattle`, `Bellevue`, `Redmond`]; 
    const austin = [``];

    test.only (`Configure OTHER NORAM Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL2}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`Synergy Global Housing`, `National Corporate Housing`, `LATAM`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<other_noram.length; i++){
            await client.createClientByAreaDirected(other_noram[i], ENV.ALLOCATION_SUPPLIERS);
            
        }
    })

    test (`Configure NORCAL Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL2}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`Synergy Global Housing`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<norcal.length; i++){
            await client.createClientByAreaDirected(norcal[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

    test (`Configure SEATTLE - NYC Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL2}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`Synergy Global Housing`, `National Corporate Housing`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<seattle_nyc.length; i++){
            await client.createClientByAreaDirected(seattle_nyc[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

    test.skip (`Configure AUSTIN Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL2}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`CWS Corporate Housing`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<austin.length; i++){
            await client.createClientByAreaDirected(austin[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

})