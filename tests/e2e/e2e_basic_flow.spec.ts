import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe("Test Suite Basic Flow ", () => {
    test.slow();

    let guest_email = ENV.GUEST_EMAIL;
    let request_id = `RQE56BFC`;
    let client_share_link;
    let reservation_id = `RQR8C9D6D`;

    test("Create a new Request and edit", async({ homePage, dashboard, newRequest, requestShow}) =>{
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.validateDashboard();
        await dashboard.cardSummary();
        await dashboard.clickNewRequest();
        await newRequest.select_client(ENV.CLIENT);
        await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[0], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE[0],'Miami, FL, USA', `45`);
        await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guest_email,ENV.GUEST_PHONE);
        await newRequest.fillCorporateHousingDetails();
        await newRequest.submitRequest();
        request_id = await requestShow.getRequestId();
        await requestShow.editRequest();
        await newRequest.editRequest(ENV.REQUESTOR_USER);
    })
    test("Bid an existing option", async({ homePage, dashboard, search, requestShow, option}) =>{
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.acceptRequest();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY);
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.fillRateDetails();
        await option.fillFees(ENV.FEES_TYPE[0]);
        await option.submitOption();
    })
    test("Share with client", async ({ homePage, dashboard, search, requestShow, newRequest}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.editRequest();
        await newRequest.expireRequest();
        await requestShow.shareWithClient(ENV.ClIENT_EMAIL);
        
    })
    test("Push emails, validate email was send, set preference and award from share template", async ({homePage, configurationInstance, mailCatcher, shareOption}) => {
        await homePage.openHomePage(`${ENV.BASE_URL}/configuration/instance`);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await configurationInstance.mailPush();
        let subject = "Temporary Living Options Available";
        await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        await mailCatcher.searchEmail(ENV.ClIENT_EMAIL, subject);
        client_share_link = await mailCatcher.getShareOptionLink(request_id);
        await homePage.openHomePage(client_share_link);
        const share_link = await shareOption.shareWithGuest();
        await homePage.openHomePage(share_link);
        await shareOption.submitPreferencesAndAward();
    })
    
    test("Acknowledge award, edit rate segments and set reservation in current", async ({homePage, dashboard, search, requestShow, reservation}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        await requestShow.viewReservation();
        reservation_id = await reservation.getReservationId();
        await reservation.editRateSegment();
        await reservation.changeSegmentStarDateToPast();
        await reservation.viewRateSegmentHistory();
    })

    test("Verify reservation and create service issue", async ({homePage, dashboard, search, requestShow, reservation, serviceIssue}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.clickServiceIssue();
        await requestShow.createServiceIssue();
        await serviceIssue.fillServiceIssueInformation();
        await requestShow.viewReservation();
        await reservation.verifyReservation(reservation_id);
        await reservation.editGuestInformation();
        await reservation.activityLogRequestor(ENV.REQUESTOR_ADMIN);
        await reservation.approveReservationChanges();
    })

    test("Resolve service issue", async ({homePage, dashboard, search, requestShow, serviceIssue}) => {
        await homePage.openHomePage(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(request_id);
        await search.clickRequestIdLink();
        await requestShow.clickServiceIssue();
        await requestShow.viewServiceIssue();
        await serviceIssue.resolveServiceIssue();
    })

    test.only("Validate basic emails", async ({homePage, mailCatcher}) => {
        await homePage.openHomePage(ENV.MAILCATCHER_URL);
        await mailCatcher.verifyBasicEmails('urgent updated request', ENV.SUPPLIER_COMPANY_EMAIL, `Updated Request: ${ENV.REQUESTOR_COMPANY}, ${request_id}`, `Supplier For Deadline Update`, `${ENV.SUPPLIER_DOMAIN}/request/show/${request_id}`, request_id , `h4:has-text('1 field(s) updated on')`);
        await mailCatcher.verifyBasicEmails1('urgent updated request', ENV.REQUESTOR_EMAIL, `Updated Request: ${ENV.REQUESTOR_COMPANY}, ${request_id}`, `Requestor For Deadline And Assigned To Update`, `${ENV.BASE_URL}/request/show/${request_id}`, request_id, `h4:has-text('2 field(s) updated on')` );
        await mailCatcher.verifyBasicEmails('Congratulations', ENV.SUPPLIER_EMAIL, `Congratulations, you were awarded ${request_id}`, `Awarded Supplier`, `${ENV.SUPPLIER_DOMAIN}/request/show/${request_id}`, request_id , `p:has-text('Congratulations! The client has selected your option for Request #')`);
        await mailCatcher.verifyBasicEmails('ALERT! - Service Issue', ENV.SUPPLIER_COMPANY_EMAIL, `ALERT! - Service Issue has been submitted for reservation ${reservation_id}`, `Supplier New Service Issue`, `${ENV.SUPPLIER_DOMAIN}/request/show/${request_id}?openServiceIssueTab=1`, request_id , `p:has-text('Service Issue Submitted')`);

    })

})
    
