export default class Button{
    static got_it             = `button:has-text('Got it')`;
    static login              = `button:has-text('Login')`;
    static next               = `app-search button.btn-orange`;
    static ok                 = `//modal-container[@class='modal fade in']//button[contains(text(),'OK')]`;
    static next_month         = `button[title='Next month']`;
    static plus_bedrooms      = `app-counter[formcontrolname='bedrooms'] button.plus`;
    static ratecard_details   = `app-rate-card a:has-text('DETAILS')`;
    static check_avialability = `button:has-text('CHECK AVAILABILITY')`;
    static plus_adults        = `app-counter[formcontrolname='adults'] button.plus`;
    static send_request       = `button:has-text('SEND REQUEST')`;
    static plus_parking       = `app-counter[formcontrolname='parking_spaces'] button.plus`;
}