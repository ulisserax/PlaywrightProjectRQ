export default class Text{
    static select_first_client = `ul#select2-results-2 li`;
    static request_id = `//span[@class='profile-title' and text()='Request ID:']//parent::div`;
    static reassign_user_reason = `#form_reassign_user_reason`;
    static options_count = `#all_options_total`;
    static console_output = `div#co-value`;
    static first_email = `//nav[@id='messages']//tbody/tr[not(contains(@style, 'display: none'))][1]`;
    static email_to = `#message dd.to`;
    static email_subject = `#message dd.subject`;
    static acknowledge_text = `#container-inner .acknowledgement-item__text`;
    static reservation_info_header = `h2.header-title`; 
    static segment_pending_approval_section = `div#segments-history-modal strong:text('Segments Pending Approval:')`;  
}