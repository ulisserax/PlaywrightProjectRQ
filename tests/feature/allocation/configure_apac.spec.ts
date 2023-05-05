import { expect } from '@playwright/test'
import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe ("APAC - Configurating Client data for the allocation testing", ()=>{
    test.slow();
    const apac = ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Bhutan', 'Brunei', 'Burma', 'Cambodia', 
    'China', 'East Timor', 'Georgia', 'Hong Kong', 'India', 'Indonesia', 'Japan', 'Kazakhstan', 'Kyrgyzstan', 
    'Laos', 'Macau', 'Malaysia', 'Maldives', 'Mongolia', 'Nepal', 'North Korea', 'Pakistan', 'Philippines', 
    'Singapore', 'South Korea', 'Sri Lanka', 'Taiwan', 'Tajikistan', 'Thailand', 'Turkmenistan', 'Uzbekistan', 
    'Vietnam', 'American Samoa', 'Australia', 'Christmas Island', 'Cocos (Keeling) Islands', 'Cook Islands', 
    'Federated States of Micronesia', 'Fiji', 'French Polynesia', 'Guam', 'Kiribati', 'Marshall Islands', 
    'Nauru', 'New Caledonia', 'New Zealand', 'Niue', 'Northern Mariana Islands', 'Palau', 'Papua New Guinea', 
    'Pitcairn Islands', 'Samoa', 'Solomon Islands', 'Tokelau', 'Tonga', 'Tuvalu', 'Vanuatu', 'Wallis and Futuna Islands'];
    
    ENV.ALLOCATION_SUPPLIERS = [`Synergy Global Housing`];

    test (`Configure APAC Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL4}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<apac.length; i++){
            await client.createClientByAreaDirected(apac[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })
})