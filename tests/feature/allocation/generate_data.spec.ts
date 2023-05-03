import { expect } from '@playwright/test'
import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe ("Generating data for allocation testing", ()=>{
    test.slow();
    const new_york = ['New York State, USA'];
    const norcal = ['Sunnyvale, CA, USA', 'Menlo Park, CA, USA', 'Santa Clara, CA, USA', 'San Francisco, CA, USA', 'Fremont, CA, USA' ];
    const seattle = ['Seattle, WA, USA', 'Bellevue, WA, USA', 'Redmond, WA, USA'];
    const epac = [`Albania`, `Algeria`, `Andorra`, `Angola`, `Austria`];
    const req = 20;

    for (let i=1; i<=req;i++ ){
        test(`Creating request # ${i}`, async ({requestEndpoints}) =>{
        //console.info(`Creating Request # ${i}`);
        //const _response = await requestEndpoints.createRequest(`https://reqstage.reloquest.com/`,`ppadmin_apikey`, 4941, new_york[0], ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL, '7863652563');
        const _response = await requestEndpoints.createRequest(ENV.YUS_LOCAL,`reloadmin_apikey`, 303, `Exmouth WA, Australia`, ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL, '7863652563');
        ENV.REQUEST_ID = JSON.parse(_response).request_id;
        console.info(`Request Id: ${ENV.REQUEST_ID}`);
        })
    } 

    test.skip(`Creating requests through the UI`, async ({webActions, dashboard, newRequest}) =>{
        await webActions.login(`requestor`, `${ENV.ALLOCATION_URL1}/client/edit/${ENV.ALLOCATION_CLIENT}`, ENV.ALLOCATION_REQUESTOR_ADMIN, ENV.ALLOCATION_REQUESTOR_PASS);
        for (let j=0; j<=req;j++ ){
            console.info(`Creating Request # ${j}`);
            dashboard.clickNewRequest();
            await newRequest.select_client('Plus-Allocation');
            await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[0], `ppadmin`,ENV.GUEST_TYPE[0],'Exmouth WA, Australia', `45`);
            await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL,ENV.GUEST_PHONE);
            await newRequest.fillCorporateHousingDetails();
            await newRequest.submitRequest();

        } 
    })
})