import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe("Test Suite Book a ratecard", () => {
    //test.slow();

    let request_id;

   test("Request a ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2ePropertyDetailPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.searchDestination(`Miami, FL, USA`);
      await b2eSearchPage.selectDates();
      await b2eSearchPage.housingOptionsCorporate();
      await b2eSearchPage.selectRatecard();
      request_id = await b2ePropertyDetailPage.checkAvailability();
      console.info(request_id);
      //await b2ePropertyDetailPage.verifyRequestWasSent();
   })

   test("Bid option for B2E", ({}) => {

   })

   test("Book ratecard", ({}) => {

   })

   test("Acknowledge award for B2E", ({}) => {

   })

   test("Modify payment and create a service issue", ({}) => {

   })

   test("Resolve service issue for B2E", ({}) => {

   })

 })