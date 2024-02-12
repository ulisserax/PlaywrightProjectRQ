import { expect } from "@playwright/test";

export default class UserEndpoint {

    readonly request;

    constructor(request){
        this.request = request;
    }

    async createUser( base_url: string, token:string, email:string, username:string, firstname:number, lastname:string, role_id:string, group_id:string){
        const _response = await this.request.post(`${base_url}/api/v1/users`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data: {
                "email": `${email}`,
                "userName": `${username}`,
                "firstName": `${firstname}`,
                "lastName": `${lastname}`,
                "roleId": `${role_id}`,
                "groups": [
                  `${group_id}`
                ],
                "preferences": {
                },
                "uiSettings": {}
              }   
        });
        //console.log(await _response.text());
        await expect(_response.status()).toBe(201);
        const body = await _response.text();
        return body;
    }

    async deleteUser( base_url: string, token:string, user_id:string){
        const _response = await this.request.post(`${base_url}/api/v1/users/${user_id}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async getUserByEmailAndGroupId( base_url: string, token:string, email:string, group_id:string){
        const _response = await this.request.get(`${base_url}/api/v1/users?email=${email}&groupId=${group_id}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        //console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }
}