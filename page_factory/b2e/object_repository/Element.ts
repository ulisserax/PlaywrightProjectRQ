import ENV from "@utils/env";


export default class Element{
    static start_date                = `//ngb-datepicker-month//span[@class='custom-day' and contains(text(),'16')]`;
    static end_date                  = `//ngb-datepicker-month//span[@class='custom-day' and contains(text(),'11')]`;
    static destination_places        = `div.search-list div.places-list`;
    static new_option_modal          = `app-modal[header='New Option(s) Received!']`;
    static are_you_sure_modal        = `app-modal[header='Are you sure?']`;
    static checkout_success          = `modal-container.modal.fade.in app-modal[header='Processing your reservation'] app-checkout-success`;
    static quest_detail_section      = `app-quest-detail`; 
    static edit_payment_method_modal = `app-modal[header='Edit Payment Method']`;
    static close                     = `div.icon-B2E-icons_Close`;

    static quests_card(request_id){
        return `a[request-id=${request_id}]`;
    }
    
}