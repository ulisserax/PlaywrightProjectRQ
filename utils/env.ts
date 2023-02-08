const Chance = require ('chance');
const chance = new Chance();

export default class ENV{

    // Enterprise Test Data
    static BASE_URL                 = process.env.BASE_URL
    static BASE_URL1                = process.env.BASE_URL1
    static MAILCATCHER_URL          = process.env.MAILCATCHER_URL
    static SUPPLIER_DOMAIN          = process.env.SUPPLIER_DOMAIN
    static SUPER_ADMIN              = process.env.SUPER_ADMIN
    static SUPER_ADMIN_PASSWORD     = process.env.SUPER_ADMIN_PASSWORD
    static REQUESTOR_ADMIN          = process.env.REQUESTOR_ADMIN
    static REQUESTOR_USER           = process.env.REQUESTOR_USER
    static REQUESTOR_ADMIN_PASSWORD = process.env.REQUESTOR_ADMIN_PASSWORD
    static SUPPLIER_ADMIN           = process.env.SUPPLIER_ADMIN
    static SUPPLIER_ADMIN_PASSWORD  = process.env.SUPPLIER_ADMIN_PASSWORD
    static SUPPLIER_COMPANY         = process.env.SUPPLIER_COMPANY
    static REQUESTOR_COMPANY        = process.env.REQUESTOR_COMPANY
    static CLIENT_EB2E_RQPRO        = process.env.CLIENT_EB2E_RQPRO
    static CLIENT_EB2E              = process.env.CLIENT_EB2E
    static CLIENT                   = process.env.CLIENT
    static CLIENT_ACCEPT            = process.env.CLIENT_ACCEPT
    static GUEST_FIRSTNAME          = chance.first()
    static GUEST_LASTNAME           = chance.last()
    static PROPERTY                 = process.env.PROPERTY
    static CLIENT_EMAIL             = `client_${chance.first()}_${chance.integer({min:0,max:9999})}@reloquest.com`
    static GUEST_EMAIL              = `${this.GUEST_FIRSTNAME}_${chance.integer({min:0,max:9999})}@reloquest.com`
    static GUEST_PHONE              = chance.phone()
    static REQUEST_TYPE             = [`Corporate Housing Only`,`Hotels Only`,`Hotels and Corporate Housing`]
    static GUEST_TYPE               = [`Standard`,`VIP`,`High Visibility`, `Executive`, `Intern`, `Group Move`]
    static INTERNAL_ID              = `internal_id-${chance.integer({min:0, max:99999})}`
    static UNIT_TYPE                = [`Aparthotel`, `Apartment`, `Apartment - w/Kitchen`, `Flat`, `Condo`, `Hotel`, `House`, `Townhouse`]
    static KITCHEN_TYPE             = [`none`, `Kitchenette`, `Full Kitchen`]
    static STYLE                    = [`A+`, `A`, `B`, `C`, `D`]
    static BEDROOMS                 = [`Studio/Efficiency`, `1`, `2`, `3`, `4`, `5`]
    static BATHROOMS                = [`0.5`, `1`, `1.5`, `2`, `2.5`]
    static FEES_TYPE                = [`DAY`, `FLAT`, `PERCENT`, `NIGHT`]
    static ACKNOWLEDGE_AWARD        = [`accept`, `decline`, `submit_new_option`]
    static SUPPLIER_COMPANY_EMAIL   = `${this.SUPPLIER_COMPANY}@reloquest.com`
    static SUPPLIER_EMAIL           = `${this.SUPPLIER_ADMIN}@reloquest.com`
    static SUPPLIER_FIRST_NAME      = chance.first();
    static SUPPLIER_LAST_NAME       = chance.last();
    static REQUESTOR_EMAIL          = `${this.REQUESTOR_USER}@nt1req.com`
    static BILLING_EMAIL            = process.env.BILLING_EMAIL
    static REQUESTOR_ADMIN_EMAIL    = `${this.REQUESTOR_ADMIN}@reloquest.com`
    static AWARD_IN_PROGRESS        = 0
    static FULL_GUEST_NAME          = `${this.GUEST_FIRSTNAME} ${this.GUEST_LASTNAME}`
    static REQUESTOR_API_KEY        = process.env.REQUESTOR_API_KEY
    static SUPPLIER_API_KEY         = process.env.SUPPLIER_API_KEY

    static PROPERTY_NAME            = ``
    static PROPERTY_ADDRESS         = ``
    static REQUEST_ID               = ``
    static RESERVATION_ID           = ``
    static HOTEL_RESERVATION_ID     = ``

    
    // B2E Test Data
    static B2E_URL           = process.env.B2E_URL
    static CLIENT_B2E        = process.env.CLIENT_B2E
    static B2E_USER_PASSWORD = process.env.B2E_USER_PASSWORD
    static B2E_USER          = process.env.B2E_USER

    // Credit card information
    static CREDIT_CARD       = process.env.CREDIT_CARD
    static CARD_EXPIRATION   = process.env.CARD_EXPIRATION
    static CARD_CVC          = process.env.CARD_CVC
    static ZIP_CODE          = process.env.ZIP_CODE

    static SLACK_TOKEN       = process.env.SLACK_TOKEN;


}