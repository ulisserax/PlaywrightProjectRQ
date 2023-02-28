import { test as baseTest } from "@playwright/test";
import Dashboard from "@enterprise_pages/DashboardPage";
import HomePage from "@enterprise_pages/HomePage";
import NewRequest from "@enterprise_pages/NewRequestPage";
import RequestShow from "@enterprise_pages/RequestShowPage";
import Search from "@enterprise_pages/SearchPage";
import Option from "@enterprise_pages/OptionPage";
import ConfigurationInstance from "@enterprise_pages/ConfigurationInstancePage";
import MailCatcher from "@enterprise_pages/MailCatcherPage";
import ShareOption from "@enterprise_pages/ShareOptionPage";
import Reservation from "@enterprise_pages/ReservationPage";
import ServiceIssuePage from "@enterprise_pages/ServiceIssuePage";
import HotelSearchPage from "@enterprise_pages/HotelSearchPage";
import PropertyPage from "@enterprise_pages/PropertyPage";
import WebActions from "../lib/WebActions";
import MyAccount from "@enterprise_pages/MyAccountPage";
import RegistrationPage from "@enterprise_pages/RegistrationPage";
import Company from "@enterprise_pages/CompanyPage";
import User from "@enterprise_pages/UserPage";
import PasswordReset from "@enterprise_pages/PasswordResetPage";
import Area from "@enterprise_pages/AreaPage";
import Client from "@enterprise_pages/ClientPage";
import Supplier from "@enterprise_pages/SupplierPage";
import B2eHomePage from "@b2e_pages/B2eHomePage";
import B2eSearchPage from "@b2e_pages/B2eSearchPage";
import B2ePropertyDetailPage from "@b2e_pages/B2ePropertyDetailPage";
import B2eQuestsPage from "@b2e_pages/B2eQuestsPage";
import B2eBookingPage from "@b2e_pages/B2eBookingPage";
import B2eQuestDetailsPage from "@b2e_pages/B2eQuestDetailsPage";
import ReservationEndpoints from "@api/v1/ReservationEndpoints";
import RequestEndpoints from "@api/v1/RequestEndpoints";
import B2eLoginPage from "@b2e_pages/B2eLoginPage";
import B2eProfilePage from "@b2e_pages/B2eProfilePage";
import B2eForgotPasswordPage from "@b2e_pages/B2eForgotPasswordPage";
import OptionEndpoints from "@api/v1/OptionEndpoints";
import V2Endpoints from "@api/v2/V2Endpoints";
import Stripe from "@api/v2/Stripe";


const test = baseTest.extend<{
    homePage: HomePage;
    dashboard: Dashboard;
    newRequest: NewRequest;
    requestShow: RequestShow;
    search: Search;
    option: Option;
    configurationInstance: ConfigurationInstance;
    mailCatcher:MailCatcher;
    shareOption:ShareOption;
    reservation:Reservation;
    serviceIssue: ServiceIssuePage;
    hotelSearchPage: HotelSearchPage;
    property: PropertyPage;
    webActions: WebActions;
    myAccount: MyAccount;
    company: Company;
    registration: RegistrationPage;
    user: User;
    passwordReset: PasswordReset;
    area: Area;
    client: Client;
    supplier: Supplier;
    b2eHomePage: B2eHomePage;
    b2eSearchPage: B2eSearchPage;
    b2ePropertyDetailPage: B2ePropertyDetailPage;
    b2eQuestsPage: B2eQuestsPage;
    b2eBookingPage: B2eBookingPage;
    b2eQuestDetailsPage: B2eQuestDetailsPage;
    b2eLoginPage: B2eLoginPage;
    b2eProfilePage: B2eProfilePage;
    reservationEndpoints: ReservationEndpoints;
    requestEndpoints: RequestEndpoints;
    b2eForgotPasswordPage: B2eForgotPasswordPage;
    optionEndpoints: OptionEndpoints;
    v2Endpoints: V2Endpoints;
    stripe: Stripe;
}>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    dashboard: async ({ page }, use) => {
        await use(new Dashboard(page));
    },
    newRequest: async ({ page }, use) => {
        await use(new NewRequest(page));
    },
    requestShow: async ({ page }, use) => {
        await use(new RequestShow(page));
    },
    search: async ({ page }, use) => {
        await use(new Search(page));
    },
    option: async ({ page }, use) => {
        await use(new Option(page));
    },
    configurationInstance: async ({ page }, use) => {
        await use(new ConfigurationInstance(page));
    },
    mailCatcher: async ({ page }, use) => {
        await use(new MailCatcher(page));
    },
    shareOption: async ({ page }, use) => {
        await use(new ShareOption(page));
    },
    reservation: async ({ page }, use) => {
        await use(new Reservation(page));
    },
    serviceIssue: async ({ page }, use) => {
        await use(new ServiceIssuePage(page));
    },
    hotelSearchPage: async ({ page }, use) => {
        await use(new HotelSearchPage(page));
    },
    property: async ({ page }, use) => {
        await use(new PropertyPage(page));
    },
    webActions: async ({ page }, use) => {
        await use(new WebActions(page));
    },
    myAccount: async ({ page }, use) => {
        await use(new MyAccount (page));
    },
    registration: async ({ page }, use) => {
        await use(new RegistrationPage (page));
    },
    company: async ({ page }, use) => {
        await use(new Company (page));
    }, 
    user: async ({ page }, use) => {
        await use(new User (page));
    },
    passwordReset: async ({ page }, use) => {
        await use(new PasswordReset (page));
    },
    area:async ({ page }, use) => {
        await use(new Area (page));
    },
    client:async ({ page }, use) => {
        await use(new Client (page));
    },
    supplier:async ({ page }, use) => {
        await use(new Supplier (page));
    },
    b2eHomePage: async ({ page }, use) => {
        await use(new B2eHomePage(page));
    },
    b2eSearchPage: async ({ page }, use) => {
        await use(new B2eSearchPage(page));
    },
    b2ePropertyDetailPage: async ({ page }, use) => {
        await use(new B2ePropertyDetailPage(page));
    },
    b2eQuestsPage: async ({ page }, use) => {
        await use(new B2eQuestsPage(page));
    },
    b2eBookingPage: async ({ page }, use) => {
        await use(new B2eBookingPage(page));
    },
    b2eQuestDetailsPage: async ({ page }, use) => {
        await use(new B2eQuestDetailsPage(page));
    },
    b2eLoginPage: async ({ page }, use) => {
        await use(new B2eLoginPage(page));
    },
    b2eProfilePage: async ({ page }, use) => {
        await use(new B2eProfilePage(page));
    },
    reservationEndpoints: async ({ request }, use) => {
        await use(new ReservationEndpoints(request));
    },
    requestEndpoints: async ({ request }, use) => {
        await use(new RequestEndpoints(request));
    },
    b2eForgotPasswordPage: async ({ page }, use) => {
        await use(new B2eForgotPasswordPage(page));
    },
    optionEndpoints: async ({ request }, use) => {
        await use(new OptionEndpoints(request));
    },
    v2Endpoints: async ({ request }, use) => {
        await use(new V2Endpoints(request));
    },
    stripe: async ({ request }, use) => {
        await use(new Stripe(request));
    }
});

export default test;