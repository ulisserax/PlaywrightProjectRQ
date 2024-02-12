import { expect } from "@playwright/test";


export default class RoleEndpoint {

    readonly request;

    constructor(request){
        this.request = request;
    }

    async getRole( base_url: string, token:string, role:string,){
        const _response = await this.request.get(`${base_url}/api/roles/${role}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }  
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

}