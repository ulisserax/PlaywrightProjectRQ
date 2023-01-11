import ENV from "@utils/env";

export default class Element{
    static all_options_table_row = `table#all_options tbody tr`; //table#all_options tr.approved.corporate-option
    static client_name = `div[role=option] span:text('${ENV.CLIENT}')`;
    static client_b2e_name = `div[role=option] span:text('${ENV.CLIENT_B2E}')`;
    static client_eb2e_name = `div[role=option] span:text('${ENV.CLIENT_EB2E}')`;
    static client_eb2e_rqpro_name = `div[role=option] span:text('${ENV.CLIENT_EB2E_RQPRO}')`;
    static close_modal_icon = `div.modal.fade.in button.close`;
    static service_issue_row = `table#supplier_status_list tbody tr`;
    static activity_log_modal_li = `#activity_log_modal li.list-group-item`;
    static pending_approval_icon = `.rate-segment-description.pointer + td span`;
    static property_info_image = `#propertyInfoImage`;
    static loading_property_info = `label:text('Loading Appartment Data...')`;
    static request_loading = `img.loading`;
    static hotel_special_information = `#request-profile-container div.request-details--item.request-notes`;
    static confirm_booking_h1 = `.hotel-option-details h1`;
    static booking_confirmation = `#hotelOptionDetailSection h1`;
    
}