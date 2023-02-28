import { expect } from "@playwright/test";
import ENV from "@utils/env";
const Chance = require("chance");
const chance = new Chance();

export default class Stripe {

    readonly request;

    constructor(request){
        this.request = request;
    }


    async stripeToken(card_number: string, card_month:string, card_year:string, card_cvc:string, key:string, card_zip_code:string, guid:string, muid:string, payment_user_agent:string, sid:string){
        const _response = await this.request.post(`https://api.stripe.com/v1/tokens`, {
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data:
                `card[number]=${card_number}&card[cvc]=${card_cvc}&card[exp_month]=${card_month}&card[exp_year]=${card_year}&card[address_zip]=${card_zip_code}&guid=${guid}&muid=${muid}&sid=${sid}&payment_user_agent=${payment_user_agent}&key=${key}`
            
            
                            
        });
        //console.log(await _response.text());
        await expect(_response.status()).toBe(200);
        const body = await _response.text();
        return body;
    }
}