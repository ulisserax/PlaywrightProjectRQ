import B2eSearchPage from '@b2e_pages/B2eSearchPage';
import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe("Test Suite Book a ratecard", () => {
    //test.slow();

    //ENV.REQUEST_ID =`RQ9AAE0A`;

   test("Request a ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2ePropertyDetailPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.searchDestination(`Miami, FL, USA`);
      await b2eSearchPage.selectDates();
      await b2eSearchPage.housingOptionsCorporate();
      await b2eSearchPage.selectRatecard();
      console.info(ENV.REQUEST_ID);
      await b2ePropertyDetailPage.checkAvailability();
   })

   test("Bid option for B2E", async({webActions, homePage, dashboard, search, requestShow, option}) =>{
      await webActions.navigateTo(ENV.BASE_URL);
      await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
      await homePage.signIn();
      await dashboard.cardSummary();
      await dashboard.findCurrentRequest(ENV.REQUEST_ID);
      await search.clickRequestIdLink();
      await requestShow.bidPropertiesRequestedForB2E();
      await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
      await option.fillRateDetails();
      await option.fillFees(ENV.FEES_TYPE[1]);
      await option.submitOption();
      await requestShow.verifyOptionSubmitted();
  })

   test("Book ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2eQuestsPage, b2eBookingPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.viewAllQuests();
      await b2eQuestsPage.confirmNewOption(); 
      await b2eSearchPage.optionReceived();
      await b2eBookingPage.bookRateCard();
      await b2eBookingPage.paymentInformation(ENV.CREDIT_CARD, ENV.CARD_EXPIRATION, ENV.CARD_CVC, ENV.ZIP_CODE);
      await b2eBookingPage.completeYourQuest();
   })

   test("Acknowledge award for B2E", async ({}) => {

   })

   test("Modify payment and create a service issue", async ({}) => {

   })

   test("Resolve service issue for B2E", async ({}) => {

   })

 })