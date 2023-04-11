
export default class Textarea{
    static describe_issue            = `#form_description`;
    static new_comment               = `textarea[name='comment']`;
    static hotel_special_information = `#form_hotel_special_information`;
    static pet_restictions           = `#form_pet_policy`;
    static property_description      = `//div[@id='form[description]']/p`;
    static property_features         = `//div[@id='form[features]']/p`;
    static property_amenities        = `//div[@id='form[amenities]']/p`;
    static reason_for_decline        = `//div[@id='ntv-approve-deny-modal-supplier' and contains(@class, 'fade in')]//textarea`;
    
}