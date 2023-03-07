
export default class Button{
    static signIn     = `[value="login"]`;
    static newRequest = `#add_request`;
    static dashboard  = `#nav_dashboard`;
    static draft      = `a:text("Draft")`;
    static current    = `a:text("Current")`;
    static pending    = `a:text("Pending")`;
    static no_area    = `a:text("No Area")`;
    static closed     = `#tab-closed`;
    static canceled   = `a:text("Cancelled")`;
    static awarded    = `#awarded-has-pending-confirmations a`;
    static suppliers  = `#nav_suppliers`;
    static reports    = `a:text("reports")`;
    static myAccount  = `#account`;
    static help       = `#help_tap`;
    static declined   = `a:text("Declined")`;
    static incomplete = `a:text("Incomplete")`;
    static requestors = `a:text("Requestors")`;
    static area       = `#nav_area`;
    static property   = `a:text("Property")`;
    static submit     = `#form_submit`;
    static ok         = `div.modal.fade.in span:text('OK')`;
    static copy_link  = `#modal_btn_share_link_copy`;
    static done       = `#modal_btn_share_link_done`;
    static award      = `table#all_options a:text("Award")`;
    static bid        = `#button_option_new`;
    static accept     = `#button_accept`;
    static yes        = `.modal.fade.in span:text('Yes')`;
    static close      = `.modal.fade.in button:text('Close')`;
    static now        = `button:text("Now")`;
    static apply      = `.apply-button`;
    static approve    = `button:text('Approve')`;
    static okay       = `:text('Okay')`;
    static book       = `//button[contains(text(),'BOOK')]`;
    static send       = `span:text('Send')`;


    static edit_request                 = `#button_request_edit`;
    static deadline_edit                = `.deadline-edit`;
    static save_my_changes              = `#reAssignUserButton`;
    static rqpro_modal_continue         = `div#rqpro-modal-id.fade.in span:text('Continue')`;
    static b2e_modal_continue           = `div#tos-modal button#b2e_tos_tersm_accept_btn`;
    static submit_option_modal          = `.modal.fade.in #property-fields-modal-update-btn`;
    static update_request               = `span:text("Update Request")`;
    static share_option                 = `#btn_option_share`;
    static share_with_client            = `button[data-target='client']`;
    static share_with_guest             = `button[data-target='guest']`;
    static get_link                     = `button:text("Get Link")`;
    static send_email                   = `span:text("Send Email")`;
    static ready_to_submit              = `#submitModalBtn`;
    static swiftmailer_spool_send       = `div[title='swiftmailer spool send'] + div`;
    static submit_share_option          = `#btn_option_share`;
    static awardAlternateOption         = `table#all_options tbody tr:not(.unavailable) a:text('Award')`;
    static submit_akcnowledge           = `#submitAcknowledgeBtn`;
    static reservation_info             = `#button_request_reservation`;
    static submit_changes               = `span:text('Submit Changes')`;
    static service_issues               = `#showServiceIssues`;
    static create_new_service_issue     = `#button_service_issue_create`;
    static activity_log                 = `#button_activity_log`;
    static approve_changes              = `#form-reservations-approve button:text('Approve Changes')`;
    static save_comment                 = `button#saveComment`;
    static update_service_issue         = `#button_service_issue_create`;
    static search_hotel_options         = `#searchHotelOptions`;
    static view_details                 = `button:text('VIEW DETAILS')`;
    static submit_room_configuration    = `#submit_room_configuration`;
    static confirm_booking              = `span:text('Confirm Booking')`;
    static back_to_request              = `//a[contains(text(),'Back To Request')]`;
    static ok_cancellation              = `div.modal.fade.in span:text('Ok')`
    static map_view                     = `a#button_map_view`;
    static award_this_option            = `a:has-text('Award this Option')`;
    static new_property                 = `a#property_new`;
    static create_property              = `button:has-text('Create')`;
    static add_image                    = `#image_add_button_form_gallery_gallery span`;
    static select_file                  = `span:has-text('Select a file')`;
    static crop_and_use                 = `#image_crop_go_now`;
    static verify_option                = `a.button_verify_options`;
    static apply_confimation            = `div.supplier-confirm__bottom button:has-text('Apply')`;
    static submit_preferences           = `#btn_option_share_preferences_only`;
    static award_1st_choice             = `//tr[contains(@class,'corporate-option')]//td[contains(@class, 'preference') and normalize-space()='1st']/following-sibling::td//a[contains(normalize-space(),'Award')]`;
    static award_2st_option             = `table#all_options tbody tr:not(.unavailable) a:text('Award')`;
    static cancel_reservation           = `#button_option_unaward`;
    static properties_requested         = `a#properties_requested`;
    static bid_with_this_property       = `div#properties-container a`;
    static invite_user                  = `#button_invite_user`;
    static create_account               = `button#form_submit`;
    static accept_term                  = `#accept_term_v2`;
    static add_company                  = `#button_new_company`;
    static add_client                   = `#button_new_client.btn-primary`;
    static use_request_dates            = `.bootstrap-switch-id-form_use_request_dates_when_bidding`;
    static use_maid_services            = `.bootstrap-switch-id-form_use_maid_service_when_bidding`;
    static enable_default_images        = `.bootstrap-switch-id-form_enable_default_property_gallery`;
    static ratecards_without_images     = `.bootstrap-switch-id-form_includeNoImagesRateCard`;
    static update_company_settings      = `//div[contains(@class,'tab-pane well active')]//a[@id='button_cancel']/preceding-sibling::button[contains(text(),'Update')]`;
    static new_user                     = `#button_new_user`;
    static add_property                 = `#button_add_property`;
    static add_an_area                  = `#button_add_area`;
    static save_client                  = `.btn-group .btn-primary`;
    static update_client                = `//div[@aria-hidden='false']//button[contains(text(),'Update')]`;
    static duplicate_client             = `//div[@aria-hidden='false']//button[contains(text(),'Duplicate')]`;
    static modal_duplicate_client       = `.client-name-modal .btn-primary`;
    static search_supplier              = `#supplier-search-filter #supplier-search-button`;
    static area_right_arrow             = `#ms-right`;
    static confirm_area                 = `#form_areas_submit`;
    static modal_close                  = `.modal-footer > .btn-primary`;
    static save_area_fee                = `#btn_add_area_fee`;
    static save_default_referral        = `#editDefaultReferralFeeForm .btn-primary`;
    static disabled_default_referral    = `#editDefaultReferralFeeForm .disabled`;
    static create_area                  = `#create-custom-area`;
    static confirm_change               = `button#btnConfirm`;
    static update_property              = `//button[@id='form_submit_btn']`;
    static update_property_fields_modal = `//button[@id='property-fields-modal-update-btn']`;
}