import MyAccount from '@enterprise_pages/MyAccountPage';
import RequestShowPage from '@enterprise_pages/RequestShowPage';
import test from '@lib/Basetest';
import ENV from '@utils/env';
import { request } from 'playwright-core';

const Chance = require("chance");
const chance = new Chance();

test.describe ('Create a RQ base flow, Supplier, Property, Area, Requestor, Client, Area and Link the companies', () => {
    test.slow();
    let subject, passwordResetLink;
    let number = chance.integer({min:1,max:9999});
    const requestorCompanyName = `${chance.word({length: 5})}${chance.string({length: 6, numeric: true})}-requestor`; //'nevol554230-requestor//
    const supplierCompanyName  = `${chance.word({length: 5})}${chance.string({length: 6, numeric: true})}-supplier`; //'iceha419483-supplier' //
    const supplierAdminUser    = `${chance.first()}supadmin@${supplierCompanyName}.com`.toLowerCase(); //'charliesupadmin@iceha419483-supplier.com'//
    const requestorAdminUser   = `${chance.first()}reqadmin@${requestorCompanyName}.com`.toLowerCase();//'brucereqadmin@nevol554230-requestor.com' //
    const property_name        = `${supplierCompanyName}Property_`;
    const areaName             = `${supplierCompanyName}_Area_${number}`;
    const clientName           = `${requestorCompanyName}_Client_${number}`; 
    const guest_email          = `${chance.first()}-guest@${requestorCompanyName}`.toLocaleLowerCase();   

    test ("Create and configure a new Supplier company and a Supplier-admin user.", async ({webActions, user, configurationInstance, mailCatcher, passwordReset, homePage, dashboard, myAccount, company})=>{
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickMyAccountTab();
        await myAccount.addCompany();
        await company.fillNewCompanyForm("Suppliers", supplierCompanyName);
        await company.submitNewCompany();
        await company.verifyCompanyCreation(supplierCompanyName);
        await company.settingsTab();
        await company.setSupplierCompanySettings();
        await company.verifyCompanySettingsUpdated();
        await myAccount.addUser();
        await user.fillNewUser(supplierCompanyName, supplierAdminUser, "Supplier");
        await user.verifyUserSaved();
        await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
        await configurationInstance.mailPush();
        await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        subject = 'Password Reset - New User Account';
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

    test ("Create a Property and an Area for the new Supplier company.", async ( { webActions, homePage, dashboard, property, option, area }) => {
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(supplierAdminUser, ENV.SUPPLIER_ADMIN_PASSWORD);
        await homePage.signIn();
        await homePage.acceptPrivacyAndTermsOfUse();
        await homePage.acceptTermsOfService();
        await homePage.acceptDataProcessingAddendum();
        await dashboard.clickPropertyTab();
        await property.clickAddProperty();
        await property.fillPropertyOverview(property_name, 'Miami Beach','Yes','Central A/C','1 bedroom','No Pets');
        await property.addImage(`images/property1.jpeg`);
        await option.fillContactInformation(supplierAdminUser);
        await property.createNewProperty();
        await dashboard.clickAreaTab();
        await area.clickAddAnArea();
        await area.createNewArea('Miami', areaName);
        await area.validateAreaCreated(areaName);
    })

    test ("Create a Requestor company and a Requestor-admin user.", async ( {webActions, homePage, dashboard, myAccount, company, user, configurationInstance, mailCatcher, passwordReset}) =>{
        await webActions.navigateTo(ENV.BASE_URL);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickMyAccountTab();
        await myAccount.addCompany();
        await company.fillNewCompanyForm("Requestors", requestorCompanyName);
        await company.submitNewCompany();
        await company.verifyCompanyCreation(requestorCompanyName);
        await dashboard.clickMyAccountTab();
        await myAccount.addUser();
        await user.fillNewUser(requestorCompanyName, requestorAdminUser, "Requestor");
        await user.verifyUserSaved();
        await myAccount.filterUser(requestorAdminUser);
        await myAccount.clickOnEditUser(requestorAdminUser);
        await user.editUserPassword()
        await user.verifyUserSaved();
        await dashboard.impersonate(requestorAdminUser);
        await homePage.acceptPrivacyAndTermsOfUse();
        await dashboard.validateDashboard();
    })

    test ("Create, edit, and duplicate a Client.", async ({webActions, homePage, dashboard, myAccount, client}) =>{
        await webActions.navigateTo(`${ENV.BASE_URL}`);
        await homePage.enterCredentials(requestorAdminUser, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickMyAccountTab();
        await myAccount.addClient();
        await client.fillNewClientForm(clientName);
        await client.saveNewClient();
        await client.verifyClientCreation(clientName);
        await client.editClientSettings();
        await client.verifyClientSettings();
        await client.duplicateClient(clientName);
    })

    test ("Add a Supplier to a Requestor's network and approve/create Areas.", async ({webActions, homePage, dashboard, supplier}) => {
        await webActions.navigateTo(`${ENV.BASE_URL}`);
        await homePage.enterCredentials(requestorAdminUser, ENV.REQUESTOR_ADMIN_PASSWORD);
        await homePage.signIn();
        await dashboard.clickSuppliersTab();
        await supplier.approveSupplier(supplierCompanyName);
        await supplier.approveSupplierArea(areaName);
        await supplier.editSupplierArea();
        await supplier.addExceptionFeeAndReferralCommision("Miami, FL, USA");
        await supplier.createCustomArea("Miami Beach, FL, USA", `Custom - ${areaName}`);
    })

    test ("Validate Area and Custom Area.", async ({webActions, homePage, dashboard, newRequest, requestShow}) =>{
        await webActions.navigateTo(`${ENV.BASE_URL}`);
        await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD); 
        await homePage.signIn();
        await dashboard.impersonate(requestorAdminUser);
        await newRequest.createNewRequest(clientName, requestorAdminUser, "Miami Beach, FL, USA", guest_email);
        await requestShow.getRequestId();
        await requestShow.verifyNotifiedsupplier(supplierCompanyName, 'Current', 'Supplier Area');
        await newRequest.createNewRequest(clientName, requestorAdminUser, "Miami, FL, USA", guest_email);
        await requestShow.getRequestId();
        await requestShow.verifyNotifiedsupplier(supplierCompanyName, 'Current', 'Custom Area');
        await newRequest.createNewRequest(clientName, requestorAdminUser, "Weston, FL, USA", guest_email);
        await requestShow.getRequestId();
        await requestShow.verifyNotifiedsupplier(supplierCompanyName, 'No Area', 'No Area');
    })
})