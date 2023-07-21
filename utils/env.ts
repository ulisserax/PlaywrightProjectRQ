const Chance = require ('chance');
const chance = new Chance();

export default class ENV{

    static random_start_date = chance.integer({min:15,max:30});
    static random_end_date   = chance.integer({min:45,max:75});

    // Enterprise Test Data

    static BASE_URL                         = process.env.BASE_URL
    static BASE_URL1                        = process.env.BASE_URL1
    static MAILCATCHER_URL                  = process.env.MAILCATCHER_URL
    static SUPPLIER_DOMAIN                  = process.env.SUPPLIER_DOMAIN
    static SUPER_ADMIN                      = process.env.SUPER_ADMIN
    static SUPER_ADMIN_PASSWORD             = process.env.SUPER_ADMIN_PASSWORD
    static REQUESTOR_ADMIN                  = process.env.REQUESTOR_ADMIN
    static REQUESTOR_USER                   = process.env.REQUESTOR_USER
    static REQUESTOR_ADMIN_PASSWORD         = process.env.REQUESTOR_ADMIN_PASSWORD
    static SUPPLIER_ADMIN                   = process.env.SUPPLIER_ADMIN
    static SUPPLIER_ADMIN_PASSWORD          = process.env.SUPPLIER_ADMIN_PASSWORD
    static SUPPLIER_MANAGER                 = process.env.SUPPLIER_MANAGER
    static SUPPLIER_MANAGER_PASSWORD        = process.env.SUPPLIER_MANAGER_PASSWORD
    static SUPPLIER_COMPANY                 = process.env.SUPPLIER_COMPANY
    static SUPPLIER_COMPANY_FOR_RQPRO       = process.env.SUPPLIER_COMPANY_FOR_RQPRO
    static REQUESTOR_COMPANY                = process.env.REQUESTOR_COMPANY
    static CLIENT_EB2E_RQPRO                = process.env.CLIENT_EB2E_RQPRO
    static CLIENT_EB2E                      = process.env.CLIENT_EB2E
    static CLIENT                           = process.env.CLIENT
    static CLIENT_ACCEPT                    = process.env.CLIENT_ACCEPT
    static CLIENT_ACCEPT_ID                 = process.env.NT1_ACCEPT_CLIENT_ID
    static GUEST_FIRSTNAME                  = chance.first()
    static GUEST_LASTNAME                   = chance.last()
    static PROPERTY                         = process.env.PROPERTY
    static CLIENT_EMAIL                     = `client_${chance.first()}_${chance.integer({min:0,max:9999})}@reloquest.com`
    static GUEST_EMAIL                      = `${this.GUEST_FIRSTNAME}_${chance.integer({min:0,max:9999})}@${this.REQUESTOR_COMPANY}.com`
    static GUEST_PHONE                      = chance.phone()
    static REQUEST_TYPE                     = {'Corporate':'Corporate Housing Only','Hotels':'Hotels Only','Hotels and Corporate':'Hotels and Corporate Housing'}
    static GUEST_TYPE                       = {'Standard':'Standard','Vip':'VIP','High Visibility':'High Visibility', 'Executive':'Executive', 'Intern':'Intern', 'Group Move':'Group Move'}
    static INTERNAL_ID                      = `internal_id-${chance.integer({min:0, max:99999})}`
    static UNIT_TYPE                        = {'Aparthotel':'Aparthotel', 'Apartment':'Apartment', 'Flat':'Flat', 'Condo':'Condo', 'Hotel':'Hotel', 'House':'House', 'Townhouse':'Townhouse'}
    static KITCHEN_TYPE                     = {'None':'none', 'Kitchenette':'Kitchenette', 'Full Kitchen':'Full Kitchen'}
    static STYLE                            = {'A+':'A+', 'A':'A', 'B':'B', 'C':'C', 'D':'D'}
    static BEDROOMS                         = {'Studio/Efficiency':'Studio/Efficiency', 'One Bedroom':'1', 'Two Bedrooms':'2', 'Three Bedrooms':'3', 'Four Bedrooms':'4', 'Five Bedrooms':'5'}
    static BATHROOMS                        = {'Half Bathroom':'0.5', 'One Bathroom':'1', 'One and Half Bathrooms':'1.5', 'Two Bathrooms':'2', 'Two and Half Bathrooms':'2.5'}
    static RATE_FEE_TYPE                    = {'Day':'DAY', 'Flat':'FLAT', 'Night':'NIGHT'}
    static AMOUNT_FEE_TYPE                  = {'Value':'Value', 'Percent':'Percent'}
    static ACKNOWLEDGE_AWARD                = {'Accept':'accept', 'Decline':'decline', 'Submit New Option':'submit_new_option'}
    static SUPPLIER_COMPANY_EMAIL           = `${this.SUPPLIER_COMPANY}@notification.com`
    static SUPPLIER_COMPANY_FOR_RQPRO_EMAIL = `${this.SUPPLIER_COMPANY_FOR_RQPRO}@notification.com`
    static SUPPLIER_EMAIL                   = `${this.SUPPLIER_ADMIN}@${this.SUPPLIER_COMPANY}.com`
    static SUPPLIER_SERVICE_EMAIL           = `${this.SUPPLIER_ADMIN}@service.com`
    static SUPPLIER_ESCALATION_EMAIL        = `${this.SUPPLIER_ADMIN}@escalation.com`
    static SUPPLIER_FIRST_NAME              = chance.first();
    static SUPPLIER_LAST_NAME               = chance.last();
    static REQUESTOR_EMAIL                  = `${this.REQUESTOR_USER}@${this.REQUESTOR_COMPANY}.com`
    static BILLING_EMAIL                    = process.env.BILLING_EMAIL
    static REQUESTOR_ADMIN_EMAIL            = `${this.REQUESTOR_ADMIN}@${this.REQUESTOR_COMPANY}.com`
    static AWARD_IN_PROGRESS                = 0
    static FULL_GUEST_NAME                  = `${this.GUEST_FIRSTNAME} ${this.GUEST_LASTNAME}`
    static REQUESTOR_API_KEY                = process.env.REQUESTOR_API_KEY
    static SUPPLIER_API_KEY                 = process.env.SUPPLIER_API_KEY
    static PROPERTY_DESCRIPTION             = ''
    static PROPERTY_FEATURES                = ''
    static PROPERTY_AMENITIES               = ''
    static SERVICE_DESCRIPTION              = `${chance.string({length: 5, numeric: true})} - Service Issue created by:`
    static ROLE_VISIBILITY                  = ['REQUESTOR', 'EMPLOYEE', 'SUPPLIER'];
   
    static NT1_EXCEPTION_FEE_CLIENT_ID  = process.env.NT1_EXCEPTION_FEE_CLIENT_ID
    static NT1_AUTO_CLIENT_ID           = process.env.NT1_AUTO_CLIENT_ID

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
    static START_DATE        = new Date(new Date().setDate(new Date().getDate()+this.random_start_date)).toISOString().split('T')[0];
    static END_DATE          = new Date(new Date().setDate(new Date().getDate()+this.random_end_date)).toISOString().split('T')[0];

    static API_REQUEST_TYPE            = {'Corporate':'CORPORATE_HOUSING','Hotels':'HOTELS','Hotels and Corporate':'HOTELS_AND_CORPORATE_HOUSING'}
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
    static API_NT1_PROPERTY_ID         = process.env.NT1SUP_PROPERTY_ID
    static API_NT3_PROPERTY_ID         = process.env.NT3SUP_PROPERTY_ID
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


    static TAXES                            = {'taxable':"taxable",'nontaxable':'nontaxable'};
    static PARKING                          = {'No Parking':'0', 'One Parking':'1'}
    static ALLOCATION_CLIENT                = process.env.ALLOCATION_CLIENT// 4952 - 4941 - 4944 - 4951
    static ALLOCATION_CLIENT_NAME           = process.env.ALLOCATION_CLIENT_NAME
    static ALLOCATION_SUPPLIERS             = [`nt1sup`, `nt2sup`,`nt3sup`] //[`Synergy Global Housing`, `National Corporate Housing`, `CWS Corporate Housing`]
    static ALLOCATION_REQUESTOR_ADMIN       = `nt3reqrqpro_admin`
    static ALLOCATION_REQUESTOR_PASS        = "Carpediem_21"
    // not needed - I'll use RQPRO_BASE_URL //static ALLOCATION_URL1 = "https://stagent1req.reloquest.com"
    
    static YUS_LOCAL                        = "http://yus.relochoice.com"

    static MAID_SERVICE                     = {'None':'None', 'Daily - Included':'Daily - Included', 'Daily - Additional Fee':'Daily - Additional Fee', 'Weekly - Included':'Weekly - Included', 'Weekly - Additional Fee':'Weekly - Additional Fee', 'Every other week - Included':'Every other week - Included', 'Every other week - Additional Fee':'Every other week - Additional Fee', 'Monthly - Included':'Monthly - Included', 'Monthly - Additional Fee':'Monthly - Additional Fee'}
    static FEE_TYPES_AND_IDS                = {'Property Fee':{'id':'6','name':'Property Fee'}, 'Pet Fee':{'id':'17','name':'Pet Fee'}, 'Resort Fee':{'id':'8','name':'Resort Fee'}, 'Pet Rent':{'id':'21','name':'Pet Rent'}, 'Redecoration Fee':{'id':'18','name':'Redecoration Fee'}, 'Application Fee':{'id':'19','name':'Application Fee'}, 'Maid Service Fee':{'id':'10','name':'Maid Service Fee'}, 'Parking Fee':{'id':'9','name':'Parking Fee'}, 'Cancellation Fee':{'id':'20','name':'Cancellation Fee'}, 'Other Fees':{'id':'13','name':'Other Fees'}}
    static TAX_TYPES_AND_IDS                = {'State Tax':{'id':'2','name':'State Tax'}, 'Other Taxes':{'id':'12','name':'Other Taxes'}, 'Occupancy Tax':{'id':'7','name':'Occupancy Tax'}, 'Local Tax':{'id':'1','name':'Local Tax'}, 'City Tax':{'id':'3','name':'City Tax'}, 'VAT':{'id':'5','name':'VAT'}, 'County Tax':{'id':'4','name':'County Tax'}}
    static DEPOSITS_TYPES_AND_IDS           = {'Other Deposit':{'id':'16','name':'Other Deposit'},'Security Deposit':{'id':'15','name':'Security Deposit'},'Pet Deposit':{'id':'14','name':'Pet Deposit'}};
    static SEGMENT_NUMBER                   = {'first':0,'second':1, 'third':2, 'fourth':3, 'fifth':4, 'sixth':5}

    static NT4_PREFERENCE_DATA_OBJECT           = process.env.NT4_PREFERENCE_DATA_OBJECT
    static NT5_PREFERENCE_DATA_OBJECT           = process.env.NT5_PREFERENCE_DATA_OBJECT
    static NT6_PREFERENCE_DATA_OBJECT           = process.env.NT6_PREFERENCE_DATA_OBJECT
    
}