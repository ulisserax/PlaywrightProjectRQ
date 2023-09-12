export default class Dropdown{

    static select_client                = `#s2id_form_client_list .select2-arrow`;
    static select_request_type          = `#form_request_type`;
    static select_assigned_to           = `#form_user`;
    static assigned_to                  = `#form_user option`;
    static select_guest_type            = `#form_guestTypeLookup`;
    static select_radius                = `#form_radius`;
    static number_of_pets               = `#form_pet_number`;
    static maid_service                 = `#form_maid_service`;
    static washer_dryer                 = `#form_wd`;
    static hotel_rooms                  = `#form_hotel_rooms_count`;
    static select_property              = `#s2id_property_list`;
    static select_unit_type             = `#form_unit_type_lookup`;
    static select_kitchen_type          = `#form_kitchen_type`;
    static select_currency              = `#form_currency`; 
    static select_lease_terms           = `#form_lease_terms`;
    static select_style                 = `#form_style`;
    static select_bedrooms              = `#form_bedrooms`;
    static select_bathrooms             = `#form_bathrooms`;
    static select_air_conditioning      = `#form_airConditioning`;
    static select_parking_type          = `#form_parking_type_1`;
    static select_pet_policy            = `#form_pets_allowed`;
    static select_fee                   = `//h2[contains(text(),'Fees')]/parent::div//select[contains(@class,'segment-fee-type')]`;
    static select_fee_type              = `//h2[contains(text(),'Fees')]/parent::div//select[contains(@class,'tax-type-type')]`;
    static select_preference            = `#all_options .preference`;
    static acknowledge_award            = `#acknowledgeOptionsSelect`;
    static service_issue_type           = `#form_issueType`;
    static issue_status                 = `#form_status`;
    static background_req               = `#form_background_checks_required`;
    static cancellation_policy          = `#form_cancellationPolicy`;
    static tax_fee_policy               = `#form_taxFeePolicy`;
    static invite_role                  = `#form_invitee_role`;
    static new_company_type             = `#form_type`;
    static new_company_country          = `#s2id_companyForm_country`;
    static select_rate_type             = `select#form_n_d`;
    static taxable                      = `select#fee_segments_tax_details`;
    static select_taxes                 = `//h2[contains(text(),'Taxes')]/parent::div//select[contains(@class,'feesegment-taxtype segment-tax-type')]`;
    static select_taxes_type            = `//h2[contains(text(),'Taxes')]/parent::div//select[contains(@class,'tax-type-type')]`;
    static select_deposits              = `//h2[contains(text(),'Deposits')]/parent::div//select[contains(@class,'feesegment-taxtype')]`;
    static expand_taxes                 = `//div[contains(@class, 'taxes-dropdown')]`;
    static expand_fees                  = `//div[@aria-controls='fee_details_container']`;
    static expand_deposits              = `//div[@aria-controls='deposits_details_container']`;
    static reservation_tax_segment      = `//div[@id='taxable-section']//div[contains(@class,'fee_segment_tax_types')]//select[contains(@class, 'feesegment-taxtype segment-tax-type')]`;
    static reservation_fee_segment      = `//div[contains(@class,'fee-section')]//div[contains(@class,'fee_segment_fee_types')]//select[contains(@class, 'feesegment-taxtype segment-tax-type')]`;
    static reservation_deposit_segment  = `//div[contains(@class,'deposit-section')]//select[contains(@class,'feesegment-taxtype segment-tax-type')]`;
    static reservation_tax_seg_type     = `//div[@id='taxable-section']//select[contains(@class, 'tax-type-type')]`;
    static reservation_fee_seg_type     = `//div[contains(@class,'fee-section')]//select[contains(@class, 'tax-type-type')]`;
    static readonly_assigned_to         = `form_request_type-readonly`;
    static readonly_request_type        = `//*[@id='form_request_type' and @disabled]`;
    static bill_to                      = `#form_bill_to`;
    static taxes_expanded               = `//div[contains(@class,'taxes-dropdown')]//div[@aria-expanded='false']`;
    static fees_expanded                = `//div[@id='fee_details_container'][@aria-expanded='false']`;
    static deposits_expanded            = `//div[@id='deposits_details_container'][@aria-expanded='false']`;
    static select_include_supplier      = `//label[contains(normalize-space(),'Include')]/following-sibling::div//span[@class='Select-arrow-zone']`;
    static select_exclude_supplier      = `//label[contains(normalize-space(),'Exclude')]/following-sibling::div//span[@class='Select-arrow-zone']`;
    static modal_include_supplier      = `//label[contains(normalize-space(),'Directed Suppliers')]/following-sibling::div//span[@class='Select-arrow-zone']`;
    static modal_exclude_supplier      = `//label[contains(normalize-space(),'Excluded Suppliers')]/following-sibling::div//span[@class='Select-arrow-zone']`;

    static includeSupplier(supplier: string){
        return `//label[contains(normalize-space(),'Include')]/following-sibling::div//div[contains(@class,'Select-option')][contains(text(),'${supplier}')]`;
    }

    static excludeSupplier(supplier: string){
        return `//label[contains(normalize-space(),'Exclude')]/following-sibling::div//div[contains(@class,'Select-option')][contains(text(),'${supplier}')]`;
    }

    static includeSupplierModal(supplier: string){
        return `//label[contains(normalize-space(),'Directed Suppliers')]/following-sibling::div//div[contains(@class,'Select-option')][contains(text(),'${supplier}')]`;
    }

    static excludeSupplierModal(supplier: string){
        return `//label[contains(normalize-space(),'Excluded Suppliers')]/following-sibling::div//div[contains(@class,'Select-option')][contains(text(),'${supplier}')]`;
    }

    // <div class="Select-menu-outer" data-reactid=".1.1.1.$2/=12.$2.7.$wrapper.$input.2">
    //   <div class="Select-menu" data-reactid=".1.1.1.$2/=12.$2.7.$wrapper.$input.2.0">
    //   <div class="Select-option is-disabled" data-reactid=".1.1.1.$2/=12.$2.7.$wrapper.$input.2.0.$option-0-500">nt1sup</div>
    //   <div class="Select-option is-focused" data-reactid=".1.1.1.$2/=12.$2.7.$wrapper.$input.2.0.$option-1-504">nt3sup</div>
    //   </div>
    //   </div>
}