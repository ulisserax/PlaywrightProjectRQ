import test from '@lib/BaseTest';
import ENV from '@utils/env'


test.describe ("Create Supplier company and Supplier admin user by invitation", () => {
let registerLink;
let subject;

    test ("Submit Supplier invitation by email",async ({webActions, homePage, myAccount, dashboard, registration, configurationInstance})=> {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickMyAccountTab();
        await myAccount.inviteUser();
        await registration.generateSupplierData();
        await myAccount.fillSupplierInvitationNewCompany(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_FIRST_NAME, ENV.SUPPLIER_LAST_NAME, ENV.SUPPLIER_COMPANY);
        await myAccount.submitInvitation();
        await myAccount.verifyInvitationSubmitted;
        await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
        await configurationInstance.mailPush();
    })

    test ("Complete Supplier user and company information", async ({mailCatcher, webActions,registration}) => {
        await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        subject = `Your special invitation to ReloQuest`;
        await mailCatcher.searchEmail(ENV.SUPPLIER_ADMIN,subject);
        registerLink = await mailCatcher.getRegisterLink();
        await webActions.navigateTo(registerLink);
        await registration.verifySupplierRegistrationPage();
        await registration.fillSupplierRegistrationForm();
        await registration.verifyRegistrationCompleted();
    })

    test ("Verify New Supplier user", async ({webActions, homePage, dashboard}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPPLIER_ADMIN, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await homePage.acceptTermsOfService();
        await dashboard.validateDashboard();
    })
})
