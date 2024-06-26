import Element from '@b2e_objects/Element';
import test  from '@lib/BaseTest';
import ENV  from '@utils/env';
const Chance = require ('chance');
const chance = new Chance();


test.describe.serial("Test Suite Register user, update profile and forgot password for B2E", () => {
  test.slow();

  let firstname = `${chance.first()}`;  
  let lastname = `Doe`;
  let email = `${firstname}_${lastname}${chance.integer({min:0, max:99999})}@${ENV.REQUESTOR_COMPANY}.com`.toLocaleLowerCase();
  let password = `Test1234`;
  let newPassword = `Test1234!`;
  let resetPassword = `Test123!`;
  let activateAccountLink = ``;
  let resetPasswordLink = ``;

  test("Register new user on B2E @BeforeBilling @Smoke @Register @SM-T1112", async ({webActions, b2eHomePage, b2eLoginPage}) => {
    await webActions.navigateTo(ENV.B2E_URL);
    await b2eHomePage.acceptCookies();
    await b2eHomePage.register();
    await b2eLoginPage.registerNewUser(firstname, lastname, email, password);
    await b2eLoginPage.verifyRegisterSuccess();
  })

  test("Validate activate account email", async ({webActions, homePage, configurationInstance, mailCatcher}) => {
    await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
    await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
    await homePage.signIn();
    await configurationInstance.mailPush();
    await webActions.navigateTo(ENV.MAILCATCHER_URL);
    await mailCatcher.searchEmail(email, `Thank you for registering at ReloQuest!`);
    activateAccountLink = await mailCatcher.activateAccount();
  })

  test("Activate account and update profile", async ({webActions, b2eHomePage, b2eSearchPage, b2eProfilePage}) => {
    await webActions.navigateTo(activateAccountLink);
    await b2eHomePage.acceptCookies();
    await b2eHomePage.enterPassword(password);
    await b2eHomePage.signIn();
    await b2eSearchPage.openProfile();
    await b2eProfilePage.updatePassword(password, newPassword);
  })

  test("Validate password was updated", async ({webActions, b2eHomePage, b2eSearchPage}) => {
    await webActions.navigateTo(ENV.B2E_URL);
    await b2eHomePage.acceptCookies();
    await b2eHomePage.enterCredentials(email, newPassword);
    await b2eHomePage.signIn();
    await b2eSearchPage.validateUrl(`${ENV.B2E_URL}/b2e/search`, Element.navigation_navBar);
  })

  test("Forgot password B2E @BeforeBilling @Smoke @Login @SM-T1111", async ({webActions, b2eHomePage, b2eLoginPage, b2eForgotPasswordPage}) => {
    await webActions.navigateTo(ENV.B2E_URL);
    await b2eHomePage.acceptCookies();
    await b2eHomePage.forgotPassword();
    await b2eForgotPasswordPage.sendLink(email);
    await b2eLoginPage.verifyEmailSendSuccessfull();
  })

  test("Validate forgot password email @BeforeBilling @Smoke @Login @SM-T1110", async ({webActions, homePage, configurationInstance, mailCatcher, b2eForgotPasswordPage, b2eHomePage, b2eSearchPage}) => {
    await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
    await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
    await homePage.signIn();
    await configurationInstance.mailPush();
    await webActions.navigateTo(ENV.MAILCATCHER_URL);
    await mailCatcher.searchEmail(email, `Password Reset`);
    resetPasswordLink = await mailCatcher.getB2ePasswordResetLink();
    await webActions.navigateTo(resetPasswordLink);
    await b2eHomePage.acceptCookies();
    await b2eForgotPasswordPage.resetPassword(resetPassword);
    await b2eForgotPasswordPage.LogIn();
    await webActions.navigateTo(ENV.B2E_URL);
    await b2eHomePage.enterCredentials(email, resetPassword);
    await b2eHomePage.signIn();
    await b2eSearchPage.validateUrl(`${ENV.B2E_URL}/b2e/search`, Element.navigation_navBar);
  })
   
})