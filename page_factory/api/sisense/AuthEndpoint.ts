import { expect } from "@playwright/test";

export default class AuthEndpoint {

    readonly request;

    constructor(request){
        this.request = request;
    }

    async login( base_url: string, username:string, password:string,){
        const _response = await this.request.post(`${base_url}/api/v1/authentication/login`, {
            headers:{
                'Content-Type':`application/x-www-form-urlencoded`,
                // 'username':`${username}`,
                // 'password':`${password}`
            },
            form: {
                username: `${username}`,
                password: `${password}`
              }   
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

}