import test  from '@lib/BaseTest';
import ENV  from '@utils/env';
const Chance = require ('chance');
const chance = new Chance();


test.describe.serial("Test Suite for Segments Validation", () => {
    
    test.slow();
        
    test(`Create request via api, bid and `, async({requestEndpoints, webActions,homePage, dashboard, search, requestShow, option}) =>{
        

        const _response = await requestEndpoints.createRequest(ENV.BASE_URL,ENV.REQUESTOR_API_KEY, Number(ENV.NT1_EXCEPTION_FEE_CLIENT_ID), 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,ENV.GUEST_EMAIL, '7863652563', ENV.API_REQUEST_TYPE['Corporate']);

        ENV.REQUEST_ID = JSON.parse(_response).request_id;
        console.info(`Request Id: ${ENV.REQUEST_ID}`);
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY);
        await option.fillUnitDetails(ENV.UNIT_TYPE['Apartment'], ENV.KITCHEN_TYPE['Full Kitchen'],ENV.STYLE['A+'],ENV.BEDROOMS['One Bedroom'],ENV.BATHROOMS['One Bathroom']);
        await option.selectRateType(ENV.RATE_FEE_TYPE['Day']);
        await option.fillRateDetails();
        await option.fillSecondRateDetails();
        await option.selectTaxable(`taxable`); //taxable or nontaxable
        await option.fiillFirstTax(`1`,`${chance.floating({ min: 70, max: 299, fixed: 2 })}`,`DAY`);
        await option.fillSecondTax(`2`,`${chance.integer({ min: 1, max: 10})}`,`PERCENT`);
        await option.fillFees(ENV.RATE_FEE_TYPE['Day']);
        await option.fillSecondFees(`Property Fee`,`${chance.integer({ min: 100, max: 1500})}`,ENV.RATE_FEE_TYPE['Flat']);
        await option.fillDeposit(1);
        await option.totalRateCalculation('Days');
        await option.selectRateType(ENV.RATE_FEE_TYPE['Night']);
        await option.totalRateCalculation('Nights');
        await option.submitOption();
        await requestShow.verifyOptionSubmitted();
    })

    test("Award option", async ({webActions, homePage, dashboard, search, requestShow, requestEndpoints}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        const _current_date = new Date().toISOString();
        await requestEndpoints.updateDeadlineRequest(ENV.BASE_URL, ENV.REQUESTOR_API_KEY, ENV.REQUEST_ID, _current_date);
        await search.clickRequestIdLink();
        await requestShow.awardOption();
    })
    //ENV.REQUEST_ID = 'RQF571C3';
    test("Vaidate reservation segments @BeforeBilling @Smoke @Reservation @SM-T1121", async ({webActions, homePage, dashboard, search, requestShow, reservation}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD['Accept']);
        await requestShow.viewReservation();
        await reservation.validateReservationSegments();
        await reservation.clickEditSegmentLink();
        await reservation.validateRateSegmentTotals();
        await reservation.editRateSegment();
        await reservation.deleteSegment();
        await reservation.submitSegmentChanges();
        await reservation.clickEditSegmentLink();
        await reservation.addSecondRateSegment();
        await reservation.validateRateSegmentTotals();
        await reservation.submitSegmentChanges();
        await reservation.clickEditSegmentLink();
        await reservation.expandTaxesSection();
        await reservation.addNewTax(`3`,`${chance.integer({ min: 100, max: 600})}`,ENV.RATE_FEE_TYPE['Flat']);
        await reservation.expandFeesSection();
        await reservation.addNewFees(`Other Fees`,`${chance.integer({ min: 100, max: 600})}`,ENV.RATE_FEE_TYPE['Flat']);
        await reservation.expandDepositsSection();
        await reservation.addNewDeposit(1,2);
        await reservation.submitSegmentChanges();
        await reservation.validateReservationTotal();
    })
});