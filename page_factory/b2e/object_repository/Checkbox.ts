export default class Checkkox{
    static include_hotels              = `app-input-checkbox[formcontrolname='hotels'] div`;
    static include_corporate_apartment = `app-input-checkbox[formcontrolname='includeCorporateApartment']`;
    static disability_access           = `app-input-checkbox[formcontrolname='disability_access'] div`;
    static rules_and_policies          = `//input[@formcontrolname='agreeTerms']//following-sibling::span`;
    static background_check            = `//input[@formcontrolname='background_check']//following-sibling::span`;
    static terms                       = `//input[@id='terms']//following-sibling::span`;

    static brand_name(brand_name:string){
        return `//app-search-brands//div[contains(text(),'${brand_name}')]/parent::div//app-input-checkbox/div`;
    }
}