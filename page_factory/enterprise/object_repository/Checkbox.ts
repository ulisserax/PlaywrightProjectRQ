export default class Checkbox{
    static priorities_checkbox                  = `input[name="prioritiesCheckbox"]`;
    static cancellation_police_checkbox         = `#form_cancellation_policy_confirmed`;
    static read_supplier_notes_checkbox         = `#form_read_supplier_notes`;
    static option_checkbox                      = `table#all_options td.check` ;
    static understand_shared_link_expire_hidden = `div.confirmShareOptionsOverride.hidden #confirmShareOptions`;
    static understand_shared_link_expire        = `#confirmShareOptions`;
    static terms_of_reservation_checkbox        = `#terms-of-reservation-checkbox`;
    static edit_segment_understand              = `#edit-segments-understand`;
    static confirm_fee                          = `#confirm_fees`;
    static confirm_payment                      = `#confirm_payment`;
    static agree_to_cancellation                = `input[name='agreeToCancellation']`;
    static b2e_term_of_reservation              = `input#b2e_tos_terms_accepted`;
    static new_company                          = `#form_new_company_0`;
    static show_company                         = `input[label*='Show Company']`;
    static guest_can_award                      = `input[label*='Guest Can Award']`;
    static acknowledge_notice_given             = `//input[@id='acknowledge_notice_given']`;
    static acknowledge_date_changes             = `//input[@id='acknowledge_date_changes']`;
    static ntv_confirmation                     = `//input[@id='ntvConfirmation']`;
    static ntv_taxes_and_fees_acknowledge       = `//input[@id='ntvTaxFeeConfirmation']`;
    static understand_guest_able_to_award       = `//div[@id='share_modal']//div[@id='isUnderstandGuestCanAwardCheckboxDiv']`;
}