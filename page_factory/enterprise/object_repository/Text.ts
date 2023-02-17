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
    static supplier_registration                = `//h1[contains(text(),'Supplier Registration')]`;
    static registration_complete                = `//h2[contains(text(),'Registration complete')]`;
    static hotel_rooms_unavailable              = `//div[@class='rooms-unavailable' and @style='']//p[contains(text(),'There are no rooms available')]`;
    static net_rate                             = `//div[@id='rate_segment_placement']//span[@id='form_segment_net_rate']`;
    static referral_commission                  = `//div[@id='rate_segment_placement']//label[@for='form_segment_referral']`;
    static referral_commission_value            = `//div[@id='segment_fees_0']//span[@id='form_segment_referral']`;
    static reloquest_fee                        = `//div[@id='segment_fees_0']//span[@id='form_segment_rq_fee']`;
    static total_days                           = `#segment_option_length_stay`;
    static avg_rate_day                         = `#average_daily_rate`;
    static total_tax_segment                    = `//h2[contains(text(),'Taxes')]/parent::div//label[contains(text(),'Total')]/following-sibling::div//input[contains(@class,'segment-total')]`;
    static total_fee_segment                    = `//h2[contains(text(),'Fees')]/parent::div//label[contains(text(),'Total')]/following-sibling::div//input[contains(@class,'segment-total')]`;
    static total_rent                           = `span#segment_total_rate`;
    static total_taxes                          = `span#segment_total_tax`;
    static total_fees                           = `span#segment_total_fee`;
    static total_deposits                       = `span#segment_total_deposit`;
    static grand_total                          = `span#segment_grand_total`;
    static rate_segment_amount                  = `//h2[contains(text(),'Property / Rate Segments:')]/parent::div/following-sibling::div//tbody//tr/td[3]`;
    static tax_amount                           = `//h2[contains(text(),'Tax Details:')]/parent::div/following-sibling::div//tbody//tr/td[3]`;
    static fee_amount                           = `//h2[contains(text(),'Fee Details:')]/parent::div/following-sibling::div//tbody//tr/td[3]`;
    static deposit_amount                       = `//h2[contains(text(),'Deposits Details:')]/parent::div/following-sibling::div//tbody//tr/td[3]`;
    static rate_segment_total                   = `//h2[contains(text(),'Property / Rate Segments:')]/parent::div/following-sibling::div//tbody//tr/td[2]`;
    static tax_details_total                    = `//h2[contains(text(),'Tax Details:')]/parent::div/following-sibling::div//tbody//tr/td[2]`;
    static fee_details_total                    = `//h2[contains(text(),'Fee Details:')]/parent::div/following-sibling::div//tbody/tr/td[2]`;
    static deposit_details_total                = `//h2[contains(text(),'Deposits Details:')]/parent::div/following-sibling::div//tbody//tr/td[2]`;
    static rent_total                           = `//td[contains(text(),'Rent Total:')]/following-sibling::td`;
    static taxes_total                          = `//td[contains(text(),'Total Taxes:')]/following-sibling::td`;
    static fees_total                           = `//td[contains(text(),'Total Fees:')]/following-sibling::td`;
    static deposits_total                       = `//td[contains(text(),'Total Deposits:')]/following-sibling::td`;
    static totals                               = `//td[contains(text(),'Totals:')]/following-sibling::td`;
    static modal_rate_segment_total             = `//div[@id='rate_segment_placement']//input[contains(@class,'rate-segment-rate-total')]`;
    static modal_rate_total                     = `//span[@id='rate-segments-total']`;
    static modal_rate_segment_length            = `//div[@id='rate_segment_placement']//input[contains(@class,'segment-length-stay')]`;
    static modal_tax_segment_total             = `//div[@id='rate_segment_placement']//input[contains(@class,'rate-segment-rate-total')]`;
    static modal_tax_total                     = `//span[@id='rate-segments-total']`;
    static modal_tax_segment_length            = `//div[@id='rate_segment_placement']//input[contains(@class,'segment-length-stay')]`;

    static specificEmail(email: string, email_subject: string){
        return `//td[contains(text(),'${email.toLocaleLowerCase()}')]/following-sibling::td[contains(text(),'${email_subject}')]`;
    }

    static canceledReservation(reservation_id: string){
        return `//a[contains(text(),'${reservation_id}')]/parent::td/following-sibling::td[contains(text(),'Canceled')]`;
    }

    
}