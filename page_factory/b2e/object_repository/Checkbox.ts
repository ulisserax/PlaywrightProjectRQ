export default class Checkkox{
    static include_hotels              = `app-input-checkbox[formcontrolname='hotels'] div`;
    static include_corporate_apartment = `app-input-checkbox[formcontrolname='includeCorporateApartment']`;
    static disability_access           = `app-input-checkbox[formcontrolname='disability_access'] div`;
    static rules_and_policies          = `//input[@formcontrolname='agreeTerms']//following-sibling::span`;
    static background_check            = `//input[@formcontrolname='background_check']//following-sibling::span`;
    static terms                       = `//input[@id='terms']//following-sibling::span`;
    static accept_terms                = `//app-set-preference//div[contains(@class,'is-term-of-reservation')]/following-sibling::div//app-input-checkbox`;
    static acknowledge_fees_and_deposits = `//p[contains(text(),'I acknowledge that I will be responsible to pay the fees and deposits')]/parent::div/preceding-sibling::div/app-input-checkbox/div`;

    static brand_name(brand_name:string){
        return `//app-search-brands//div[contains(text(),'${brand_name}')]/parent::div//app-input-checkbox/div`;
    }
}