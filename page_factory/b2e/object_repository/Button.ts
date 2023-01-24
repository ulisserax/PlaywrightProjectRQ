import ENV from "@utils/env";

export default class Button{
    static got_it             = `button:has-text('Got it')`;
    static login              = `button:has-text('Login')`;
    static next               = `app-search button.btn-orange`;
    static ok                 = `//modal-container[@class='modal fade in']//button[contains(text(),'OK')]`;
    static new                = `//app-corporate-card//a[contains(text(),'NEW')]`;
    static book               = `//button[contains(text(),'BOOK')]`;
    static next_month         = `button[title='Next month']`;
    static plus_bedrooms      = `app-counter[formcontrolname='bedrooms'] button.plus`;
    static ratecard_details   = `app-rate-card a:has-text('DETAILS')`;
    static check_avialability = `button:has-text('CHECK AVAILABILITY')`;
    static plus_adults        = `app-counter[formcontrolname='adults'] button.plus`;
    static send_request       = `button:has-text('SEND REQUEST')`;
    static plus_parking       = `app-counter[formcontrolname='parking_spaces'] button.plus`;
    static continue           = `//button[contains(text(),'CONTINUE')]`;
    static complete_booking   = `//button[contains(text(),'COMPLETE BOOKING')]`;
    static view_your_quest    = `//button[contains(text(),'VIEW YOUR QUEST')]`;


    static new_quest(request_id){
        return `a[request-id=${request_id}] button.quest-status.search-status`;
    }          
}