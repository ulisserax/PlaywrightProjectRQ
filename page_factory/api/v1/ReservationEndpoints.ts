import { expect } from "@playwright/test";
import { APIRequestContext } from '@playwright/test';
import ENV from "@utils/env";

export default class ReservationEndpoints {

    readonly request;
    //readonly apiRequestContext ;

    constructor(request){
        this.request = request;
        
    }


    async getReservationByUid(api_key:string, uid:string){
        const _response = await this.request.get(`${ENV.BASE_URL}/api/v1/reservations/${uid}?apikey=${api_key}`);
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async updateReservation(url:string, api_key:string, uid:string, body:string){
        const _response = await this.request.patch(`${url}/api/v1/reservation/update/${uid}?apikey=${api_key}`, {
            data: JSON.parse(body)
          });
        await expect(_response.status()).toBe(200);
        const response = await _response.text();
        return response;
    }

    async getReservationsShared(api_key:string, date:string){
        const _response = await this.request.get(`${ENV.BASE_URL}/api/v1/reservations_shared?apikey=${api_key}&lease_start_date_from=${date}`);
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }
}