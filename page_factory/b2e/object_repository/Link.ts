export default class Link{
    static quests              = `a:has-text('QUESTS')`;
    static edit_payment_method = `//button[contains(text(),'Edit Payment Method')]`;
    static cancel              = `//app-edit-payment//a[contains(text(),'Cancel')]`;
    static cancel_this_quest   = `//*[contains(text(),'Cancel this Quest')]`;
    static register            = `//a[contains(text(), 'New user? Register')]`;
    static forgot_password     = `//a[contains(text(), 'Forgot password?')]`;
    static profile             = `//a[@href='/b2e/profile']`;
    static change_password     = `//div[contains(text(),'Change Password')]`; //`//div[contains(text(),'Change Password')]/parent::div`
    static new_search          = `//a[contains(text(),'NEW SEARCH')]`;
    static uncheck_all         = `//a[contains(text(),'Uncheck All')]`;
    static notice_to_vacate    = `//span[contains(text(),'Notice to Vacate')]`;
    static ntv_change_date     = `//app-ntv-reminder//button[contains(text(),'Change Date')]`;
}