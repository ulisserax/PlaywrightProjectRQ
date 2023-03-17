import Element from '@b2e_objects/Element';
import test  from '@lib/BaseTest';
import ENV  from '@utils/env';
const Chance = require ('chance');
const chance = new Chance();


test.describe.serial("Test Suite Register user, update profile and forgot password for B2E", () => {
  test.slow();

  let firstname = `${chance.first()}`;  
  let lastname = `Doe`;
  let email = `${firstname}_${lastname}${chance.integer({min:0, max:99999})}@nt1req.com`.toLocaleLowerCase();
  let password = `Test1234`;
  let new_password = `Test1234!`;
  let reset_password = `Test123!`;
  let activate_account_link = ``;
  let reset_password_link = ``;

  test("Register new user on B2E", async ({webActions, b2eHomePage, b2eLoginPage}) => {
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
    activate_account_link= await mailCatcher.activateAccount();
  })

  test("Activate account and update profile", async ({webActions, b2eHomePage, b2eSearchPage, b2eProfilePage}) => {
    await webActions.navigateTo(activate_account_link);
    await b2eHomePage.acceptCookies();
    await b2eHomePage.enterPassword(password);
    await b2eHomePage.signIn();
    await b2eSearchPage.openProfile();
    await b2eProfilePage.updatePassword(password, new_password);
  })

  test("Validate password was updated", async ({webActions, b2eHomePage, b2eSearchPage}) => {
    await webActions.navigateTo(ENV.B2E_URL);
    await b2eHomePage.acceptCookies();
    await b2eHomePage.enterCredentials(email, new_password);
    await b2eHomePage.signIn();
    await b2eSearchPage.validateUrl(`${ENV.B2E_URL}/b2e/search`, Element.navigation_navBar);
  })

  test("Forgot password B2E", async ({webActions, b2eHomePage, b2eLoginPage, b2eForgotPasswordPage}) => {
    await webActions.navigateTo(ENV.B2E_URL);
    await b2eHomePage.acceptCookies();
    await b2eHomePage.forgotPassword();
    await b2eForgotPasswordPage.sendLink(email);
    await b2eLoginPage.verifyEmailSendSuccessfull();
  })

  test("Validate forgot password email", async ({webActions, homePage, configurationInstance, mailCatcher, b2eForgotPasswordPage, b2eHomePage, b2eSearchPage}) => {
    await webActions.navigateTo(`${ENV.BASE_URL}/configuration/instance`);
    await homePage.enterCredentials(ENV.SUPER_ADMIN, ENV.SUPER_ADMIN_PASSWORD);
    await homePage.signIn();
    await configurationInstance.mailPush();
    await webActions.navigateTo(ENV.MAILCATCHER_URL);
    await mailCatcher.searchEmail(email, `Password Reset`);
    reset_password_link = await mailCatcher.getB2ePasswordResetLink();
    await webActions.navigateTo(reset_password_link);
    await b2eHomePage.acceptCookies();
    await b2eForgotPasswordPage.resetPassword(reset_password);
    await b2eForgotPasswordPage.LogIn();
    await webActions.navigateTo(ENV.B2E_URL);
    await b2eHomePage.enterCredentials(email, reset_password);
    await b2eHomePage.signIn();
    await b2eSearchPage.validateUrl(`${ENV.B2E_URL}/b2e/search`, Element.navigation_navBar);
  })
   
})