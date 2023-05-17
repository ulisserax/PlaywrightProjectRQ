import { expect } from '@playwright/test'
import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe ("EMEA - Configurating Client data for the allocation testing", ()=>{
    test.slow();
    const emea = ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 
    'Croatia', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Gibraltar', 'Greece', 
    'Holy See', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 
    'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland', 
    'Portugal', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 
    'Chad', 'Comoros', 'Ivory Coast', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 
    'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 
    'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 
    'Niger', 'Nigeria', 'Republic of the Congo', 'Reunion', 'Rwanda', 'Saint Helena, Ascension and Tristan da Cunha', 'Sao Tome and Principe',
    'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Swaziland', 'Tanzania', 
    'Togo', 'Tunisia', 'Uganda', 'Western Sahara', 'Zambia', 'Zimbabwe', 'Iran', 'Turkey', 'Iraq', 'Saudi Arabia', 
    'Yemen', 'Syria', 'Jordan', 'United Arab Emirates', 'Israel', 'Palestine', 'Lebanon', 'Oman', 'Kuwait', 'Qatar', 
    'Bahrain', 'Cyprus'];

    const london_dublin = [`London, UK`, `Dublin, Ireland`]
    // london, dublin
    ENV.ALLOCATION_SUPPLIERS = [`nt1sup`]; // [`Synergy Global Housing`];

    test (`Configure EMEA Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<emea.length; i++){
            await client.createClientByAreaDirected(emea[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

    test (`Configure LONDON - DUBLIN Client Directed By Area`, async ({webActions, client}) =>{
        await webActions.login(`requestor`, `${ENV.RQPRO_BASE_URL}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        await client.editClientSupplierManagement();
        await client.waitForLoadAreaList();
        for (let i=0; i<london_dublin.length; i++){
            await client.createClientByAreaDirected(london_dublin[i], ENV.ALLOCATION_SUPPLIERS);
        }
    })

})