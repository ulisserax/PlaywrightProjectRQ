import Database from "@lib/Database";
import ENV from "@utils/env";
import test from '@lib/BaseTest';
import csvToJson from "convert-csv-to-json";
const Chance = require("chance");
const chance = new Chance();
const moment = require("moment");

test.only("Test case for test purpose", async ({authEndpoint, groupEndpoint,roleEndpoint, userEndpoint})=> {

  
  const sisense = "https://reloquest-dev.sisense.com";
  const user = "cloud-dev@reloquest.com";
  const password = "*0EppILPv9h@Uk^2";
  let token;

  let json = csvToJson.fieldDelimiter(',').supportQuotedField(true).getJsonFromCsv("data_subscription.csv");

  const _res = await authEndpoint.login(sisense, user, password);
  const _response = JSON.parse(_res);
  console.log(_response);
  token = _response.access_token;
  console.log(token);

    for(let i=0; i<json.length;i++){

      // console.log(json[i].group_name);
      const get_group_resp = await groupEndpoint.getGroupByName(sisense, token, json[i].group_name);
      const get_group_response = JSON.parse(get_group_resp);
      //console.log(get_group_response);
      let group_id;
      if (get_group_response.length==0){
        const group_create_resp = await groupEndpoint.createGroup(sisense, token, json[i].group_name);
        //console.log(group_create_resp)
        const group_create_response = JSON.parse(group_create_resp);
        console.log(`this is ${group_create_resp[0]._id}`)
      }else{
        group_id = get_group_response[0]._id;
        console.log(`the group_id ${group_id}`);
      }

      console.log(`email --  ${json[i].user_email}`);

      //viewer == consumer
      let role_response = await roleEndpoint.getRole(sisense, token , "consumer");
      const role_resp = JSON.parse(role_response);
      console.log(role_resp._id);
      //await userEndpoint.createUser(sisense, token, json[i].user_email, json[i].username, json[i].firstname, json[i].lastname,role_resp._id, group_id) 

      let get_users_response = await userEndpoint.getUserByEmailAndGroupId(sisense, token, json[i].user_email, group_id);
      const get_users_resp  = JSON.parse(get_users_response);
      console.log(`get_group_response -- ${get_users_resp}`)

    }

    // ENV.API_RESERVATION_UID = 'RQR30834E';
    // ENV.SUPPLIER_FOR_RQPRO_API_KEY = "nt1sup_admin_api_key";
    // ENV.SUPPLIER_DOMAIN = "https://supstage.reloquest.com";

    // let date = moment().add(-5,"day").format("YYYY-MM-DD")
    //         let body = `{
    //             "actual_arrival_date": "2023-10-10T00:00:00+0000",
    //          }`
    //         // let reservation_query = `UPDATE smart_reservation set actual_arrival_date = "${date}" WHERE uid = '${uid}';`;
    //         //await Database.execute('Set reservation 5 days in the past',reservation_query);
    //         await reservationEndpoints.updateReservation(`${ENV.SUPPLIER_DOMAIN}`,ENV.SUPPLIER_FOR_RQPRO_API_KEY, ENV.API_RESERVATION_UID, body);

    // let query = `SELECT sta.option_permissions , sta.understand_guest_can_award_checkbox, sips.data FROM smart_token_auth sta inner join smart_inline_permission_set sips on sta.permission_set_id = sips.id and sta.email = 'lucas_5881@nt1req.com'`
    // const result =  await Database.execute('Testing query test case',query);
    // console.log(result);


    // let data_object     = JSON.parse(ENV.NT4_PREFERENCE_DATA_OBJECT);
    //     let company_query   = `UPDATE smart_company SET enable_management_services = ${1}, enable_eb2e = ${1}, enable_guest_share_version_2 = ${1}, enabled_guest_pay = ${0}, guest_pay_collect_cc = ${0}, can_view_advanced_permissions_when_sharing = "ROLE_SUPER_ADMIN" WHERE id  = ${data_object.req_company_id}`;

    //     console.log(company_query)
    //     // let client_query_1  = `UPDATE smart_client SET enable_eb2e = ${1}  WHERE id  = ${data_object.client_id}`;
    //     // let client_query_2  = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = ${data_object.client_id} SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',${false}), perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',${true})`;

    //     await Database.execute('Set rqpro=on, eb2e=on, guest_share_version_2=on,  guest_pay=off, guest_pay_collect_cc=off and advanced_sharing_settings = not visible on the company',company_query);


    // let data_object     = JSON.parse(ENV.NT5_PREFERENCE_DATA_OBJECT);
    // console.log(data_object.second_property_id);

    // let data_object     = JSON.parse(ENV.NT5_PREFERENCE_DATA_OBJECT);
    // const _createRequestResponse = await requestEndpoints.createRequest(ENV.BASE_URL, `${data_object.requestor_api_key}`, data_object.client_id, 'Miami, FL, USA', ENV.START_DATE, ENV.END_DATE, ENV.GUEST_FIRSTNAME, ENV.GUEST_LASTNAME, data_object.guest_email, `7863256523`);
    //     ENV.REQUEST_ID = `${JSON.parse(_createRequestResponse).request_id}`;
    
    //     console.info(`Submitting an Option to the request ${ENV.REQUEST_ID} through the V1 API.`);
    //     const _res = await optionEndpoints.optionCreateFull(ENV.BASE_URL, `${data_object.supplier_api_key}`, `${data_object.supplier_user}@${data_object.sup_company_name}.com`, ENV.REQUEST_ID, data_object.property_id, ENV.START_DATE, ENV.END_DATE, ENV.RATE_FEE_TYPE['Day'],1,1,2,chance.integer({min:100, max:350}),"FLAT",chance.integer({min:100, max:250}),chance.integer({min:50, max:300}),chance.integer({min:50, max:200}),chance.integer({min:10, max:300}),chance.integer({min:50, max:250}));
    //     const _response = JSON.parse(_res);
    //     console.log(_response);
        //await expect(_response.submitted).toEqual(true);

        // let client_query_2 = `UPDATE smart_inline_permission_set perm INNER JOIN smart_inline_permission_template permTmpl ON perm.id = permTmpl.permission_set_id AND permTmpl.name = 'share_profile_guest' INNER JOIN smart_client_inline_permission_template clientPermTmplRel ON permTmpl.id = clientPermTmplRel.inline_permission_template_id INNER JOIN smart_client c ON c.id = clientPermTmplRel.client_id AND c.id = 4005 SET perm.data = JSON_SET(perm.data, '$.EXTENDED_PERMISSIONS_AWARD_OPTION.granted',true, '$.EXTENDED_PERMISSIONS_SELECT_OPTION_PREFERENCES.granted',true, '$.EXTENDED_PERMISSIONS_SELECT_ADVANCED_OPTION_PREFERENCES.granted',true)`;

        // await Database.execute('Set guest_can_award=on and guest_can_select_preferences=on on the client',client_query_2);
})