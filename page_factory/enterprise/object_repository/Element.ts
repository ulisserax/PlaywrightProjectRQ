import ENV from "@utils/env";

export default class Element{
    static approved_options_table_row           = `table#all_options tbody tr.approved.corporate-option`; 
    static awarded_options_table_row            = `table#all_options tbody tr.awarded.corporate-option`;
    static hotels_options_table_row             = `table#all_options tbody tr.approved.awarded.hotel-option`;
    static hotel_option_non_awarded             = `table#all_options tbody tr.hotel-option`;
    static hotel_options_award_in_progress      = `table#all_options tbody tr.award_in_progress.hotel-option`;
    static hotel_property_name                  = `table#all_options tbody tr.award_in_progress.hotel-option td.property-name`
    static alternate_options_table_row          = `table#all_options tbody tr.approved.corporate-option span.alt-option-link`;
    static client_name                          = `div[role=option] span:text('${ENV.CLIENT}')`;
    static client_b2e_name                      = `div[role=option] span:text('${ENV.CLIENT_B2E}')`;
    static client_eb2e_name                     = `div[role=option] span:text('${ENV.CLIENT_EB2E}')`;
    static client_eb2e_rqpro_name               = `div[role=option] span:text('${ENV.CLIENT_EB2E_RQPRO}')`;
    static close_modal_icon                     = `div.modal.fade.in button.close`;
    static activity_log_modal_li                = `#activity_log_modal li.list-group-item`;
    static pending_approval_icon                = `.rate-segment-description.pointer + td span`;
    static property_info_image                  = `#propertyInfoImage`;
    static loading_property_info                = `label:text('Loading Appartment Data...')`;
    static request_loading                      = `img.loading`;
    static hotel_special_information            = `#request-profile-container div.request-details--item.request-notes`;
    static confirm_booking_h1                   = `.hotel-option-details h1`;
    static booking_confirmation                 = `#hotelOptionDetailSection h1`;
    //static option_map_icon                      = `//div[@id="request_map_view"]//div[@aria-label='Map']//div[@tabindex="0"]/img`
    static option_map_icon                      = `//div[@id="request_map_view"]//div[@role='button']/img`;
    static icon_option_confirmation             = `table#all_options tbody tr span.icon-option-confirmation`;
    static icon_confirm_availability            = `table#all_options tbody tr span.responded.available`;
    static option_availability_message          = `//div[contains(text(),'remaining to confirm option availability')]`;
    static table_option_declined                = `table#all_options tbody tr.corporate-option.unavailable`;
    static invitation_form                      = `#invitation-form`;
    static invitation_sent                      = `//div[contains(text(),'sent successfully')]`;
    static hotel_rooms_available                = `div.hotel-rooms-available`; 
    static company_form_title                   = `//h1[contains(text(),'Update Company')]`;
    static new_company_country                  = `//div[contains(text(),'United States')]`;
    static default_washer_dryer                 = `//div[@id='s2id_form_default_washer_dryer']`;  
    static profile_timezone                     = `#s2id_form_timezone`;
    static profile_company                      = `#s2id_form_company`;
    static confirm_password_reset               = `//h3[contains(text(),"password successfully")]`;
    static edit_user                            = `.profile-actions-td .edit`;
    static areas_of_coverage                    = `//h1[contains(text(),'Areas of Coverage')]`;
    static custom_area                          = `//h2[contains(text(),'Custom Areas for this Supplier')]`;
    static image_modal                          = `//div[@id='image_upload_modal' and @class='modal fade in']`;
    static client_form_title                    = `//h1/span[contains(text(),'Client:')]`;
    static client_settings                      = `.client-ico-settings`;
    static client_details                       = `.client-ico-client-details`;
    static client_supplier_management           = `.client-ico-supplier-management`;
    static supplier_area_icon                   = `//a[@href='#supplier-areas']`;
    static supplier_referral_icon               = `.icon-supplier-referral`;
    static area_confirmation_title              = `//h4[contains(text(),'The approved areas')]`;
    static supplier_fee_modal                   = `#area_fee_modal  h4.modal-title`;
    static supplier_seting_updated              = `//div[contains(text(),'Supplier setting has been saved')]`;
    static exception_fee_area                   = `//table[@id='area_fee_list']  //td[text()='Miami, FL, USA']`;
    static default_referral_fee                 = `#show_default_referral_fee .number`;
    static segment_summary_section              = `div.segment-summary-section`;
    static rate_length                          = `#rate_segment_placement .segment-length-stay`;
    static delete_rate_segment                  = `//div[@id='rate_segment_1']//span[contains(@class,'delete_rate_segment')]`;
    static rate_segment_rows                    = `//div[@id='rate_segment_placement']/div[contains(@class,'row_rate_segment')]`;
    static no_area_modal                        = `//div[contains(text(),'No suppliers for this area.')]`;
    static insert_image_modal                   = `//h3[contains(text(),'Image')]`;
    static reloquest_fee_card                   = `//div[@id='requestorSupplierDefaultFees']//div[contains(@class, 'default_fee_box')]`;
    static property_image                       = `//div[@id='gallery_preview_form_gallery_gallery']//div[contains(@class,'gallery-image-container')]`;
    static modal_availability_not_visible       = `//div[@id='confirm_modal' and @class='modal fade']`;
    static modal_option_verification            = `//div[@data-show='true' and @class='modal fade in']`;
    static modal_notice_to_vacate               = `//div[not(contains(@class,'modal fade ntv-modal in'))]`;
    static modal_nte_extension                  = `//div[@id='ntv-approve-deny-modal-supplier' and contains(@class, 'fade in')]`;
    static modal_nte_extension_close            = `//div[@id='ntv-approve-deny-modal-supplier' and contains(@class, 'fade in')]//button[@class='close']`;
    static ntv_status_accepted                  = `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]//span[3][contains(@class,'icon-icons_check_mark green pull-right')]`;
    static ntv_status_action_required           = `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input ntv-status-action-required')]`;
    static ntv_status_waiting                   = `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]//span[1][@class='orange']`;
    static ntv_status_declined                  = `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]//span[@class='ntv-red-text']`;
    static ntv_status_default                   = `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]`;
    static ntv_modal                            = `//div[@id='ntv-submit-modal']`;
    static edit_segments_modal                  = `//div[@id='panel_segments']//div[contains(@class,'rate-details')]`;
    static added                                = `//button[@style='display: none;']/following-sibling::button[@disabled='disabled'][contains(normalize-space(),'Added')]`;
    static edit_lock_modal                      = `//div[@id='reservation_is_locked_modal'][@class='modal fade in']`;
    static edit_locak_modal_title               = `//div[@id='reservation_is_locked_modal'][@class='modal fade in']//h3`;
    static ntv_status_message                   = `//label[contains(text(),'NTV Status:')]//following-sibling::div//div[contains(@class,'ntv-input')]//span`;
    static password_reset_instructions_modal    = `//div[@id='noticeModal'][@style='display: block;']`;

    static clickByClientName(client: string){
        return `div[role=option] span:text('${client}')`;
    }
    static role_visibility(role: string){
        return `#form_visibilityRoles_ROLE_${role}`;
    }

    static role_checkbox(role: string){
        return `//input[@id='form_visibilityRoles_ROLE_${role}' and @disabled='disabled']`;
    }

    static service_issue_created(description: string) {
        return `//table[@id='supplier_status_list']//tbody//tr//td[contains(.,'${description}')]`;
    }
    
    static view_service_issue(description: string) {
        return `//td[contains(.,'${description}')]//following-sibling::td//a`;
    }

    static service_issue_status(description: string) {
        return `//td[contains(text(),'${description}')]//following-sibling::td//span`;
    }

    static service_comment_content(description: string) {
        return `//div[@id='comments-container']//div[contains(.,'${description}')]`;
    }
    
    static clientDirectedRemoveIncludeAllArea(supplier: string) {
        return `//label[contains(normalize-space(),'Include')]/following-sibling::div//span[contains(text(),'${supplier}')]/preceding-sibling::span`;
    }

    static clientDirectedRemoveExcludeAllArea(supplier: string) {
        return `//label[contains(normalize-space(),'Exclude')]/following-sibling::div//span[contains(text(),'${supplier}')]/preceding-sibling::span`;
    }

    static notificationModal(text: string){
        return `//div[contains(@class,'notification-visible')]/h4[@class='notification-title'][contains(normalize-space(),'ReloQuest')]/following-sibling::div[@class='notification-message'][contains(text(),'${text}')]`
    }

    static clientDirectedByArea(location:string, included_supplier:string, excluded_supplier:string){
        return `//tr//td[text()='${location}']//following-sibling::td[normalize-space()='${included_supplier}']//following-sibling::td[normalize-space()='${excluded_supplier}']`;
    }

    static removingDirectedSupplier(supplier: string){
        return `//div[contains(@class,'client-area-modal')]//label[normalize-space()='Directed Suppliers']/following-sibling::div//span[text()='${supplier}']/preceding-sibling::span`
    }

    static removingExcludedSupplier(supplier: string){
        return `//div[contains(@class,'client-area-modal')]//label[normalize-space()='Excluded Suppliers']/following-sibling::div//span[text()='${supplier}']/preceding-sibling::span`
    }
    //table[contains(@class,'table-stripe')]//tbody//td[text()='San Francisco - Updated']/following-sibling::td[normalize-space()='Yes']/following-sibling::td[normalize-space()='nt3sup']/following-sibling::td[normalize-space()='nt1sup']
    static clientDirectedArea(client_area:string, send_to_network: string,directed_supplier: string, excluded_supplier:string){
        return `//table[contains(@class,'table-stripe')]//tbody//td[text()='${client_area}']/following-sibling::td[normalize-space()='${send_to_network}']/following-sibling::td[normalize-space()='${directed_supplier}']/following-sibling::td[normalize-space()='${excluded_supplier}']`;
    }
}


		