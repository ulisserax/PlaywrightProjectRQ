const Chance = require ('chance');
const chance = new Chance();

export default class ENV{
    static BASE_URL = process.env.BASE_URL
    static BASE_URL1 = process.env.BASE_URL1
    static B2E_URL = process.env.BASE_URL
    static MAILCATCHER_URL = process.env.MAILCATCHER_URL
    static SUPER_ADMIN = process.env.SUPER_ADMIN
    static SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD
    static REQUESTOR_ADMIN = process.env.REQUESTOR_ADMIN
    static REQUESTOR_USER = process.env.REQUESTOR_USER
    static REQUESTOR_ADMIN_PASSWORD = process.env.REQUESTOR_ADMIN_PASSWORD
    static SUPPLIER_ADMIN = process.env.SUPPLIER_ADMIN
    static SUPPLIER_ADMIN_PASSWORD = process.env.SUPPLIER_ADMIN_PASSWORD
    static B2E_USER = process.env.B2E_USER
    static B2E_USER_PASSWORD = process.env.B2E_USER_PASSWORD
    static GUEST_FIRSTNAME = chance.first()
    static GUEST_LASTNAME = chance.last()
    static GUEST_EMAIL = `${this.GUEST_FIRSTNAME}_${chance.integer({min:0,max:9999})}@reloquest.com`
    static GUEST_PHONE = chance.phone()
    static CLIENT_EB2E_RQPRO = process.env.CLIENT_EB2E_RQPRO
    static CLIENT_EB2E = process.env.CLIENT_EB2E
    static CLIENT_B2E = process.env.CLIENT_B2E
    static CLIENT = process.env.CLIENT
    static REQUEST_TYPE = [`Corporate Housing Only`,`Hotels Only`,`Hotels and Corporate Housing`]
    static GUEST_TYPE = [`Standard`,`VIP`,`High Visibility`, `Executive`, `Intern`, `Group Move`]
    static INTERNAL_ID = `internal_id-${chance.integer({min:0, max:99999})}`
    static PROPERTY = process.env.PROPERTY
    static UNIT_TYPE = [`Aparthotel`, `Apartment`, `Apartment - w/Kitchen`, `Flat`, `Condo`, `Hotel`, `House`, `Townhouse`]
    static KITCHEN_TYPE = [`none`, `Kitchenette`, `Full Kitchen`]
    static STYLE = [`A+`, `A`, `B`, `C`, `D`]
    static BEDROOMS = [`Studio/Efficiency`, `1`, `2`, `3`, `4`, `5`]
    static BATHROOMS = [`0.5`, `1`, `1.5`, `2`, `2.5`]
    static FEES_TYPE = [`Per Night`, `Flat`, `Percent`]
    static ACKNOWLEDGE_AWARD = [`accept`, `decline`, `submit_new_option`]
}