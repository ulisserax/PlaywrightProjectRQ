import Company from '@enterprise_pages/CompanyPage';
import HomePage from '@enterprise_pages/HomePage';
import MyAccount from '@enterprise_pages/MyAccountPage';
import PasswordReset from '@enterprise_pages/PasswordResetPage';
import User from '@enterprise_pages/UserPage';
import test from '@lib/Basetest';
import ENV from '@utils/env';

const Chance = require("chance");
const chance = new Chance();

test.describe ('Create a Supplier company and a Supplier user by my account flow', () => {
    test.slow();
    let subject, passwordResetLink;
    let companyType = 'Suppliers';
    const requestorCompanyName = 'auto-requestor-company-' + chance.string({length: 6, numeric: true});
    const supplierCompanyName  = 'auto-supplier-company-' + chance.string({length: 6, numeric: true});
    const supplierAdminUser    = 'supplieradminuser@' + supplierCompanyName + '.com';

    test.only ("Create and configure a new Supplier company", async ({webActions, user, configurationInstance, mailCatcher, passwordReset, homePage, dashboard, myAccount, company})=>{
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickMyAccountTab();
        await myAccount.addCompany();
        await company.fillNewCompanyForm(companyType, supplierCompanyName);
        await company.submitNewCompany();
        await company.verifyCompanyCreation(supplierCompanyName);
        await company.settingsTab();
        await company.setSupplierCompanySettings();
        await company.verifyCompanySettingsUpdated();
        await myAccount.addUser();
        await user.fillNewUser(supplierCompanyName, supplierAdminUser);
        await user.verifyUserSaved();
        await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
        await configurationInstance.mailPush();
        await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        subject = 'Password Reset - New User Account';
        console.info(supplierAdminUser);
        await mailCatcher.searchEmail(supplierAdminUser, subject);
        passwordResetLink = await mailCatcher.getPasswordResetLink();
        await webActions.navigateTo(passwordResetLink);
        await passwordReset.resetUserPassword();
        await passwordReset.verifyPasswordReset();
        await webActions.navigateTo(`${ENV.BASE_URL}/account`);
        await myAccount.filterUser(supplierAdminUser);
        await myAccount.clickOnEditUser();
        await user.editUserPassword();
        await user.verifyUserSaved();
    })
})