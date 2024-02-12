import { expect } from "@playwright/test";


export default class GroupEndpoint {

    readonly request;

    constructor(request){
        this.request = request;
    }

    async createGroup( base_url: string, token:string, group_name:string){
        const _response = await this.request.post(`${base_url}/api/v1/groups`, {
            headers:{
                'Authorization':`Bearer ${token}`
            },
            data: {
                "name": `${group_name}`,
                "excludeFromSharing": false
              }  
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(201);
        const body = await _response.text();
        return body;
    }

    async deleteGroup( base_url: string, token:string, group_id:string){
        const _response = await this.request.post(`${base_url}/api/v1/groups/${group_id}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async getGroupById( base_url: string, token:string, group_id:string){
        const _response = await this.request.get(`${base_url}/api/v1/groups/${group_id}`, {
            headers:{
                'Authorization':`Bearer ${token}`
            } 
        });
        console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }

    async getGroupByName( base_url: string, token:string, group_name:string){
        const _response = await this.request.get(`${base_url}/api/v1/groups?name=${group_name}`, {
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