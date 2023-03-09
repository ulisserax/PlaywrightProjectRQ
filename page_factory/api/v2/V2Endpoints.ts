import { expect } from "@playwright/test";
import ENV from "@utils/env";
const Chance = require("chance");
const chance = new Chance();

export default class V2Endpoints {

    readonly request;

    constructor(request){
        this.request = request;
    }

    async oauth(base_url: string, grant_type:string, client_id:string, client_secret:string, username:string, password:string){
        const _response = await this.request.post(`${base_url}/oauth/v2/token`, {
            data: {
                grant_type:`${grant_type}`,
                client_id: `${client_id}`,
                client_secret:`${client_secret}`,
                username:`${username}`,
                password:`${password}`
            }
        });
        // console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async getProfile(base_url: string, token:string){
        const _response = await this.request.get(`${base_url}/api/v2/profile`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        // console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async getReservations(base_url: string, token:string){
        const _response = await this.request.get(`${base_url}/api/v2/getreservations`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        //console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async getPropertyDetails(base_url: string, token:string, reference:string){
        const _response = await this.request.get(`${base_url}/api/v2/property_details?reference=${reference}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        // console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async createRequest(base_url: string, token:string, date_from:string, date_to:string, location:string, bathrooms:string, bedrooms:string, rooms:string){
        const _response = await this.request.post(`${base_url}/api/v2/createRequest`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data: {
                date_from:`${date_from}`,
                date_to: `${date_to}`,
                location:`${location}`,
                bathrooms:`${bathrooms}`,
                bedrooms:`${bedrooms}`,
                rooms:`${rooms}`
            }
        });
        //console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async propertiesRateCard(base_url: string, token:string, request_uid:string ,bathrooms:string, bedrooms:string, date_from:string, date_to:string, location:string){
        const _response = await this.request.post(`${base_url}/api/v2/propertiesRateCard?currency=USD`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data: {
                request_uid:`${request_uid}`,
                bathrooms:`${bathrooms}`,
                bedrooms:`${bedrooms}`,
                date_from:`${date_from}`,
                date_to: `${date_to}`,
                location:`${location}`
                
                
            }
        });
        //console.log(await _response.text())
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async go2Network(base_url: string, token:string, request_uid:string ,unit_type_lookup:string, kitchen_type:string, hours_to_deadline:string, disability_access:boolean, pet_number:number, maid_service:string,parking_spaces:number,smoking_unit:boolean, wd:string, ratecard_id:number,currency:string){
        const _response = await this.request.put(`${base_url}/api/v2/go2network?id=RQ${request_uid}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data: {
                request_uid:`${request_uid}`,
                unit_type_lookup:`${unit_type_lookup}`,
                kitchen_type:`${kitchen_type}`,
                hours_to_deadline:`${hours_to_deadline}`,
                disability_access: disability_access,
                pet_number:pet_number,
                maid_service:`${maid_service}`,
                parking_spaces:parking_spaces,
                smoking_unit:smoking_unit,
                wd:`${wd}`,
                maid:[],
                ratecard_id:ratecard_id,
                currency: `${currency}`
                
            }
        });
        //console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async corProperties(base_url: string, token:string, request_uid:string){
        const _response = await this.request.post(`${base_url}/api/v2/corpproperties?request_uid=RQ${request_uid}&currency=USD`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data: {
                request_uid:`RQ${request_uid}`
                               
            }
        });
        // console.info(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async propertyDetails(base_url: string, token:string, reference:string){
        const _response = await this.request.get(`${base_url}/api/v2/property_details?reference=${reference}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        // console.info(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async acceptTermsOfReservation(base_url: string, token:string, request_uid:string, option_id:string){
        const _response = await this.request.post(`${base_url}/api/v2/acceptTermsOfReservation?id=${request_uid}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data:{
                "optionId":`${option_id}`,
                "action":"AWARD"
            }

        });
        //console.info(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }


    async book(base_url: string, token:string, rate_token:string, payment_token:string){
        const _response = await this.request.post(`${base_url}/api/v2/book`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data:{
                "rate_token":`${rate_token}`,
                "payment_token":`${payment_token}`,
                "secondary_payment_token":"",
                "rooms_requested":[],
                "rooms_details":[
                    {
                        "firstName":"John",
                        "lastName":"doe"
                    }
                ],
                "wbs_element":"",
                "internal_id":"",
                "background_check":""
            }

        });
        // console.info(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

}