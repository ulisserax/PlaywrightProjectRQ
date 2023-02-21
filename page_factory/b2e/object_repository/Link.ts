export default class Link{
    static quests              = `a:has-text('QUESTS')`;
    static edit_payment_method = `//button[contains(text(),'Edit Payment Method')]`;
    static cancel              = `//app-edit-payment//a[contains(text(),'Cancel')]`;
    static cancel_this_quest   = `//span[contains(text(),'Cancel this Quest')]`;
    static register            = `//a[contains(text(), 'New user? Register')]`;
    static forgot_password     = `//a[contains(text(), 'Forgot password?')]`;
    static profile             = `//a[@href='/b2e/profile']`;
    static change_password     = `//div[contains(text(),'Change Password')]`; //`//div[contains(text(),'Change Password')]/parent::div`
    static new_search          = `//a[contains(text(),'NEW SEARCH')]`;
}