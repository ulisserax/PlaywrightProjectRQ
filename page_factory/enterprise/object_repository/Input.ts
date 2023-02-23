export default class Input{
    static username                     = `#username`;
    static password                     = `#password`;
    static guest_first_name             = `#form_guest_first_name`;
    static guest_last_name              = `#form_guest_last_name`;
    static guest_email                  = `#form_guest_email`;
    static guest_phone                  = `#form_guest_phone`;
    static internal_id                  = `#form_internal_identification`;
    static desired_location             = `#form_location`;
    static length_of_stay               = `#form_length_of_stay`;
    static search_client                = `#s2id_autogen2_search`;
    static cost_center                  = `#form_cost_center`;
    static adults                       = `#form_adults`;
    static days_notice                  = `#form_notice_vacate`;
    static search_by                    = `#search-form-criteria`;
    static search_property              = `#s2id_autogen1_search`;
    static square_foot                  = `#form_square_foot`;
    static utility_cap                  = `#form_utility_cap`;
    static parking_space                = `#form_parking_spaces`;
    static rate                         = `#rate_segment_placement #form_segment_rate`;
    static fee                          = `//h2[contains(text(),'Fees:')]/parent::div//input[contains(@class,'feesegment-value')]`;
    static share_email                  = `.form-share-options #email`;
    static search_message               = `input[name='search']`;
    static link_to_options              = `#share_link`;
    static guest_name                   = `#form_guest_name`;
    static hotel_rooms_adults           = `#form_hotel_rooms_0_adults`;
    static customer_service_number      = `#form_customer_service_phone_24h`;
    static email_for_service_issues     = `#form_service_issue_email`;
    static phone_for_services_issues    = `#form_service_issue_phone`;
    static escalation_contact_name      = `#form_escalation_name`;
    static escalation_contact_email     = `#form_escalation_email`;
    static escalation_contact_phone     = `#form_escalation_phone`;
    static property_name                = `#form_name`;
    static property_location            = `#form_location`;
    static property_room_types          = `#s2id_form_roomTypes`;
    static property_number              = `#form_street_number`;
    static image_upload_file            = `//input[@id='image_upload_file']`;
    static email_address                = `#form_email`;
    static first_name                   = `#form_first_name`;
    static last_name                    = `#form_last_name`;
    static company_name                 = `#form_company_name`;
    static title                        = `#form_title`;
    static reg_password                 = `div #form_password_first`;
    static reg_repeat_password          = `div #form_password_second`;
    static notification_email           = `#form_company_notification_email`;
    static company_phone                = `#form_company_notification_phone`;
    static new_company_name             = `#form_name`;
    static new_company_notification     = `#form_notification_email`;
    static new_company_phone            = `#form_phone_number`;
    static new_company_address          = `#form_address`;
    static new_company_city             = `#companyForm_city`;
    static new_company_state            = `#companyForm_state`;
    static new_company_zip              = `#form_zip`;
    static new_accounting_name          = `#form_accounting_contact_name`;
    static new_accounting_email         = `#form_accounting_email_address`;
    static new_accounting_phone         = `#form_accounting_phone_number`;
    static default_minimum_stay         = `#form_default_minimum_stay`;
    static default_notice               = `#form_default_notice`;
    static profile_username             = `#form_username`;
    static profile_first_name           = `#form_first_name`;
    static profile_last_name            = `#form_last_name`;
    static profile_email                = `#form_email`;
    static profile_phone                = `#form_phone`;
    static profile_timezone             = `#s2id_autogen2_search`;
    static profile_company              = '#s2id_autogen3_search';
    static role_supplier_manager        = `#parent_form_roles #form_role_supplier_manager`;
    static role_supplier_admin          = `#parent_form_roles #form_role_supplier_admin`;
    static role_requestor_admin         = `#parent_form_roles #form_role_admin`;
    static confirm_password             = `#password2`;
    static submit_password              = `input[type=submit]`;
    static user_filter                  = `#user_list_filter input`;
    static description_min              = `#form_minDescriptionChar`;
    static property_description         = `//div[@id='form[description]']`;
    static property_features            = `//div[@id='form[features]']`;
    static property_amenities           = `//div[@id='form[amenities]']`; 
    static area_name                    = `#form_name`;
    static area_location                = `#form_location`;
    static impersonate_search           = `#select2-chosen-1`;
    static impersonate_result           = `#select2-result-label-2`;
    static client_name                  = `input[label='Name:']`;
    static client_default_notice        = `input[label*='Days Notice']`;
    static duplicated_client_name       = `#check_duplicate_form_name`;
    static tax_value                    = `//h2[contains(text(),'Taxes:')]/parent::div//input[contains(@class,'feesegment-value')]`;
    static deposit_value                = `//h2[contains(text(),'Deposits:')]/parent::div//input[contains(@class,'feesegment-value')]`;
    static reservation_tax_segment      = `//div[@id='taxable-section']//input[contains(@class, 'feesegment-value')]`;
    static reservation_fee_segment      = `//div[contains(@class,'fee-section')]//input[contains(@class, 'feesegment-value')]`;
    static reservation_deposit_segment  = `//div[contains(@class,'deposit-section')]//input[contains(@class, 'feesegment-value')]`;
    static supplier_filter              = `#supplier-search-filter input`;
    static referral_commision           = `#areaFeeForm_referral_fee`;
    static reloquest_fee                = `#areaFeeForm_service_fee`;
    static default_referral_fee         = `#defaultAreaFeeForm_referral_fee`;
    
}