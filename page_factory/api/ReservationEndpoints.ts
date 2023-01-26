import { expect } from "@playwright/test";
import ENV from "@utils/env";

export default class ReservationEndpoints {

    readonly request;

    constructor(request){
        this.request = request;
    }


    async getReservationByUid(api_key:string, uid:string){
        const _response = await this.request.get(`${ENV.BASE_URL}/api/v1/reservations/${uid}?apikey=${api_key}`);
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async updateReservation(api_key:string, uid:string){
        const _response = await this.request.patch(`${ENV.BASE_URL}/api/v1/reservation/update/${uid}?apikey=${api_key}`, {
            data: {
              body: 'Bug description',
            }
          });
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }
}