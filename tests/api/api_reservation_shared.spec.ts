import test  from '@lib/BaseTest';
import { expect } from '@playwright/test';
import ENV from '@utils/env';
const Validator = require('jsonschema').Validator;
const v = new Validator();
const schema = {
    "type":"array",
    "minItems":1,
    "items":{
        "type":"object",
        "properties":{
            "maid_service": {
                "type":"string"
            },
            "uid": {
                "type":"string"
            },
            "kitchen_type": {
                "type":"string"
            },
            "unit_type": {
                "type":"string"
            },
            "client_id": {
                "type":"number"
            },
            "lat": {
                "type":"string"
            },
            "lon": {
                "type":"string"
            },
            "actual_arrival_date": {
                "type":"string"
            },
            "actual_departure_date": {
                "type":"string"
            },
            "actual_total_days": {
                "type":"number"
            },
            "arrival_date_confirmed": {
                "type":"boolean"
            },
            "arrival_time": {
                "type":"string"
            },
            "bill_to": {
                "type":"string"
            },
            "city": {
                "type":"string"
            },
            "country_code": {
                "type":"string"
            },
            "supplier_company": {
                "type":"string"
            },
            "company_name": {
                "type":"string"
            },
            "currency": {
                "type":"string"
            },
            "departure_date_confirmed": {
                "type":"boolean"
            },
            "departure_time": {
                "type":"string"
            },
            "property_name": {
                "type":"string"
            },
            "client_rate": {
                "type":"number"
            },
            "rate_type": {
                "type":"string"
            },
            "minimum_stay": {
                "type":"string"
            },
            "parking": {
                "type":"boolean"
            },
            "security_deposit": {
                "type":"number"
            },
            "pets_allowed": {
                "type":"string"
            },
            "pet_policy": {
                "type":["string","null"]
            },
            "pet_fee": {
                "type":"string"
            },
            "redecoration_fee": {
                "type":"number"
            },
            "pet_deposit": {
                "type":"number"
            },
            "apartment_address": {
                "type":"string"
            },
            "tax_rate": {
                "type":["string","null"]
            },
            "lease_terms": {
                "type":"string"
            },
            "notice_vacate": {
                "type":"number"
            },
            "bedrooms": {
                "type":"string"
            },
            "bathrooms": {
                "type":"string"
            },
            "number_guest": {
                "type":"number"
            },
            "application_fee": {
                "type":"number"
            },
            "other_charges": {
                "type":"number"
            },
            "pet_number": {
                "type":"number"
            },
            "approval_days": {
                "type":"string"
            },
            "pets": {
                "type":"array",
            },
            "state": {
                "type":"string"
            },
            "zip": {
                "type":["string","null"]
            },
            "created": {
                "type":"string"
            },
            "unit_rating": {
                "type":"string"
            },
            "updated": {
                "type":"string"
            },
            "request": {
                "type":"object",
                "properties":{
                    "wd": {
                        "type":["string","null"]
                    },
                    "maid_service": {
                        "type":"string"
                    },
                    "requested_by_id": {
                        "type":"number"
                    },
                    "requested_by_email": {
                        "type":"string"
                    },
                    "requested_by_name": {
                        "type":"string"
                    },
                    "uid": {
                        "type":"string"
                    },
                    "dept_number": {
                        "type":["string","null"]
                    },
                    "authorized_booking_agent": {
                        "type":["string","null"]
                    },
                    "booking_contact_email": {
                        "type":["string","null"]
                    },
                    "assigned_to_name": {
                        "type":"string"
                    },
                    "assigned_to_email": {
                        "type":"string"
                    },
                    "assigned_to_id": {
                        "type":"number"
                    },
                    "radius_km": {
                        "type":"number"
                    },
                    "radius_mi": {
                        "type":"number"
                    },
                    "kitchen_type": {
                        "type":"string"
                    },
                    "unit_type": {
                        "type":"string"
                    },
                    "adults": {
                        "type":"number"
                    },
                    "location": {
                        "type":"string"
                    },
                    "preferences_set_at": {
                        "type":["string","null"]
                    }
                },"required":["wd","maid_service","requested_by_id","requested_by_email","requested_by_name","uid","assigned_to_name","assigned_to_email","assigned_to_id","kitchen_type","unit_type","adults","location","preferences_set_at"]
            },
            "move_in": {
                "type":"string"
            },
            "move_out": {
                "type":"string"
            },
            "disability_access": {
                "type":"boolean"
            },
            "option": { 
                "type":"object",
                "properties":{
                    "kitchen_type": {
                        "type":"string"
                    }, 
                    "unit_type": {
                        "type":"string"
                    }
                },"required":["kitchen_type","unit_type"]
            },
            "status": {
                "type":"string"
            },
            "move_in_date_confirmed": {
                "type":"boolean"
            },
            "move_out_date_confirmed": {
                "type":"boolean"
            },
            "no_show": {
                "type":"boolean"
            }
        },"required":["maid_service","uid","kitchen_type","unit_type","client_id","lat","lon","actual_arrival_date","actual_departure_date","actual_total_days","arrival_date_confirmed","arrival_time","bill_to","city","country_code","supplier_company","company_name","currency","departure_date_confirmed","departure_time","property_name","client_rate","rate_type","minimum_stay","parking","security_deposit","pets_allowed","pet_policy","pet_fee","redecoration_fee","pet_deposit","apartment_address","tax_rate","lease_terms","notice_vacate","bedrooms","bathrooms","number_guest","application_fee","other_charges","pet_number","approval_days","pets","state","zip","created","unit_rating","updated","request","move_in","move_out","disability_access","option","status","move_in_date_confirmed","move_out_date_confirmed","no_show"]
    }
}


test.describe.only("Api Reservation Shared", () => {
    
   test("Validate the reservation shared schema", async ({reservationEndpoints}) => {
      //const res = await reservationEndpoints.getReservationsShared(ENV.REQUESTOR_API_KEY);
      
      const res = await reservationEndpoints.getReservationsShared("NT2reqAdmin_apikey", '2019-01-01');
      const _response = JSON.parse(res);
      console.log(`Reservation endpoint array contains ${_response.length} item(s)`);
      await expect(_response.length).toBeGreaterThanOrEqual(1);
      console.log('Reservation shared endpoint do not have any error - the array error have lenght '+(v.validate(_response, schema).errors).length);
      console.log(v.validate(_response, schema));
      await expect((v.validate(_response, schema).errors).length).toEqual(0);
   })
})