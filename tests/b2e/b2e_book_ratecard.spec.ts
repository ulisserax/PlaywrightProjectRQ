import test  from '@lib/BaseTest';
import WebActions from '@lib/WebActions';
import ENV  from '@utils/env';


 test.describe.serial("Test Suite Book a ratecard for B2E", () => {
    test.slow();

    ENV.B2E_USER =`james_doe@nt1req.com`;

   test("Request a ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2ePropertyDetailPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.newSearch();
      await WebActions.delay(2800);
      await b2eSearchPage.searchDestination(`Miami, FL, USA`);
      await b2eSearchPage.selectDates();
      await b2eSearchPage.housingOptionsCorporate();
      await b2eSearchPage.searchPropertyName('NT1supProperty');
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
      await option.addPropertyImages(ENV.IMAGE_PATH);
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

   test("Acknowledge award for B2E", async ({webActions, homePage, dashboard, search, requestShow}) => {
      await webActions.navigateTo(ENV.BASE_URL);
      await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
      await homePage.signIn();
      await dashboard.findCurrentRequest(ENV.REQUEST_ID);
      await search.clickRequestIdLink();
      await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
      await requestShow.viewReservation();
   })

   test("Modify payment and create a service issue", async ({webActions, b2eHomePage, b2eSearchPage, b2eQuestsPage, b2eQuestDetailsPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.viewAllQuests();
      await b2eQuestsPage.viewFutureQuest();
      await b2eQuestDetailsPage.verifyFutureQuest();
      await b2eQuestDetailsPage.viewQuestDetails();
      await b2eQuestDetailsPage.verifyPaymentMethod(`1111`);
      await b2eQuestDetailsPage.fillPayment('4242424242424242','09/39','233','33331');
      await b2eQuestDetailsPage.savePaymentMethod();
      await b2eQuestDetailsPage.verifyPaymentMethod(`4242`);
      await b2eQuestDetailsPage.cancelPaymentModal();
      await b2eQuestDetailsPage.closeQuestDetails();

      //Create a service issue
   })

   test.skip("Resolve service issue for B2E", async ({webActions, homePage, dashboard, search, requestShow, serviceIssue}) => {
      await webActions.navigateTo(ENV.BASE_URL);
      await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
      await homePage.signIn();
      await dashboard.findCurrentRequest(ENV.REQUEST_ID);
      await search.clickRequestIdLink();
      await requestShow.clickServiceIssue();
      await requestShow.viewServiceIssue();
      await serviceIssue.resolveServiceIssue();
  })
 })