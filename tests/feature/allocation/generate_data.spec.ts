import ENV from '@utils/env'
import test from '@lib/BaseTest'

test.describe ("Generating data for allocation testing", ()=>{
    test.slow();
    const new_york = ['New York State, USA'];
    const norcal = ['Sunnyvale, CA, USA', 'Menlo Park, CA, USA', 'Santa Clara, CA, USA', 'San Francisco, CA, USA', 'Fremont, CA, USA' ];
    const seattle = ['Seattle, WA, USA', 'Bellevue, WA, USA', 'Redmond, WA, USA'];
    const epac = [`Albania`, `Algeria`, `Andorra`, `Angola`, `Austria`];
    const austin = [`Dallas, TX, USA`, `Fort Worth, TX, USA`, `Austin, TX, USA`];
    const req = 5;
    function getRan(max) {
        return Math.floor(Math.random() * max);
      }

    for (let i=1; i<=req;i++ ){
        test(`Creating request # ${i}`, async ({requestEndpoints}) =>{
        const _response = await requestEndpoints.createRequest(ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_API_KEY, +ENV.ALLOCATION_CLIENT, seattle[2], ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL, '7863652563');
        //const _response = await requestEndpoints.createRequest(ENV.YUS_LOCAL,`reloadmin_apikey`, 366, `Austin TX, USA`, ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL, '7863652563');
        ENV.REQUEST_ID = JSON.parse(_response).request_id;
        console.info(`Request Id: ${ENV.REQUEST_ID}`);
        })
    } 

        test(`Creating requests through the UI`, async ({webActions, dashboard, newRequest}) =>{
            await webActions.login(`requestor`, ENV.RQPRO_BASE_URL, ENV.RQPRO_REQ_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
            for (let j=0; j<=req;j++ ){
                console.info(`Creating Request # ${j}`);
                dashboard.clickNewRequest();
                await newRequest.select_client(ENV.ALLOCATION_CLIENT_NAME);
                await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[0], ENV.RQPRO_REQ_ADMIN,ENV.GUEST_TYPE[0],seattle[getRan(2)], `45`);
                await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL,ENV.GUEST_PHONE);
                await newRequest.fillCorporateHousingDetails();
                await newRequest.submitRequest();
            }
        })
})