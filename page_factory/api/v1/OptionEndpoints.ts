import { expect } from "@playwright/test";
import ENV from "@utils/env";
const Chance = require("chance");
const chance = new Chance();

export default class OptionEndpoints {

    readonly request;

    constructor(request){
        this.request = request;
    }
}