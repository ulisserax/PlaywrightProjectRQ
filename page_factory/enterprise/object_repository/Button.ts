
export default class Button{
    static signIn     = `[value="login"]`;
    static newRequest = `#add_request`;
    static dashboard  = `#nav_dashboard`;
    static draft      = `a:text("Draft")`;
    static current    = `a:text("Current")`;
    static pending    = `a:text("Pending")`;
    static no_area    = `a:text("No Area")`;
    static closed     = `#tab-closed`;
    static canceled   = `a:text("Cancelled")`;
    static awarded    = `#awarded-has-pending-confirmations a`;
    static suppliers  = `#nav_suppliers`;
    static reports    = `a:text("reports")`;
    static myAccount  = `#account`;
    static help       = `#help_tap`;
    
    static declined   = `a:text("Declined")`;
    static incomplete = `a:text("Incomplete")`;
    static requestors = `a:text("Requestors")`;
    static area       = `#nav_area`;
    static property   = `a:text("Property")`;
    static submit     = `#form_submit`;
    static ok         = `div.modal.fade.in span:text('OK')`;
    static ready_to_submit = `#submitModalBtn`;

    static bid = `#button_option_new`;
    static rqpro_modal_continue = `div#rqpro-modal-id.fade.in span:text('Continue')`;
    static accept = `#button_accept`;
    static yes  = `.modal.fade.in span:text('Yes')`;
    static close = `.modal.fade.in button:text('Close')`;
    static edit_request = `#button_request_edit`;
    static deadline_edit = `.deadline-edit`;
    static save_my_changes = `#reAssignUserButton`;
    static submit_option_modal = `.modal.fade.in #property-fields-modal-update-btn`;

    static now = `button:text("Now")`;
    static apply = `.apply-button`;
    static update_request = `span:text("Update Request")`;
    static share_option = `#btn_option_share`;
    static share_with_client = `button[data-target='client']`;
    static share_with_guest = `button[data-target='guest']`;
    static get_link = `button:text("Get Link")`;
    static send_email = `span:text("Send Email")`;
    static swiftmailer_spool_send = `div[title='swiftmailer spool send'] + div`;
    static submit_share_option = `#btn_option_share`;
    static copy_link = `#modal_btn_share_link_copy`;
    static done = `#modal_btn_share_link_done`;
    static award  = `table#all_options a:text("Award")`;
    static submit_akcnowledge = `#submitAcknowledgeBtn`;

    static reservation_info = `#button_request_reservation`;
    static submit_changes = `span:text('Submit Changes')`;
    static service_issues = `#showServiceIssues`;
    static create_new_service_issue = `#button_service_issue_create`;
    static activity_log = `#button_activity_log`;
    static approve = `button:text('Approve')`;
    static approve_changes = `#form-reservations-approve button:text('Approve Changes')`;
    static okay = `:text('Okay')`;
    static save_comment = `button#saveComment`;
    static update_service_issue = `#button_service_issue_create`;
    static search_hotel_options = `#searchHotelOptions`;
    static view_details =  `button:text('VIEW DETAILS')`;
    static book =  `button:text('BOOK')`;
    static submit_room_configuration = `#submit_room_configuration`;
    static confirm_booking = `span:text('Confirm Booking')`;
    static back_to_request = `a:text(Back To Request)`;
    static ok_cancellation = `div.modal.fade.in span:text('Ok')`
}