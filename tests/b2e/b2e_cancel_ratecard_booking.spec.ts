import test  from '@lib/BaseTest';
import WebActions from '@lib/WebActions';
import ENV  from '@utils/env';


 test.describe.serial("Test Suite Cancel ratecard booking for B2E", () => {
   test.slow();
   
   ENV.B2E_USER =`bill_doue@nt1req.com`;
   
   test("Request a ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2ePropertyDetailPage, requestEndpoints}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.newSearch();
      await WebActions.delay(4300);
      await b2eSearchPage.searchDestination(`Miami, FL, USA`);
      await b2eSearchPage.selectDates();
      await b2eSearchPage.housingOptionsCorporate();
      await b2eSearchPage.searchPropertyName('nt1sup_property');
      await b2eSearchPage.selectRatecard();
      console.info(ENV.REQUEST_ID);
      await b2ePropertyDetailPage.checkAvailability();
      await b2ePropertyDetailPage.closeTab();
      const _current_date = new Date().toISOString();
      await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, ENV.REQUESTOR_API_KEY, ENV.REQUEST_ID, _current_date);
      await b2eSearchPage.requestedOptions();
      await b2eSearchPage.requestAgain();
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
      await option.fillUnitDetails(ENV.UNIT_TYPE['Apartment'], ENV.KITCHEN_TYPE['Full Kitchen'],ENV.STYLE['A'],ENV.BEDROOMS['One Bedroom'],ENV.BATHROOMS['One Bathroom']);
      await option.fillRateDetails();
      await option.fillFees(ENV.RATE_FEE_TYPE['Night']);
      await option.submitOption();
      await requestShow.verifyOptionSubmitted();
  })

   test("Book ratecard and cancel request", async ({webActions, b2eHomePage, b2eSearchPage, b2eQuestsPage, b2eBookingPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.viewAllQuests();
      await b2eQuestsPage.confirmNewOption(ENV.REQUEST_ID); 
      await b2eSearchPage.optionReceived();
      await b2eBookingPage.bookRateCard();
      await WebActions.delay(3000);
      await b2eBookingPage.areYouSureModal();
      await b2eBookingPage.paymentInformation(ENV.CREDIT_CARD, ENV.CARD_EXPIRATION, ENV.CARD_CVC, ENV.ZIP_CODE);
      await b2eBookingPage.completeYourQuest();
      await b2eBookingPage.verifyPendingQuest();
      await b2eBookingPage.cancelQuest();
   })

   
})