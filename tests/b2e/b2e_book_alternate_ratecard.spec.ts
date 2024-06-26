import test  from '@lib/BaseTest';
import WebActions from '@lib/WebActions';
import ENV  from '@utils/env';


test.describe.serial("Test Suite Book an alternate ratecard for B2E", () => {
    test.slow();

   ENV.B2E_USER =`jane_doue@nt1req.com`;

   test("Request a ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2ePropertyDetailPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.newSearch();
      await WebActions.delay(1500);
      await b2eSearchPage.searchDestination(`Miami, FL, USA`);
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
      await option.fillUnitDetails(ENV.UNIT_TYPE['Apartment'], ENV.KITCHEN_TYPE['Full Kitchen'],ENV.STYLE['A'],ENV.BEDROOMS['One Bedroom'],ENV.BATHROOMS['One Bathroom']);
      await option.fillRateDetails();
      await option.fillFees(ENV.RATE_FEE_TYPE['Night']);
      await option.submitOption();
      await requestShow.verifyOptionSubmitted();
  })

   test("Book ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2eQuestsPage, b2eBookingPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.viewAllQuests();
      await b2eQuestsPage.confirmNewOption(ENV.REQUEST_ID); 
      await b2eSearchPage.optionReceived();
      await b2eBookingPage.bookRateCard();
      await WebActions.delay(4500);
      await b2eBookingPage.areYouSureModal();
      await b2eBookingPage.paymentInformation(ENV.CREDIT_CARD, ENV.CARD_EXPIRATION, ENV.CARD_CVC, ENV.ZIP_CODE);
      await b2eBookingPage.completeYourQuest();
      await b2eBookingPage.verifyPendingQuest();
   })

   test("Alternate option for B2E", async ({webActions, homePage, dashboard, search, requestShow, option}) => {
      await webActions.navigateTo(ENV.BASE_URL);
      await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
      await homePage.signIn();
      await dashboard.findCurrentRequest(ENV.REQUEST_ID);
      await search.clickRequestIdLink();
      await requestShow.alternateOption(ENV.ACKNOWLEDGE_AWARD['Submit New Option']);
      await requestShow.b2eNotificationModal();
      await option.selectProperty(ENV.PROPERTY);
      await option.fillUnitDetails(ENV.UNIT_TYPE['Apartment'], ENV.KITCHEN_TYPE['Full Kitchen'],ENV.STYLE['A'],ENV.BEDROOMS['One Bedroom'],ENV.BATHROOMS['One Bathroom']);
      await option.fillRateDetails();
      await option.fillFees(ENV.RATE_FEE_TYPE['Night']);
      await option.submitOption();
      await requestShow.verifyOptionSubmitted();
      await requestShow.verifyAlternateOptionSubmitted();
  })

  test("Book alternate ratecard", async ({webActions, b2eHomePage, b2eSearchPage, b2eQuestsPage, b2eBookingPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      // await b2eQuestsPage.openQuests(ENV.REQUEST_ID);
      await b2eSearchPage.viewAllQuests();
      await b2eQuestsPage.confirmAlternateQuest(ENV.REQUEST_ID);
      await b2eSearchPage.bookingAlternateOption();
      await b2eBookingPage.bookRateCard();
      await WebActions.delay(4500);
      await b2eBookingPage.areYouSureModal();
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
      await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
      await requestShow.viewReservation();
   })
})