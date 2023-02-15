import test  from '@lib/BaseTest';
import ENV  from '@utils/env';
const Chance = require ('chance');
const chance = new Chance();


test.describe.only("Test Suite for Segments Validation", () => {
    test.slow();
        
    test(`Create request via api, bid and `, async({requestEndpoints, webActions,homePage, dashboard, search, requestShow, option}) =>{
        
        const _response = await requestEndpoints.createRequest(ENV.BASE_URL,'nt1reqadmin_api_key', Number(ENV.CLIENT_ID), 'Miami, FL, USA', ENV.START_DATE, 
        ENV.END_DATE);
        ENV.REQUEST_ID = JSON.parse(_response).request_id;
        console.info(`Request Id: ${ENV.REQUEST_ID}`);
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY);
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.selectRateType(`DAY`);
        await option.fillRateDetails();
        await option.fillSecondRateDetails();
        await option.selectTaxable(`taxable`); //taxable or nontaxable
        await option.fiillFirstTax(`1`,`${chance.floating({ min: 70, max: 299, fixed: 2 })}`,`DAY`);
        await option.fillSecondTax(`2`,`${chance.integer({ min: 1, max: 10})}`,`PERCENT`);
        await option.fillFees('DAY');
        await option.fillSecondFees(`Property Fee`,`${chance.integer({ min: 100, max: 1500})}`,`FLAT`);
        await option.fillDeposit(1);
        await option.totalRateCalculation('Days');
        await option.selectRateType(`NIGHT`);
        await option.totalRateCalculation('Nights');
        await option.submitOption();
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
    //ENV.REQUEST_ID = 'RQ444796';
    test("Vaidate reservation segments", async ({webActions, homePage, dashboard, search, requestShow, reservation}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        await requestShow.viewReservation();
        await reservation.validateReservationSegments();
        await reservation.clickEditSegmentLink();
        await reservation.validateRateSegmentTotals();
        await reservation.editRateSegment();
        await reservation.deleteSegment();
        await reservation.submitSegmentChanges();
        await reservation.clickEditSegmentLink();
        
    })
});