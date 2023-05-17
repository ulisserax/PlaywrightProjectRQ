import test from '@lib/BaseTest';
import ENV from '@utils/env';

const Chance = require("chance");
const chance = new Chance();


test.describe.serial.only('Create a RQ base flow, Supplier, Property, Area, Requestor, Client, Area and Link the companies', () => {

    test.slow();
    let subject, passwordResetLink;
    let number = chance.integer({min:1,max:9999});
    const requestorCompanyName          = `${chance.word({length: 5})}${chance.string({length: 6, numeric: true})}-requestor`; //'nevol554230-requestor//
    const supplierCompanyName           = `${chance.word({length: 5})}${chance.string({length: 6, numeric: true})}-supplier`; //'iceha419483-supplier' //
    const supplierAdminUser             = `${chance.first()}${number}sup_admin`.toLowerCase(); //'charlies0125up_admin'//
    const requestorAdminUser            = `${chance.first()}${number}req_admin`.toLowerCase();//'bruce018req_admin' //
    const supplierAdminUserEmail        = `${supplierAdminUser}@${supplierCompanyName}.com`.toLowerCase(); //'charlies0125up_admin@iceha419483-supplier.com'//
    const requestorAdminUserEmail       = `${requestorAdminUser}@${requestorCompanyName}.com`.toLowerCase();//'bruce018req_admin@nevol554230-requestor.com' //
    const propertyName                  = `${supplierCompanyName}_property_`;
    const areaName                      = `${supplierCompanyName}_area_${number}`;
    const clientName                    = `${requestorCompanyName}_client_${number}`; 
    const guestEmail                    = `${chance.first()}_guest@${requestorCompanyName}`.toLocaleLowerCase();   

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
        await user.fillNewUser(supplierCompanyName, supplierAdminUser, "Supplier", supplierAdminUserEmail);
        await user.verifyUserSaved();
        await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
        await configurationInstance.mailPush();
        await mailCatcher.openMailCatcher(ENV.MAILCATCHER_URL);
        subject = 'Password Reset - New User Account';
        await mailCatcher.searchEmail(supplierAdminUserEmail, subject);
        passwordResetLink = await mailCatcher.getPasswordResetLink();
        await webActions.navigateTo(passwordResetLink);
        await passwordReset.resetUserPassword();
        await passwordReset.verifyPasswordReset();
        await webActions.navigateTo(`${ENV.BASE_URL}/account`);
        await myAccount.filterUser(supplierAdminUser);
        await myAccount.clickOnEditUser(supplierAdminUser);
        await user.editUserPassword(ENV.SUPPLIER_ADMIN_PASSWORD);
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
        await property.fillPropertyOverview(propertyName, 'Miami Beach','Yes','Central A/C','1 bedroom','No Pets');
        await property.addImage(`images/property1.jpeg`);
        await option.fillContactInformation(`${supplierAdminUser}@service.com`, `${supplierAdminUser}@escalation.com`);
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
        await user.fillNewUser(requestorCompanyName, requestorAdminUser, "Requestor", requestorAdminUserEmail);
        await user.verifyUserSaved();
        await myAccount.filterUser(requestorAdminUser);
        await myAccount.clickOnEditUser(requestorAdminUser);
        await user.editUserPassword(ENV.REQUESTOR_ADMIN_PASSWORD);
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
        await newRequest.createNewRequest(clientName, requestorAdminUser, "Miami Beach, FL, USA", guestEmail);
        await requestShow.getRequestId();
        await requestShow.verifyNotifiedsupplier(supplierCompanyName, 'Current', 'Supplier Area');
        await newRequest.createNewRequest(clientName, requestorAdminUser, "Miami, FL, USA", guestEmail);
        await requestShow.getRequestId();
        await requestShow.verifyNotifiedsupplier(supplierCompanyName, 'Current', 'Custom Area');
        await newRequest.createNewRequest(clientName, requestorAdminUser, "Weston, FL, USA", guestEmail);
        await requestShow.getRequestId();
        await requestShow.verifyNotifiedsupplier(supplierCompanyName, 'No Area', 'No Area');
    })
})