import { expect } from "@playwright/test";
import ENV from "@utils/env";
const Chance = require("chance");
const chance = new Chance();

export default class OptionEndpoints {

    readonly request;

    constructor(request){
        this.request = request;
    }

    async optionCreate( base_url: string, api_key:string, supplier_email:string, request_id:string, property_id:number, start_date:string, end_date:string, rate_type:string){
        const _response = await this.request.post(`${base_url}/api/v1/option/create/${request_id}?apikey=${api_key}`, {
            data: {
                    "property": property_id,
                    "notification_email": "DEFAULT_NOTIFICATION_EMAIL",
                    "amenities": "Testing the AMENITIES field",
                    "available_date": start_date,
                    "unavailable_date": end_date,
                    "oscar_unit_id": null,
                    "core_inventory": null,
                    "sub_supplier_name": null,
                    "description": "Testing the DESCRIPTION field",
                    "unit_type_lookup": "1",
                    "kitchen_type": 2,
                    "bathrooms": "2.0",
                    "bedrooms": "2",
                    "currency": "USD",
                    "confidential_comment": "Testing the CONFIDENTIAL COMMENTS field",
                    "comment": "Testing the COMMENTS FOR GUEST field",
                    "discount": null,
                    "features": "Testing the FEATURES field",
                    "hold": 0,
                    "customer_service_phone_24h": 123,
                    "service_issue_email": supplier_email,
                    "service_issue_phone": 7862563652,
                    "escalation_name": "Name",
                    "escalation_email": supplier_email,
                    "escalation_phone": 7862563652,
                    "internet": 1,
                    "maid_service": 3,
                    "parking": 0,
                    "parking_spaces": 0,
                    "parking_types": [
                        
                    ],
                    "minimum_stay": 1,
                    "notice": 1,
                    "require_ntv":1,
                    "rate_type": `${rate_type}`,
                    "other_charges": null,
                    "smoking_unit": 0,
                    "square_foot": 1250,
                    "floors": null,
                    "style": "A+",
                    "washer_dish": "3",
                    "utility_cap": "Utility Cap",
                    "airConditioning": null,
                    "pets_allowed": "NO",
                    "pet_policy": null,
                    "background_checks_required": 1,
                    "vat_details": "VAT-000",
                    "rentersInsurance": 1,
                    "overviewPath": null,
                    "cancellation_policy_confirmed": true,
                    "cancellation_policy_data": {
                        "policy_confirmed": 1,
                        "pre_move_in": {
                            "monthly_reservationn": {
                                "days_min": 0,
                                "days_max": 0,
                                "refund_percent": 0,
                                "reminder_refund_percent": 0
                            },
                            "weekly_reservationn": {
                                "days_min": 0,
                                "days_max": 0,
                                "refund_percent": 0,
                                "reminder_refund_percent": 10
                            },
                            "daily_reservation": {
                                "days_min": 20,
                                "full_refund": true,
                                "days_max": 26,
                                "refund_percent": 40.9,
                                "reminder_refund_percent": 78.4
                            }
                        },
                        "post_move_in": "Post Move In cancellation policies test"
                    },
                    "disability_access": "0",
                    "additional_fee": null,
                    "occupancy_fee": null,
                    "tax": "000",
                    "units_available": null,
                    "dean_fee": 0,
                    "rate_segments": [
                        {
                            "start_date": start_date,
                            "rate": chance.integer({min:80, max:550}),
                            "end_date": end_date
                        }
                    ],
                    "fee_segments": [
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": chance.integer({min:100, max:1000}),
                            "fee_description":"maid service",
                            "fee_type": 10
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": chance.integer({min:100, max:1000}),
                            "fee_description":"property fee",
                            "fee_type": 6
                        }
                    ]
                }      
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async optionAward( base_url: string, api_key:string, option_id:string){
        const _response = await this.request.post(`${base_url}/api/v1/option/${option_id}/award?apikey=${api_key}`, {
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async optionCreateNoParkingNoFeesNoTaxesNoMaidServices( base_url: string, api_key:string, supplier_email:string, request_id:string, property_id:number, start_date:string, end_date:string, rate_type:string){
        const _response = await this.request.post(`${base_url}/api/v1/option/create/${request_id}?apikey=${api_key}`, {
            data: {
                    "property": property_id,
                    "notification_email": "DEFAULT_NOTIFICATION_EMAIL",
                    "amenities": "Testing the AMENITIES field",
                    "available_date": start_date,
                    "unavailable_date": end_date,
                    "oscar_unit_id": null,
                    "core_inventory": null,
                    "sub_supplier_name": null,
                    "description": "Testing the DESCRIPTION field",
                    "unit_type_lookup": "1",
                    "kitchen_type": 2,
                    "bathrooms": "2.0",
                    "bedrooms": "2",
                    "currency": "USD",
                    "confidential_comment": "Testing the CONFIDENTIAL COMMENTS field",
                    "comment": "Testing the COMMENTS FOR GUEST field",
                    "discount": null,
                    "features": "Testing the FEATURES field",
                    "hold": 0,
                    "customer_service_phone_24h": 123,
                    "service_issue_email": supplier_email,
                    "service_issue_phone": 7862563652,
                    "escalation_name": "Name",
                    "escalation_email": supplier_email,
                    "escalation_phone": 7862563652,
                    "internet": 1,
                    "maid_service": 1,
                    "parking": 0,
                    "parking_spaces": 0,
                    "minimum_stay": 1,
                    "notice": 1,
                    "require_ntv":1,
                    "rate_type": `${rate_type}`,
                    "other_charges": null,
                    "smoking_unit": 0,
                    "square_foot": 1250,
                    "floors": null,
                    "style": "A+",
                    "washer_dish": "3",
                    "utility_cap": "Utility Cap",
                    "airConditioning": null,
                    "pets_allowed": "NO",
                    "pet_policy": null,
                    "background_checks_required": 1,
                    "vat_details": "VAT-000",
                    "rentersInsurance": 1,
                    "overviewPath": null,
                    "cancellation_policy_confirmed": true,
                    "cancellation_policy_data": {
                        "policy_confirmed": 1,
                        "pre_move_in": {
                            "monthly_reservationn": {
                                "days_min": 0,
                                "days_max": 0,
                                "refund_percent": 0,
                                "reminder_refund_percent": 0
                            },
                            "weekly_reservationn": {
                                "days_min": 0,
                                "days_max": 0,
                                "refund_percent": 0,
                                "reminder_refund_percent": 10
                            },
                            "daily_reservation": {
                                "days_min": 20,
                                "full_refund": true,
                                "days_max": 26,
                                "refund_percent": 40.9,
                                "reminder_refund_percent": 78.4
                            }
                        },
                        "post_move_in": "Post Move In cancellation policies test"
                    },
                    "disability_access": "0",
                    "additional_fee": null,
                    "occupancy_fee": null,
                    "tax": "000",
                    "units_available": null,
                    "dean_fee": 0,
                    "rate_segments": [
                        {
                            "start_date": start_date,
                            "rate": chance.integer({min:80, max:550}),
                            "end_date": end_date
                        }
                    ]
                }      
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async optionCreateFull( base_url: string, api_key:string, supplier_email:string, request_id:string, property_id:number, start_date:string, end_date:string, rate_type:string, maid_service:number, parking:number, parking_type:number, parking_amount:number, parking_calculation_method:string, pet_fee_amount: number, application_fee_amount:number, redecoration_fee_amount:number, pet_deposit_amount:number, security_deposit_amount:number){
        const _response = await this.request.post(`${base_url}/api/v1/option/create/${request_id}?apikey=${api_key}`, {
            data: {
                    "property": property_id,
                    "notification_email": "DEFAULT_NOTIFICATION_EMAIL",
                    "amenities": "Testing the AMENITIES field",
                    "available_date": start_date,
                    "unavailable_date": end_date,
                    "oscar_unit_id": null,
                    "core_inventory": null,
                    "sub_supplier_name": null,
                    "description": "Testing the DESCRIPTION field",
                    "unit_type_lookup": "1",
                    "kitchen_type": 2,
                    "bathrooms": "2.0",
                    "bedrooms": "2",
                    "currency": "USD",
                    "confidential_comment": "Testing the CONFIDENTIAL COMMENTS field",
                    "comment": "Testing the COMMENTS FOR GUEST field",
                    "discount": null,
                    "features": "Testing the FEATURES field",
                    "hold": 0,
                    "customer_service_phone_24h": 123,
                    "service_issue_email": supplier_email,
                    "service_issue_phone": 7862563652,
                    "escalation_name": "Name",
                    "escalation_email": supplier_email,
                    "escalation_phone": 7862563652,
                    "internet": 1,
                    "maid_service": maid_service,
                    "parking": parking,
                    "parking_spaces": 1,
                    "parking_types": [
                        {
                            "type_of_parking": parking_type,
                            "start_date": start_date,
                            "fee_basis_amount": parking_amount,
                            "end_date": end_date,
                            "calculation_method": `${parking_calculation_method}`
                        }
                    ],
                    "minimum_stay": 1,
                    "notice": 1,
                    "require_ntv":1,
                    "rate_type": `${rate_type}`,
                    "other_charges": null,
                    "smoking_unit": 0,
                    "square_foot": 1250,
                    "floors": null,
                    "style": "A+",
                    "washer_dish": "3",
                    "utility_cap": "Utility Cap",
                    "airConditioning": null,
                    "pets_allowed": "NO",
                    "pet_policy": null,
                    "background_checks_required": 1,
                    "vat_details": "VAT-000",
                    "rentersInsurance": 1,
                    "overviewPath": null,
                    "cancellation_policy_confirmed": true,
                    "cancellation_policy_data": {
                        "policy_confirmed": 1,
                        "pre_move_in": {
                            "monthly_reservationn": {
                                "days_min": 0,
                                "days_max": 0,
                                "refund_percent": 0,
                                "reminder_refund_percent": 0
                            },
                            "weekly_reservationn": {
                                "days_min": 0,
                                "days_max": 0,
                                "refund_percent": 0,
                                "reminder_refund_percent": 10
                            },
                            "daily_reservation": {
                                "days_min": 20,
                                "full_refund": true,
                                "days_max": 26,
                                "refund_percent": 40.9,
                                "reminder_refund_percent": 78.4
                            }
                        },
                        "post_move_in": "Post Move In cancellation policies test"
                    },
                    "disability_access": "0",
                    "additional_fee": null,
                    "occupancy_fee": null,
                    "tax": "000",
                    "units_available": null,
                    "rate_segments": [
                        {
                            "start_date": start_date,
                            "rate": chance.integer({min:80, max:550}),
                            "end_date": end_date
                        }
                    ],
                    "fee_segments": [
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": chance.integer({min:100, max:1000}),
                            "fee_description":"local tax",
                            "fee_type": 1
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": chance.integer({min:100, max:1000}),
                            "fee_description":"state tax",
                            "fee_type": 2
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": chance.integer({min:100, max:1000}),
                            "fee_description":"maid service",
                            "fee_type":10
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": pet_fee_amount,
                            "fee_description":"Pet Fee",
                            "fee_type":17
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": application_fee_amount,
                            "fee_description":"Application Fee",
                            "fee_type":19
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": redecoration_fee_amount,
                            "fee_description":"Redecoration Fee",
                            "fee_type":18
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": pet_deposit_amount,
                            "fee_description":"Pet Deposit",
                            "fee_type":14
                        },
                        {
                            "start_date": start_date,
                            "end_date": end_date,
                            "calculation_method": "FLAT",
                            "fee_basis_amount": security_deposit_amount,
                            "fee_description":"Security Deposit",
                            "fee_type":15
                        }
                    ]
                }      
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }
}