import test  from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env';
const Validator = require('jsonschema').Validator;
const v = new Validator();


test.describe.only("Api B2E Main Flow", () => {
    
   test("Get oauth token", async ({v2Endpoints}) => {
      const _response = await v2Endpoints.oauth(ENV.BASE_URL, ENV.API_GRANT_TYPE, ENV.API_CLIENT_ID, ENV.API_CLIENT_SECRET, "john_doe@nt1req.com", ENV.B2E_USER_PASSWORD);
      ENV.API_TOKEN = JSON.parse(_response).access_token;
      console.info(`Access Token: ${ENV.API_TOKEN}`);
    
   })

   test("Create a b2e request", async ({v2Endpoints}) => {
      const _response = await v2Endpoints.createRequest(ENV.BASE_URL, ENV.API_TOKEN, ENV.START_DATE, ENV.END_DATE, 'Miami, FL, USA', '2','2','1');
      ENV.REQUEST_ID = `RQ${JSON.parse(_response).request_uid}`;
      console.info(`REQUEST_ID: ${ENV.REQUEST_ID}`);
    
   })

   test("Properties rateCard", async ({v2Endpoints}) => {
      const _response = await v2Endpoints.propertiesRateCard(ENV.BASE_URL, ENV.API_TOKEN, ENV.REQUEST_ID, '1','1',ENV.START_DATE, ENV.END_DATE, 'Miami, FL, USA');
      ENV.API_CORPROPERTIES_REFERENCE = `${JSON.parse(_response).properties[0].reference}`;
      let v = `${JSON.parse(_response).properties[0]}`;
      //console.log(JSON.stringify(v));
      console.info(`REQUEST_ID: ${ENV.API_CORPROPERTIES_REFERENCE}`);
    
   })

   test("Go2network request", async ({v2Endpoints}) => {
      const _response = await v2Endpoints.go2Network(ENV.BASE_URL, ENV.API_TOKEN, ENV.REQUEST_ID , '1', '1', '8', false, 0, '1', 0, false, '0', 129511, 'USD');
      ENV.API_CORPROPERTIES_REFERENCE = `${JSON.parse(_response).properties[0].reference}`;
      console.info(`REQUEST_ID: ${ENV.API_CORPROPERTIES_REFERENCE}`);
    
   })
})