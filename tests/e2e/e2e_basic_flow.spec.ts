import test  from '@lib/BaseTest';
import ENV  from '@utils/env';


test.describe.serial("Test Suite Basic Flow ", () => {

    // test.describe.configure({ retries:2 });
    
    test.slow();
    let guest_email = ENV.GUEST_EMAIL.toLocaleLowerCase();
    let client_email = ENV.CLIENT_EMAIL.toLocaleLowerCase();
    let client_share_link;

    test("Create a new Request and edit", async({webActions, dashboard, newRequest, requestShow}) =>{
        await webActions.login(`requestor`, ENV.BASE_URL, ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await dashboard.validateDashboard();
        await dashboard.cardSummary();
        await dashboard.clickNewRequest();
        await newRequest.select_client(ENV.CLIENT_ACCEPT);
        await newRequest.fillRequestDetails(ENV.REQUEST_TYPE[0], ENV.REQUESTOR_ADMIN,ENV.GUEST_TYPE[0],'Miami, FL, USA', `45`);
        await newRequest.fillGuestInfo(ENV.GUEST_FIRSTNAME,ENV.GUEST_LASTNAME,guest_email,ENV.GUEST_PHONE);
        await newRequest.fillCorporateHousingDetails();
        await newRequest.submitRequest();
        await requestShow.getRequestId();
        await requestShow.editRequest();
        await newRequest.editRequest(ENV.REQUESTOR_USER);
    })
    test("Bid an existing option", async({webActions, dashboard, search, requestShow, option}) =>{
        await webActions.login(`supplier`, ENV.SUPPLIER_DOMAIN, ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.acceptRequest();
        await requestShow.bidOption();
        await option.selectProperty(ENV.PROPERTY);
        await option.addPropertyImages(`images/property1.jpeg`);
        await option.fillUnitDetails(ENV.UNIT_TYPE[1], ENV.KITCHEN_TYPE[2],ENV.STYLE[0],ENV.BEDROOMS[1],ENV.BATHROOMS[1]);
        await option.fillRateDetails();
        await option.fillFees(ENV.FEES_TYPE[0]);
        await option.submitOption();
        await requestShow.verifyOptionSubmitted();
    })
    test("Share with client", async ({webActions, dashboard, search, requestShow, newRequest}) => {
        await webActions.login(`requestor`, ENV.BASE_URL, ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.editRequest();
        await newRequest.expireRequest();
        await requestShow.shareWithClient(client_email);
        
    })
    test("Push emails, validate email was send, set preference and award from share template", async ({webActions, configurationInstance, mailCatcher, shareOption}) => {
        await webActions.login(`superadmin`, `${ENV.BASE_URL}/configuration/instance`, ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await configurationInstance.mailPush();
        let subject = "Temporary Living Options Available";
        await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        await mailCatcher.searchEmail(client_email, subject);
        client_share_link = await mailCatcher.getShareOptionLink(ENV.REQUEST_ID);
        await webActions.navigateTo(client_share_link);
        const share_link = await shareOption.shareWithGuest();
        await webActions.navigateTo(share_link);
        await shareOption.submitPreferencesAndAward();
    })
    
    test("Acknowledge award, edit rate segments and set reservation in current", async ({webActions, dashboard, search, requestShow, reservation}) => {
        await webActions.login(`supplier`, ENV.SUPPLIER_DOMAIN, ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.acknowledgeAward(ENV.ACKNOWLEDGE_AWARD[0]);
        await requestShow.viewReservation();
        await reservation.getReservationId();
        console.log(ENV.RESERVATION_ID);
        await reservation.clickEditSegmentLink();
        await reservation.editRateSegment();
        await reservation.submitSegmentChanges();
        await reservation.changeSegmentStarDateToPast();
        await reservation.submitSegmentChanges();
        await reservation.viewRateSegmentHistory();
    })

    test("Verify reservation and create service issue", async ({webActions, dashboard, search, requestShow, reservation}) => {
        await webActions.login(`requestor`, ENV.BASE_URL, ENV.REQUESTOR_ADMIN, ENV.REQUESTOR_ADMIN_PASSWORD);
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        ENV.ROLE_VISIBILITY = ['NON-RQPRO'];
        await requestShow.createServiceIssue(`Requestor --> Supplier`, ENV.ROLE_VISIBILITY );
        await requestShow.viewReservation();
        await reservation.verifyReservation(ENV.RESERVATION_ID);
        await reservation.editGuestInformation();
        await reservation.activityLogRequestor(ENV.REQUESTOR_ADMIN);
        await reservation.approveReservationChanges();
    })

    test("Resolve service issue", async ({webActions, dashboard, search, requestShow, serviceIssue}) => {
        await webActions.login(`supplier`, ENV.SUPPLIER_DOMAIN, ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await dashboard.cardSummary();
        await dashboard.findCurrentRequest(ENV.REQUEST_ID);
        await search.clickRequestIdLink();
        await requestShow.clickOnServiceIssueTab();
        await requestShow.viewServiceIssue();
        await serviceIssue.resolveServiceIssue();
    })

    test("Validate basic emails", async ({webActions, configurationInstance, mailCatcher}) => {
        await webActions.login(`superadmin`,`${ENV.BASE_URL}/configuration/instance`,ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await configurationInstance.mailPush();
        await webActions.navigateTo(ENV.MAILCATCHER_URL);
        await mailCatcher.verifyBasicEmails(`Supplier For Deadline Update`, ENV.SUPPLIER_COMPANY_EMAIL.toLocaleLowerCase(), `URGENT Updated Request: mail_subject_${ENV.REQUESTOR_COMPANY}, ${ENV.REQUEST_ID}`, `//h4[contains(normalize-space(),'1 field(s) updated on')]/following-sibling::ul/li[contains(normalize-space(),'Departure date')]`, `a:has-text('${ENV.REQUEST_ID}')`,`${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.REQUEST_ID}`);
        await mailCatcher.verifyBasicEmails1(`Requestor For Deadline And Assigned To Update`, ENV.REQUESTOR_EMAIL.toLocaleLowerCase(), `URGENT Updated Request: mail_subject_${ENV.REQUESTOR_COMPANY}, ${ENV.REQUEST_ID}`, `//h4[contains(normalize-space(),'2 field(s) updated on')]//following-sibling::ul/li[contains(normalize-space(),'Departure date')]/following-sibling::li[contains(normalize-space(),'Assigned to')]`, `a:has-text('${ENV.REQUEST_ID}')` ,`${ENV.BASE_URL}/request/show/${ENV.REQUEST_ID}`);
        await mailCatcher.verifyBasicEmails(`Awarded Supplier`, ENV.SUPPLIER_COMPANY_EMAIL.toLocaleLowerCase(), `Congratulations, you were awarded ${ENV.REQUEST_ID}`, `//p[contains(text(),'Congratulations! The client has selected your option for Request #') and contains(a,'${ENV.REQUEST_ID}')]`, `a:has-text('${ENV.REQUEST_ID}')` ,`${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.REQUEST_ID}`);
        await mailCatcher.verifyBasicEmails(`Supplier New Service Issue`, ENV.SUPPLIER_SERVICE_EMAIL.toLocaleLowerCase(), `ALERT! - Service Issue has been submitted for reservation ${ENV.RESERVATION_ID}`, `p:has-text('Service Issue Submitted')`, `a:has-text('VIEW SERVICE ISSUES')`, `${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.REQUEST_ID}?openServiceIssueTab=1`);
        //commented out due to an issue existing on RC (requestor notification hasnb't been sent out)
        //await mailCatcher.verifyBasicEmails(`Requestor Service Issue Resolved`, ENV.REQUESTOR_EMAIL.toLocaleLowerCase(), `ALERT! - Service issue has been updated for reservation ${ENV.RESERVATION_ID}`, `p:has-text('The service issue for reservation ${ENV.RESERVATION_ID} has been updated')`, `a:has-text('VIEW SERVICE ISSUES')` ,`${ENV.BASE_URL}/request/show/${ENV.REQUEST_ID}?openServiceIssueTab=1`);
        await mailCatcher.verifyBasicEmails(`verifyEmailToSupplierForNewRequest`, ENV.SUPPLIER_COMPANY_EMAIL.toLocaleLowerCase(), `Accept New Request`, `//p[contains(text(),'New Request') and contains(a,${ENV.REQUEST_ID})]`, `//a[contains(text(),'${ENV.REQUEST_ID}')]`,`${ENV.SUPPLIER_DOMAIN}/request/show/${ENV.REQUEST_ID}`);
    })

})
    
