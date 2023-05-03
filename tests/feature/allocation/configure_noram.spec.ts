import { expect } from '@playwright/test'
import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe.only ("NORAM - Configurating Client data for the allocation testing", ()=>{
    test.slow();
    const noram = ['Canada', 'Greenland', 'Mexico', 'Saint Pierre and Miquelon', 'United States', 'Belize', 'Costa Rica', 
    'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama', 'Anguilla', 'Antigua and Barbuda', 'Aruba', 'The Bahamas',
    'Barbados', 'Bermuda', 'British Virgin Islands', 'Cayman Islands', 'Cuba', 'Dominica', 'Dominican Republic', 'Grenada', 
    'Guadeloupe', 'Haiti', 'Jamaica', 'Martinique', 'Montserrat', 'Netherlands Antilles', 'Puerto Rico', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'Turks and Caicos Islands', 'U.S. Virgin Islands'];
    const supplier = `LATAM`;

    test (`Configure NORAM Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL2}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<noram.length; i++){
            await client.createClientByAreaDirected(noram[i], supplier);
        }
    })
})