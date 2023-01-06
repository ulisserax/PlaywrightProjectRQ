import { test as baseTest, expect } from "@playwright/test";
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
    }
});

export default test;