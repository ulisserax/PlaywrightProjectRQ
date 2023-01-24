export default class Text{
    static select_first_client                  = `ul#select2-results-2 li`;
    static request_id                           = `//span[@class='profile-title' and text()='Request ID:']//parent::div`;
    static reassign_user_reason                 = `#form_reassign_user_reason`;
    static options_count                        = `#all_options_total`;
    static console_output                       = `div#co-value`;
    static first_email                          = `//nav[@id='messages']//tbody/tr[not(contains(@style, 'display: none'))][1]`;
    static email_to                             = `#message dd.to`;
    static email_subject                        = `#message dd.subject`;
    static acknowledge_text                     = `#container-inner .acknowledgement-item__text`;
    static reservation_info_header              = `h2.header-title`; 
    static segment_pending_approval_section     = `div#segments-history-modal strong:text('Segments Pending Approval:')`;  
    static reservation_information              = `div.reservation`;
    static hotel_reservation_id                 = `div#hotelOptionDetailSection span:text('Reloquest Reservation ID:') span`;
    static property_distance_modal_notification = `//div[@class='modal fade in']//div[contains(text(),'mi (of Driving) from the requested location.')]`;
    static service_issue_resolved               = `//table[@id='supplier_status_list']//tbody//td[4]`;
    static first_option_rate                    = `td.total_rate span`;
    static first_property_name                  = `td.property-name a`;
    static card_property_rate                   = `h4.option_price`;
    static card_property_name                   = `h2.property_name`;
    static awarded_property                     = `table#all_options tr.approved.awarded.corporate-option`;
    static b2e_request_modal                    = `div#tos-modal h1`;
}