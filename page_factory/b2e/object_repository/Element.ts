import ENV from "@utils/env";


export default class Element{
    static start_date                 = `//ngb-datepicker-month//span[@class='custom-day' and contains(text(),'16')]`;
    static end_date                   = `//ngb-datepicker-month//span[@class='custom-day' and contains(text(),'28')]`;
    static destination_places         = `div.search-list div.places-list`;
    static new_option_modal           = `app-modal[header='New Option(s) Received!']`;
    static are_you_sure_modal         = `app-modal[header='Are you sure?']`;
    static checkout_success           = `modal-container.modal.fade.in app-modal[header='Processing your reservation'] app-checkout-success`;
    static quest_detail_section       = `app-quest-detail`; 
    static edit_payment_method_modal  = `app-modal[header='Edit Payment Method']`;
    static close                      = `div.icon-B2E-icons_Close`;
    static alternate_option_card      = `//app-corporate-card//div[contains(text(),'Alternate Option')]`;
    static unavailable_option_card    = `//app-corporate-card//div[contains(text(),'Option Unavailable')]`;
    static check_your_email           = `#registerSuccessNotification div#register-notification`;
    static check_your_email_icon      = `span.icon-B2E-icons_Check-circle.c-green`;
    static reset_password_successfull = `div#reset-password-notification span.icon-B2E-icons_Check-circle.c-green`;
    static plus_icon_brands           = `//span[contains(text(),'Brand')]/following-sibling::span[contains(@class,'icon-B2E-icons_plus')]`;
    static navigation_navBar          = `//nav[@role='navigation']`;
    static request_service            = `//img[contains(@src, 'service-issue')]`;
    static create_service_title       = `//div[contains(text(),'Create Service Issues')]`;
    static issue_submitted_modal      = `//app-modal //h5[contains(text(),'Issue Submitted!')]`;
    static issue_status               = `span.status`;
    static email_activation_sent      = `//div[contains(text(),' activate your account.')]`;
    static service_alert_icon         = `div .red-badge`;
    static comment_modal              = `//h5[contains(text(),'Comments')]`;
    static close_services_list        = `div .icon-B2E-icons_Close`;
    static ntv_submitted_box          = `//app-ntv-approval//div[@class='ntv-approval']//div`;
    static nte_next_month             = `//app-ntv-quest//button[@title='Next month']`;
    static nte_end_date               = `//app-ntv-quest//ngb-datepicker-month//span`;

    static quests_card(request_id){
        return `a[request-id=${request_id}]`;
    }

    static service_issue_item(description){
        return `//div[@class='issue-description'] //span[contains(text(),'${description}')]`;
    };
    
}