import { expect } from "@playwright/test";
import ENV from "@utils/env";
const Chance = require("chance");
const chance = new Chance();

export default class RequestEndpoints {

    readonly request;

    constructor(request){
        this.request = request;
    }


    async getRequest( base_url: string, api_key:string,status:string){
        const _response = await this.request.get(`${base_url}/api/v1/requests?status=${status}&apikey=${api_key}`);
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async updateDeadlineRequest( base_url: string, api_key:string, uid:string, body_data){
        const _response = await this.request.patch(`${base_url}/api/v1/request/update/${uid}?apikey=${api_key}`, {
            data: {
                supplier_deadline:`${body_data}`
            }
          });
          console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async createRequest( base_url: string, api_key:string, client_id:number, loc:string, 
        arr_date:string, dep_date:string, guest_first_name: string,  guest_last_name:string, 
        guest_email:string, guest_phone: string, request_type: string){
        const _response = await this.request.post(`${base_url}/api/v1/request/create?apikey=${api_key}`, {
            data: {
                "client" : client_id,
                "request_type":  request_type,
                "network_type": "NETWORK",
                "guestTypeLookup": 4,
                "guest_first_name": guest_first_name,
                "guest_last_name": guest_last_name,
                "guest_email": guest_email,
                "guest_phone_country_code": "1",
                "guest_phone": guest_phone,
                "internal_identification": "API-1234",
                "alternate_id": null,
                "location": `${loc}`,
                "radius": 804.672,
                "arrival_date": arr_date,
                "departure_date": dep_date,
                "parking": 0,
                "smoking_unit": 0,
                "disability_access": 0,
                "pet_number": 0,
                "adults": 1,
                "children": null,
                "bedrooms": 1,
                "bathrooms": "1.0",
                "unit_type_lookup": 1,
                "kitchen_type": 1,
                "maid_service": 0,
                "wd": 0,
                "request_fee_paid_by":{
                    "6":"COMPANY",
                    "8":"COMPANY",
                    "9":"GUEST",
                    "10":"COMPANY",
                    "14":"GUEST",
                    "15":"COMPANY",
                    "17":"GUEST",
                    "18":"GUEST",
                    "19":"COMPANY"
                },
                "notice_vacate":5,
                "internet": 1,
                "currency": "USD",
                "budget": null,
                "lease_terms": 0,
                "approval_days": 1,
                "note": "This is the note field",
                "confidential_note": "This is the confidential note field. Request created from POSTMAN",
                "confidential_requestor_note": "This is the confidential requestor note field. Request created from POSTMAN",
                "sorting": "distance,bedrooms,bathrooms,total_rate,available_date,minimum_stay,notice"
            }
        });

        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }
}