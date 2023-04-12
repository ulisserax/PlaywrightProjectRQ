export default class Calendar{
    static arrival_date     = `[aria-controls='form_arrival_date_dateview'] span`;
    static arrow_next_month = `.k-link.k-nav-next span`;
    static arrow_prev_month = `.k-link.k-nav-prev span`;
    static middle_date      = `//div[@id='form_arrival_date_dateview' and @aria-hidden='false']//table[@class='k-content k-month']//tr[3]//td[3]`;
    static start_date       = `#rate_segment_0 span.k-i-calendar`;
    static ntv_next_month   = `//div[@id='new-ntv-calendar']//a[@aria-label='Next']`;
    static nte_new_end_date = `//table[contains(@aria-activedescendant,'new-ntv-calendar')]//a`;
}