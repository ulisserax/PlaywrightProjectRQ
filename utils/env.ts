const Chance = require ('chance');
const chance = new Chance();

export default class ENV{

    // Enterprise Test Data
    static BASE_URL                  = process.env.BASE_URL
    static BASE_URL1                 = process.env.BASE_URL1
    static MAILCATCHER_URL           = process.env.MAILCATCHER_URL
    static SUPPLIER_DOMAIN           = process.env.SUPPLIER_DOMAIN
    static SUPER_ADMIN               = process.env.SUPER_ADMIN
    static SUPER_ADMIN_PASSWORD      = process.env.SUPER_ADMIN_PASSWORD
    static REQUESTOR_ADMIN           = process.env.REQUESTOR_ADMIN
    static REQUESTOR_USER            = process.env.REQUESTOR_USER
    static REQUESTOR_ADMIN_PASSWORD  = process.env.REQUESTOR_ADMIN_PASSWORD
    static SUPPLIER_ADMIN            = process.env.SUPPLIER_ADMIN
    static SUPPLIER_ADMIN_PASSWORD   = process.env.SUPPLIER_ADMIN_PASSWORD
    static SUPPLIER_MANAGER          = process.env.SUPPLIER_MANAGER
    static SUPPLIER_MANAGER_PASSWORD = process.env.SUPPLIER_MANAGER_PASSWORD
    static SUPPLIER_COMPANY          = process.env.SUPPLIER_COMPANY
    static SUPPLIER_COMPANY_FOR_RQPRO= process.env.SUPPLIER_COMPANY_FOR_RQPRO
    static REQUESTOR_COMPANY         = process.env.REQUESTOR_COMPANY
    static CLIENT_EB2E_RQPRO         = process.env.CLIENT_EB2E_RQPRO
    static CLIENT_EB2E               = process.env.CLIENT_EB2E
    static CLIENT                    = process.env.CLIENT
    static CLIENT_ACCEPT             = process.env.CLIENT_ACCEPT
    static GUEST_FIRSTNAME           = chance.first()
    static GUEST_LASTNAME            = chance.last()
    static PROPERTY                  = process.env.PROPERTY
    static CLIENT_EMAIL              = `client_${chance.first()}_${chance.integer({min:0,max:9999})}@reloquest.com`
    static GUEST_EMAIL               = `${this.GUEST_FIRSTNAME}_${chance.integer({min:0,max:9999})}@${this.REQUESTOR_COMPANY}.com`
    static GUEST_PHONE               = chance.phone()
    static REQUEST_TYPE              = [`Corporate Housing Only`,`Hotels Only`,`Hotels and Corporate Housing`]
    static GUEST_TYPE                = [`Standard`,`VIP`,`High Visibility`, `Executive`, `Intern`, `Group Move`]
    static INTERNAL_ID               = `internal_id-${chance.integer({min:0, max:99999})}`
    static UNIT_TYPE                 = [`Aparthotel`, `Apartment`, `Apartment - w/Kitchen`, `Flat`, `Condo`, `Hotel`, `House`, `Townhouse`]
    static KITCHEN_TYPE              = [`none`, `Kitchenette`, `Full Kitchen`]
    static STYLE                     = [`A+`, `A`, `B`, `C`, `D`]
    static BEDROOMS                  = [`Studio/Efficiency`, `1`, `2`, `3`, `4`, `5`]
    static BATHROOMS                 = [`0.5`, `1`, `1.5`, `2`, `2.5`]
    static FEES_TYPE                 = [`DAY`, `FLAT`, `PERCENT`, `NIGHT`]
    static ACKNOWLEDGE_AWARD         = [`accept`, `decline`, `submit_new_option`]
    static SUPPLIER_COMPANY_EMAIL    = `${this.SUPPLIER_COMPANY}@notification.com`
    static SUPPLIER_COMPANY_FOR_RQPRO_EMAIL = `${this.SUPPLIER_COMPANY_FOR_RQPRO}@notification.com`
    static SUPPLIER_EMAIL            = `${this.SUPPLIER_ADMIN}@${this.SUPPLIER_COMPANY}.com`
    static SUPPLIER_SERVICE_EMAIL    = `${this.SUPPLIER_ADMIN}@service.com`
    static SUPPLIER_ESCALATION_EMAIL = `${this.SUPPLIER_ADMIN}@escalation.com`
    static SUPPLIER_FIRST_NAME       = chance.first();
    static SUPPLIER_LAST_NAME        = chance.last();
    static REQUESTOR_EMAIL           = `${this.REQUESTOR_USER}@${this.REQUESTOR_COMPANY}.com`
    static BILLING_EMAIL             = process.env.BILLING_EMAIL
    static REQUESTOR_ADMIN_EMAIL     = `${this.REQUESTOR_ADMIN}@${this.REQUESTOR_COMPANY}.com`
    static AWARD_IN_PROGRESS         = 0
    static FULL_GUEST_NAME           = `${this.GUEST_FIRSTNAME} ${this.GUEST_LASTNAME}`
    static REQUESTOR_API_KEY         = process.env.REQUESTOR_API_KEY
    static SUPPLIER_API_KEY          = process.env.SUPPLIER_API_KEY
    static PROPERTY_DESCRIPTION      = ''
    static PROPERTY_FEATURES         = ''
    static PROPERTY_AMENITIES        = ''
    static SERVICE_DESCRIPTION       = `${chance.string({length: 5, numeric: true})} - Service Issue created by: `
    static ROLE_VISIBILITY           = ['REQUESTOR', 'EMPLOYEE', 'SUPPLIER'];
    
    static EXCEPTION_FEE_CLIENT_ID  = process.env.EXCEPTION_FEE_CLIENT_ID
    static  CLIENT_ID               = process.env.CLIENT_ID

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
    static START_DATE        = new Date(new Date().setDate(new Date().getDate()+20)).toISOString().split('T')[0];
    static END_DATE          = new Date(new Date().setDate(new Date().getDate()+45)).toISOString().split('T')[0];

    static API_GRANT_TYPE              = process.env.API_GRANT_TYPE
    static API_PAYMENT_TOKEN           = process.env.API_PAYMENT_TOKEN
    static API_CLIENT_ID               = process.env.API_CLIENT_ID
    static API_CLIENT_SECRET           = process.env.API_CLIENT_SECRET
    static API_TOKEN                   = process.env.API_TOKEN
    static API_AUTOEMAIL               = process.env.API_AUTOEMAIL
    static API_VALIDATION_TOKEN        = process.env.API_VALIDATION_TOKEN
    static API_RESET_PASSWORD_TOKEN    = process.env.API_RESET_PASSWORD_TOKEN
    static API_CORPROPERTIES_REFERENCE = process.env.API_CORPROPERTIES_REFERENCE
    static API_RATECARD_ID             = ''
    static API_REQUEST_UID             = ''
    static API_PROPERTY_ID             = process.env.PROPERTY_ID
    static API_OPTION_ID               = ''
    static API_RESERVATION_UID         = ''
    static API_RESERVATION_ID          = ''
    static STRIPE_KEY                  = process.env.STRIPE_KEY
    static STRIPE_GUID                 = process.env.STRIPE_GUID
    static STRIPE_MUID                 = process.env.STRIPE_MUID
    static STRIPE_SID                  = process.env.STRIPE_SID
    static STRIPE_PAYMENT_TOKEN        = process.env.STRIPE_PAYMENT_TOKEN
    static STRIPE_TOKEN                = ''

    static RQPRO_COMPANY               = process.env.RQPRO_COMPANY
    static RQPRO_BASE_URL              = process.env.RQPRO_BASE_URL
    static RQPRO_B2E_URL               = process.env.RQPRO_B2E_URL
    static RQPRO_REQ_ADMIN             = process.env.RQPRO_REQ_ADMIN
    static RQPRO_REQ_API_KEY           = process.env.RQPRO_REQ_API_KEY
    static RQPRO_GUEST_FOR_SERVICE     = process.env.RQPRO_GUEST_FOR_SERVICE
    static RQPRO_EB2E_CLIENT           = process.env.RQPRO_EB2E_CLIENT
    static SUPPLIER_FOR_RQPRO_ADMIN    = process.env.SUPPLIER_FOR_RQPRO_ADMIN
    static SUPPLIER_FOR_RQPRO_API_KEY  = process.env.SUPPLIER_FOR_RQPRO_API_KEY
    static RQPRO_GUEST_EMAIL           = `${this.GUEST_FIRSTNAME}_${chance.integer({min:0,max:9999})}@${this.RQPRO_COMPANY}.com`;

    static DB_URL       = process.env.DB_URL
    static DB_NAME      = process.env.DB_NAME
    static DB_PORT      = process.env.DB_PORT
    static DB_USERNAME  = process.env.DB_USERNAME
    static DB_PASSWORD  = process.env.DB_PASSWORD
    static IMAGE_PATH   = 'images/property1.jpeg'

    static ALLOCATION_CLIENT                = process.env.ALLOCATION_CLIENT// 4952 - 4941 - 4944 - 4951
    static ALLOCATION_CLIENT_NAME           = process.env.ALLOCATION_CLIENT_NAME
    static ALLOCATION_SUPPLIERS             = [`nt1sup`, `nt2sup`,`nt3sup`] //[`Synergy Global Housing`, `National Corporate Housing`, `CWS Corporate Housing`]
    static ALLOCATION_REQUESTOR_ADMIN       = `nt3reqrqpro_admin`
    static ALLOCATION_REQUESTOR_PASS        = "Carpediem_21"
    // not needed - I'll use RQPRO_BASE_URL //static ALLOCATION_URL1 = "https://stagent1req.reloquest.com"
    
    static YUS_LOCAL                        = "http://yus.relochoice.com"
}