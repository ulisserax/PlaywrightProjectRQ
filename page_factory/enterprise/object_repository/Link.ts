export default class Link{
    static createAccount           = `.register-btn`;
    static forgotPassword          = `.forgot-pass-containr a`;
    static desired_location        = `div.pac-item`;
    static request_id              = `td.request_uid a`;
    static reservation_id          = `td.reservation_uid a`;
    static property                = `#select2-results-1 li`;
    static share_link              = `//a[contains(@href,'reloquest.com/request/show/')]`;
    static edit_segment_details    = `a.lnk-edit-ratesegment`;
    static today_link              = `div[aria-hidden='false'] .k-nav-today`;
    static view_segment_history    = `a.view-segment-history-link`;
    static view_link               = `.popover.fade.top.in a`;
    static view_service_issue      = `table#supplier_status_list a:text('view')`;
    static add_a_comment           = `#addNewComment`;
    static unaward                 = `a:text('Unaward')`;
    static back_to_search_results  = `//a[contains(text(),'Back to Search Results')]`;
    static register                = `//a[contains(@href,'reloquest.com/registration/register')]`;
    static terms_of_service        = `//a[contains(text(),'Terms of Service')]`;
    static privacy_policy          = `//div[@class='login-container']//a[contains(text(),'Privacy Policy')]`;
    static terms_of_use            = `//div[@class='login-container']//a[contains(text(),'Terms of Use')]`;
    static dpa                     = `//div[@class='login-container']//*[contains(text(),'Data Processing Addendum')]`;
    static activate_account        = `//a[contains(text(), 'Activate My Account')]`;
    static create_an_account       = `//a[contains(text(), 'create an account')]`;
    static tab_settings            = `//a[text() = 'Settings']`;
    static passwordReset           = `//a[contains(@href,'reloquest.com/password_reset')]`;   
    static password_reset          = `//a[contains(@href,'reloquest.com/reset-password')]`; 
    static add_rate                = `a#add_rate_segment`; 
    static add_tax                 = `a#add_tax_type`;
    static add_fees                = `a#add_fee_segment`;   
    static add_deposit             = `a#add_deposit_segment`; 
    static add_reservation_fee     = `a#add_fee_type`; 
    static add_reservation_deposit = `a#add_deposit_type`;   
    static supplier_id             = `#supplier-search_wrapper a[href*="supplier"]`;
    static add_supplier            = `#add-supplier.btn`;
    static add_exception_fee       = `a#addRequestorSupplierAreaFee`;
    static default_referral_fee    = `#show_default_referral_fee~.editDefaultFee`;     
    static notified_supplier       = `#showNotifiedSuppliers`; 
    static edit_property           = `//table[contains(@id,'DataTables_Table')]//tbody//a[contains(@href,'/property/')]`;
    static create_account          = `//a[contains(@href,'reloquest.com/register?')]`;
    static exit_impersonation      = `//a[contains(@href,'exit')]`;
    static add_client_direct_area  = `//a[contains(text(),'here')]`;
    static action_remove           = `(//tr//td//a[contains(text(),'Remove')])`;
    static show_advanced_settings  = `//div[@id='share_modal']//a[contains(@class,'toggle-advanced-permissions')][contains(normalize-space(),'Advanced Settings')]`;
    static share_log_history_link  = `//div[@id='share_log']//a[contains(@class,'share-log-toggler')]`;
    static share_log_table_option_toggle = `//div[@id='share_log']//table[contains(@class,'share-log')]/tbody//a[contains(@class,'toggle-shared-options')]`;
    static get_shared_link_options       = `//div[@id='share_log']//table[contains(@class,'share-log')]/tbody//a[contains(@class,'get-link-shared-options')]`;
    static remove_directed_area     = `//table/tbody//a[text()='Remove']`;
    static edit_directed_area       = `//table/tbody//a[text()='Edit']`;
    static allow_supplier_edit      = `//a[@data-target='#unlock-reservation-modal']`

    static remove(num: number) {
        return `(//tr//td//a[contains(text(),'Remove')])[${num}]`;
    }

    static property_element(text:string){
        return `//ul[@id='select2-results-1']//*[contains(text(),'${text}')]`;
    }

    static edit_client(client:string){
        return `//table[@id='client_list']//a[contains(normalize-space(),'${client}')]`;
    }

}

