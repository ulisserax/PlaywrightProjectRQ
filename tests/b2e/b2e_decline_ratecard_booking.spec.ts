import test  from '@lib/BaseTest';
import WebActions from '@lib/WebActions';
import ENV  from '@utils/env';


test.describe.serial("Test Suite Decline ratecard booking for B2E", () => {
   test.slow();

   ENV.B2E_USER =`liz_doe@nt1req.com`;

   test("Request a ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2ePropertyDetailPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.newSearch();
      await WebActions.delay(4300);
      await b2eSearchPage.searchDestination(`Miami, FL`);
      await b2eSearchPage.selectDates();
      await b2eSearchPage.housingOptionsCorporate();
      await b2eSearchPage.filterByBrand('nt1sup');
      await b2eSearchPage.selectRatecard();
      console.info(ENV.REQUEST_ID);
      await b2ePropertyDetailPage.checkAvailability();
   })

   test("Bid option for B2E", async({webActions, homePage, dashboard, search, requestShow, option}) =>{
      await webActions.navigateTo(ENV.BASE_URL);
      await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
      await homePage.signIn();
      await dashboard.findCurrentRequest(ENV.REQUEST_ID);
      await search.clickRequestIdLink();
      await requestShow.bidPropertiesRequestedForB2E();
      await requestShow.b2eNotificationModal();
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
      await b2eBookingPage.verifyPendingQuest();
   })

   test("Decline option for B2E", async ({webActions, homePage, dashboard, search, requestShow}) => {
      await webActions.navigateTo(ENV.BASE_URL);
      await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
      await homePage.signIn();
      await dashboard.findCurrentRequest(ENV.REQUEST_ID);
      await search.clickRequestIdLink();
      await requestShow.declineOption(ENV.ACKNOWLEDGE_AWARD[1]);
      
  })

  test("Confirm declined option", async ({webActions, b2eHomePage, b2eSearchPage, b2eQuestsPage, b2eBookingPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.viewAllQuests();
      await b2eQuestsPage.confirmDeclinedQuest();
      
   })

   
})