import { expect } from "@playwright/test";

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
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }
}