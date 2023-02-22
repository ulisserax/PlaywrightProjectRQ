import test  from '@lib/BaseTest';
import WebActions from '@lib/WebActions';
import ENV  from '@utils/env';


test.describe("Test Suite Hotel booking for B2E", () => {
  test.slow();

   ENV.B2E_USER =`jess_doe@nt1req.com`;

   test("Hotel Booking", async ({webActions, b2eHomePage, b2eSearchPage, b2ePropertyDetailPage, b2eQuestDetailsPage, b2eBookingPage}) => {
      await webActions.navigateTo(ENV.B2E_URL);
      await b2eHomePage.acceptCookies();
      await b2eHomePage.enterCredentials(ENV.B2E_USER, ENV.B2E_USER_PASSWORD);
      await b2eHomePage.signIn();
      await b2eSearchPage.newSearch();
      await WebActions.delay(2800);
      await b2eSearchPage.searchDestination(`Miami, FL, USA`);
      await b2eSearchPage.selectDates();
      await b2eSearchPage.hotelOptions();
      await b2eSearchPage.sort(`Price high to low`);
      await b2eSearchPage.selectHotel();
      console.info(ENV.REQUEST_ID);
      await b2ePropertyDetailPage.viewRooms();
      let count = await b2ePropertyDetailPage.unavailableRooms();
        if(count==0){
            console.info(`No available rooms...`);
            test.skip();
        }
      await b2ePropertyDetailPage.bookThisRoom();
      await b2eBookingPage.paymentInformation(ENV.CREDIT_CARD, ENV.CARD_EXPIRATION, ENV.CARD_CVC, ENV.ZIP_CODE);
      await b2eBookingPage.completeYourQuest();
      await b2eQuestDetailsPage.getReservationId();
      await b2eQuestDetailsPage.viewQuestDetailsSecond();
      await b2eQuestDetailsPage.verifyQuestDetails(ENV.RESERVATION_ID, ENV.PROPERTY_NAME, ENV.PROPERTY_ADDRESS);
      await b2eQuestDetailsPage.closeQuestDetailsSecond();
      await b2eBookingPage.cancelHotelQuest();
   })

   
})