
export default class Button{
    static accept_cookies        = `//button[contains(text(),'Got it')]`;
    static login                 = `button:has-text('Login')`;
    static next                  = `app-search button.btn-orange`;
    static ok                    = `//modal-container[@class='modal fade in']//button[contains(text(),'OK')]`;
    static new                   = `//app-corporate-card//a[contains(text(),'NEW')]`;
    static book                  = `//button[contains(text(),'BOOK')]`;
    static next_month            = `button[title='Next month']`;
    static plus_bedrooms         = `app-counter[formcontrolname='bedrooms'] button.plus`;
    static ratecard_details      = `app-rate-card a:has-text('DETAILS')`;
    static plus_adults           = `app-counter[formcontrolname='adults'] button.plus`;
    static send_request          = `button:has-text('SEND REQUEST')`;
    static plus_parking          = `app-counter[formcontrolname='parking_spaces'] button.plus`;
    static continue              = `//button[contains(text(),'CONTINUE')]`;
    static complete_booking      = `//button[contains(text(),'COMPLETE BOOKING')]`;
    static view_your_quest       = `//button[contains(text(),'VIEW YOUR QUEST')]`;
    static quest_details         = `//a[contains(text(),'QUEST DETAILS')]`;
    static save_card             = `button:has-text('SAVE CARD')`;
    static got_it                = `button:has-text('GOT IT')`;
    static book_alternate_option = `//a[contains(text(),'BOOK')]`;
    static requested_options     = `//button[contains(text(),'REQUESTED OPTIONS')]`;
    static request_again         = `//a[contains(text(),'REQUEST AGAIN')]`;
    static yes_cancel_quest      = `//button[contains(text(),'YES, CANCEL QUEST')]`;
    static sort                  = `//app-text-select[@formcontrolname='sort']`;
    static hotel_details         = `//app-hotel-card//a[contains(text(),'DETAILS')]`;
    static view_rooms            = `//button[contains(text(),'VIEW ROOMS')]`;
    static book_this_option      = `//button[contains(text(),'BOOK THIS')]`;
    static register              = `//button[contains(text(),'REGISTER')]`;
    static save                  = `//div[@class='modal-footer']//button[contains(text(),'SAVE')]`;
    static send_link             = `//button[contains(text(),'Send Link')]`;
    static save_password         = `//button[contains(text(),'Save')]`;
    static log_in                = `//a[contains(text(),'Log in')]`;
    static apply_filters         = `//button[contains(text(),'APPLY FILTERS')]`;
    static new_issue             = `//a[contains(@href, 'add')]`;
    static submit_service_issue  = `.submit-issue button`;
    static view_your_issues      = `//button[contains(text(),'View your issues')]`;
    static submit_comment        = `//button[contains(text(), 'Submit comment')]`; 
    static modal_close           = `//button[contains(text(),'CLOSE')]`;
    static ntv_confirm           = `//app-ntv-reminder//button[contains(text(),'CONFIRM')]`;
    static ntv_submitted_ok      = `//app-ntv-submitted//button[contains(text(),'OK')]`;
    static mark_as_resolved      = `//button[contains(text(), 'MARK AS RESOLVED')]`;
    static resolved_confirmation = `//app-modal[@class='service-modal']//button[contains(text(), 'MARK AS RESOLVED')]`;
    static nte_request_extension = `//app-ntv-quest//button[contains(text(),'REQUEST EXTENSION')]`;
    static select_option         = `//button[contains(@class,'button-select-option')]`;
    static accept_terms          = `//button[contains(text(), 'ACCEPT TERMS')]`;
    static ok_got_it             = `//app-options-welcome//button[contains(text(),'GOT IT')]`;
    static modal_ok              = `//app-modal//div[contains(@class,'modal-footer')]//button[contains(text(),'OK')]`;
    static check_avialability_or_request_deal    = `//button[contains(text(),'CHECK AVAILABILITY')] | //button[contains(text(),'REQUEST DEAL')]`;


    static new_quest(request_id){
        return `a[request-id=${request_id}] button.quest-status.search-status`;
    }    
    static future_quest(request_id){
        return `a[request-id=${request_id}] button.quest-status.future`;
    }   
    static alternate_option(request_id){
        return `a[request-id=${request_id}] button.quest-status.alternate-option`;
    }    
    static declined_option(request_id){
        return `a[request-id=${request_id}] button.quest-status.declined`;
    }

    static select_specific_shared_option(option_id: string){
        return `//app-option-card/a[contains(@href,'/b2e/options/${option_id}')]//button[contains(@class,'button-select-option')]`;
    }

    static quest_option(request_id){
        return `a[request-id=${request_id}] button.quest-status`;
    }
}