import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


 test.describe("Test Suite Basic Flow ", () => {
    test.slow();

    let guest_email = ENV.GUEST_EMAIL;
    let request_id ;
    let client_share_link;
    let reservation_id ;

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
        await requestShow.verifyOptionSubmitted();
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

    test("Validate basic emails", async ({homePage, configurationInstance, mailCatcher}) => {
        
        await homePage.openHomePage(`${ENV.BASE_URL}/configuration/instance`);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await configurationInstance.mailPush();
        await homePage.openHomePage(ENV.MAILCATCHER_URL);
        await mailCatcher.verifyBasicEmails(`Supplier For Deadline Update`, ENV.SUPPLIER_COMPANY_EMAIL, `URGENT Updated Request: ${ENV.REQUESTOR_COMPANY}, ${request_id}`, `//h4[contains(normalize-space(),'1 field(s) updated on')]/following-sibling::ul/li[contains(normalize-space(),'Departure date')]`, `a:has-text('${request_id}')`,`${ENV.SUPPLIER_DOMAIN}/request/show/${request_id}`);
        await mailCatcher.verifyBasicEmails1(`Requestor For Deadline And Assigned To Update`, ENV.REQUESTOR_EMAIL, `URGENT Updated Request: ${ENV.REQUESTOR_COMPANY}, ${request_id}`, `//h4[contains(normalize-space(),'2 field(s) updated on')]//following-sibling::ul/li[contains(normalize-space(),'Departure date')]/following-sibling::li[contains(normalize-space(),'Assigned to')]`, `a:has-text('${request_id}')` ,`${ENV.BASE_URL}/request/show/${request_id}`);
        await mailCatcher.verifyBasicEmails(`Awarded Supplier`, ENV.SUPPLIER_COMPANY_EMAIL, `Congratulations, you were awarded ${request_id}`, `//p[contains(text(),'Congratulations! The client has selected your option for Request #') and contains(a,'${request_id}')]`, `a:has-text('${request_id}')` ,`${ENV.SUPPLIER_DOMAIN}/request/show/${request_id}`);
        await mailCatcher.verifyBasicEmails(`Supplier New Service Issue`, ENV.SUPPLIER_EMAIL, `ALERT! - Service Issue has been submitted for reservation ${reservation_id}`, `p:has-text('Service Issue Submitted')`, `a:has-text('VIEW SERVICE ISSUES')`, `${ENV.SUPPLIER_DOMAIN}/request/show/${request_id}?openServiceIssueTab=1`);
        await mailCatcher.verifyBasicEmails(`Guest New Service Issue`, guest_email, `Your service issues for ReloQuest reservation ${reservation_id}`, `p:has-text('Here is your list of services issues for ReloQuest reservation ${reservation_id}')`, `a:has-text('VIEW SERVICE ISSUES')` ,`${ENV.B2E_URL}/b2e/quests/`);
        await mailCatcher.verifyBasicEmails(`Requestor Service Issue Resolved`, ENV.REQUESTOR_EMAIL, `ALERT! - Service issue has been updated for reservation ${reservation_id}`, `p:has-text('The service issue for reservation ${reservation_id} has been updated')`, `a:has-text('VIEW SERVICE ISSUES')` ,`${ENV.BASE_URL}/request/show/${request_id}?openServiceIssueTab=1`);

    })

})
    
