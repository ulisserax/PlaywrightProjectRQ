import test from '@lib/BaseTest';
import ENV from '@utils/env';
const Chance = require("chance");
const chance = new Chance();

test.describe ("Create Supplier company and Supplier admin user by invitation", () => {
    test.slow();
    let registerLink, subject;
    let supplierCompany = 'auto-supplier-company-' + chance.string({length: 6, numeric: true});
    let supplierAdmin   = 'supplieradminuser@' + supplierCompany + '.com';

    test ("Submit Supplier invitation by email",async ({webActions, homePage, myAccount, dashboard, registration, configurationInstance})=> {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickMyAccountTab();
        await myAccount.inviteUser();
        await myAccount.fillSupplierInvitationNewCompany(supplierAdmin, supplierCompany);
        await myAccount.submitInvitation();
        await myAccount.verifyInvitationSubmitted;
        await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
        await configurationInstance.mailPush();
    })

    test ("Complete Supplier user and company information", async ({mailCatcher, webActions,registration}) => {
        await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        subject = `Your special invitation to ReloQuest`;
        await mailCatcher.searchEmail(supplierAdmin,subject);
        registerLink = await mailCatcher.getRegisterLink();
        await webActions.navigateTo(registerLink);
        await registration.verifySupplierRegistrationPage();
        await registration.fillSupplierRegistrationForm();
        await registration.verifyRegistrationCompleted();
    })

    test ("Verify New Supplier user", async ({webActions, homePage, dashboard}) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(supplierAdmin, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await homePage.acceptTermsOfService();
        await dashboard.validateDashboard();
    })
})
