import ENV from "@utils/env";

export default class Element{
    static approved_options_table_row      = `table#all_options tbody tr.approved.corporate-option`; 
    static awarded_options_table_row       = `table#all_options tbody tr.awarded.corporate-option`;
    static hotels_options_table_row        = `table#all_options tbody tr.approved.awarded.hotel-option`;
    static hotel_options_award_in_progress = `table#all_options tbody tr.award_in_progress.hotel-option`;
    static hotel_property_name             = `table#all_options tbody tr.award_in_progress.hotel-option td.property-name`
    static alternate_options_table_row     = `table#all_options tbody tr.approved.corporate-option span.alt-option-link`;
    static client_name                     = `div[role=option] span:text('${ENV.CLIENT}')`;
    static client_b2e_name                 = `div[role=option] span:text('${ENV.CLIENT_B2E}')`;
    static client_eb2e_name                = `div[role=option] span:text('${ENV.CLIENT_EB2E}')`;
    static client_eb2e_rqpro_name          = `div[role=option] span:text('${ENV.CLIENT_EB2E_RQPRO}')`;
    static close_modal_icon                = `div.modal.fade.in button.close`;
    static service_issue_row               = `table#supplier_status_list tbody tr`;
    static activity_log_modal_li           = `#activity_log_modal li.list-group-item`;
    static pending_approval_icon           = `.rate-segment-description.pointer + td span`;
    static property_info_image             = `#propertyInfoImage`;
    static loading_property_info           = `label:text('Loading Appartment Data...')`;
    static request_loading                 = `img.loading`;
    static hotel_special_information       = `#request-profile-container div.request-details--item.request-notes`;
    static confirm_booking_h1              = `.hotel-option-details h1`;
    static booking_confirmation            = `#hotelOptionDetailSection h1`;
    static option_map_icon                 = `//div[@id="request_map_view"]/div/div/div[2]/div[2]/div/div[3]/div[3]/img`
    static icon_option_confirmation        = `table#all_options tbody tr span.icon-option-confirmation`;
    static icon_confirm_availability       = `table#all_options tbody tr span.responded.available`;
    static option_availability_message     = `//div[contains(text(),'remaining to confirm option availability')]`;
    static table_option_declined           = `table#all_options tbody tr.corporate-option.unavailable`;
    static invitation_form                 = `#invitation-form`;
    static invitation_sent                 = `//div[contains(text(),'sent successfully')]`;
    static hotel_rooms_available           = `div.hotel-rooms-available`; 
    static company_form_title              = `//h1[contains(text(),'Update Company')]`;
    static new_company_country             = `//div[contains(text(),'United States')]`;
    static default_washer_dryer            = `//div[@id='s2id_form_default_washer_dryer']`;  
    static profile_timezone                = `#s2id_form_timezone`;
    static profile_company                 = `#s2id_form_company`;
    static confirm_password_reset          = `//h3[contains(text(),"password successfully")]`;
    static edit_user                       = `.profile-actions-td .edit`;
    static areas_of_coverage               = `//h1[contains(text(),'Areas of Coverage')]`;
}