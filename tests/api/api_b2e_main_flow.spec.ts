import test  from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env';


test.describe.serial("Api B2E Main Flow", () => {
    
   test("POST: oauth token", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.oauth(ENV.BASE_URL, ENV.API_GRANT_TYPE, ENV.API_CLIENT_ID, ENV.API_CLIENT_SECRET, "john_doe@nt1req.com", ENV.B2E_USER_PASSWORD);
      const _response = JSON.parse(_res);
      ENV.API_TOKEN   = _response.access_token;
      console.info(`Access Token: ${ENV.API_TOKEN}`);
    
   })

   test("POST: Create a b2e request", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.createRequest(ENV.BASE_URL, ENV.API_TOKEN, ENV.START_DATE, ENV.END_DATE, 'Miami, FL, USA', '2','2','1');
      const _response = JSON.parse(_res);
      ENV.API_REQUEST_UID = `${_response.request_uid}`;
      ENV.REQUEST_ID = `RQ${_response.request_uid}`;
      console.info(`REQUEST_UID: ${ENV.API_REQUEST_UID}`);
      console.info(`REQUEST_ID: ${ENV.REQUEST_ID}`);
    
   })

   test("POST: Properties rateCard", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.propertiesRateCard(ENV.BASE_URL, ENV.API_TOKEN, ENV.REQUEST_ID, '1','1',ENV.START_DATE, ENV.END_DATE, 'Miami, FL, USA');
      const _response = JSON.parse(_res);
      for(let i = 0; i<_response.properties.length; i++){
         if(_response.properties[i].provider_name == "nt1sup"){
             console.log(_response.properties[i].reference);
             let reference = _response.properties[i].reference;
             let ref_arr = reference.split('|');
             ENV.API_CORPROPERTIES_REFERENCE = reference;
             ENV.API_RATECARD_ID =  ref_arr[ref_arr.length - 4];
             ENV.API_PROPERTY_ID =  ref_arr[ref_arr.length - 5];
             break;
         }else{
             continue;
         }
     }
     console.info(`corProperties reference: ${ENV.API_CORPROPERTIES_REFERENCE}`);
     console.info(`ratecard id: ${ENV.API_RATECARD_ID}`);
   })

   test("PUT: Go2network request", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.go2Network(ENV.BASE_URL, ENV.API_TOKEN, ENV.API_REQUEST_UID , '1', '1', '8', false, 0, '1', 0, false, '0', parseInt(ENV.API_RATECARD_ID), 'USD');
      const _response = JSON.parse(_res);
      console.info(`Success: ${_response.success}`);
      await expect(_response.success).toEqual(true);
   })

   test("POST: Option create", async ({optionEndpoints}) => {
      const _res = await optionEndpoints.optionCreate(ENV.BASE_URL, ENV.SUPPLIER_API_KEY, ENV.REQUEST_ID, parseInt(ENV.API_PROPERTY_ID), ENV.START_DATE, ENV.END_DATE);
      const _response = JSON.parse(_res);
      ENV.API_OPTION_ID = _response.option_id
      console.info(`Option id: ${ENV.API_OPTION_ID}`);
      await expect(_response.submitted).toEqual(true);
   })

   let new_reference;
   test("POST: CorProperties ", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.corProperties(ENV.BASE_URL, ENV.API_TOKEN, ENV.API_REQUEST_UID );
      const _response = JSON.parse(_res);
      console.info(`Success: ${_response.success}`);
      await expect(_response.success).toEqual(true);
      new_reference = _response.properties[0].reference
   })

   let rate_token;
   test("GET: Property Details ", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.propertyDetails(ENV.BASE_URL, ENV.API_TOKEN, new_reference);
      const _response = JSON.parse(_res);
      console.info(`Success: ${_response.success}`);
      await expect(_response.success).toEqual(true);
      rate_token = _response.options[0].rate_token;
      
   })

   test("POST: Stripe Token ", async ({stripe}) => {
      const _res = await stripe.stripeToken(ENV.CREDIT_CARD, '11', '35', ENV.CARD_CVC, ENV.STRIPE_KEY, '33331', ENV.STRIPE_GUID, ENV.STRIPE_MUID, ENV.STRIPE_PAYMENT_TOKEN, ENV.STRIPE_SID);
      const _response = JSON.parse(_res);
      ENV.STRIPE_TOKEN = _response.id;
      console.info(`stripe token: ${_response.id}`);
     
   })

   test("POST: Accept Terms Of Reservation ", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.acceptTermsOfReservation(ENV.BASE_URL, ENV.API_TOKEN, ENV.API_REQUEST_UID, ENV.API_OPTION_ID );
      const _response = JSON.parse(_res);
      console.info(`Success: ${_response.success}`);
      await expect(_response.success).toEqual(true);
   })

   test("POST: Book ", async ({v2Endpoints}) => {
      const _res = await v2Endpoints.book(ENV.BASE_URL, ENV.API_TOKEN, rate_token, ENV.STRIPE_TOKEN );
      const _response = JSON.parse(_res);
      console.info(`success: ${_response.success}`);
      ENV.RESERVATION_ID = _response.reservation.reservation.reservation_uid;
      console.info(`reservation uid: ${ENV.RESERVATION_ID}`);
      await expect(_response.success).toEqual(true);
   })

})