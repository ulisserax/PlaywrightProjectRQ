import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe ("NORAM - Configurating Client data for the allocation testing", ()=>{
    test.slow();
    const other_noram = ['Canada', 'Greenland', 'Mexico', 'Saint Pierre and Miquelon', 'United States', 'Belize', 'Costa Rica', 
    'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama', 'Anguilla', 'Antigua and Barbuda', 'Aruba', 'The Bahamas',
    'Barbados', 'Bermuda', 'British Virgin Islands', 'Cayman Islands', 'Cuba', 'Dominica', 'Dominican Republic', 'Grenada', 
    'Guadeloupe', 'Haiti', 'Jamaica', 'Martinique', 'Montserrat', 'Netherlands Antilles', 'Puerto Rico', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'Turks and Caicos Islands', 'U.S. Virgin Islands'];
    
    const norcal = [`Sunnyvale, CA, USA`, `Menlo Park, CA, USA`, `Santa Clara, CA, USA`, `San Francisco, CA, USA`, `Fremont, CA, USA`]; 
    const seattle_nyc = [`New York State, USA`, `Seattle, WA, USA`, `Bellevue, WA, USA`, `Redmond, WA, USA`]; 
    const austin = [`Dallas, TX, USA`, `Fort Worth, TX, USA`, `Austin, TX, USA`];

    test (`Configure OTHER NORAM Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`nt1sup`, `nt2sup`]; // [`Synergy Global Housing`, `National Corporate Housing`, `LATAM`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<other_noram.length; i++){
            await client.createClientByAreaDirected(other_noram[i], ENV.ALLOCATION_SUPPLIERS);
            
        }
    })

    test (`Configure NORCAL Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`nt1sup`]; //[`Synergy Global Housing`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<norcal.length; i++){
            await client.createClientByAreaDirected(norcal[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

    test (`Configure SEATTLE - NYC Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`nt1sup`, `nt2sup`] // [`Synergy Global Housing`, `National Corporate Housing`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<seattle_nyc.length; i++){
            await client.createClientByAreaDirected(seattle_nyc[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

    test (`Configure AUSTIN Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        ENV.ALLOCATION_SUPPLIERS = [`nt3sup`]; // [`CWS Corporate Housing`];
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<austin.length; i++){
            await client.createClientByAreaDirected(austin[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

})