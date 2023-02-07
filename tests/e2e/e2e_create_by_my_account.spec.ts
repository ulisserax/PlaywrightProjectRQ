import Company from '@enterprise_pages/CompanyPage';
import DashboardPage from '@enterprise_pages/DashboardPage';
import HomePage from '@enterprise_pages/HomePage';
import MyAccount from '@enterprise_pages/MyAccountPage';
import PasswordReset from '@enterprise_pages/PasswordResetPage';
import User from '@enterprise_pages/UserPage';
import Area from '@enterprise_pages/AreaPage';
import test from '@lib/Basetest';
import ENV from '@utils/env';

const Chance = require("chance");
const chance = new Chance();

test.describe ('Create a Supplier company and a Supplier user by my account flow', () => {
    test.slow();
    let subject, passwordResetLink;
    let companyType = 'Suppliers';
    let number = chance.integer({min:1,max:9999});
    const requestorCompanyName = 'auto-requestor-company-' + chance.string({length: 6, numeric: true});
    const supplierCompanyName  = `${chance.word({length: 5})}-${chance.string({length: 6, numeric: true})}-supplier`;
    const supplierAdminUser    = `${chance.first()}supadmin@${supplierCompanyName}.com`.toLowerCase();
    const property_name        = supplierCompanyName + 'Property_';
    const areaName             = supplierCompanyName + 'Area_' + number  

    test ("Create and configure a new Supplier company", async ({webActions, user, configurationInstance, mailCatcher, passwordReset, homePage, dashboard, myAccount, company})=>{
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
        await myAccount.clickOnEditUser(supplierAdminUser);
        await user.editUserPassword();
        await user.verifyUserSaved();
    })

    test ("Create a Property and an Area", async ( { webActions, homePage, dashboard, property, option, area }) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(supplierAdminUser, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await homePage.acceptPrivacyAndTermsOfUse();
        await homePage.acceptTermsOfService();
        await homePage.acceptDataProcessingAddendum();
        await dashboard.clickPropertyTab();
        await property.clickAddProperty();
        await property.fillPropertyOverview(property_name, 'miami beach','Yes','Central A/C','1 bedroom','No Pets');
        await property.addImage(`images/property1.jpeg`);
        await option.fillContactInformation(supplierAdminUser);
        await property.createNewProperty();
        await dashboard.clickAreaTab();
        await area.clickAddAnArea();
        await area.createNewArea('Miami', areaName);
        await area.validateAreaCreated(areaName);
    })
})