export default class Text{
    static customize_housing_options = `div.options-header-text`;
    static property_name             = `div.property-details-section span.property-label`;
    static property_address          = `div.property-details-section div.text-location-name`;
    static request_sent              = `//modal-container[@class='modal fade in']//h5[contains(text(),'Request Sent!')]`; 
    static requested                 = `//div[contains(@class,'parent-detail-option')]//div[contains(text(),'REQUESTED')]`;
    static pending_quest             = `//div[contains(@class,'hero-head')]//*[contains(text(),'pending')]`;
    static future_quest              = `//div[contains(@class,'hero-head')]//*[contains(text(),'future')]`;
    static booking_id                = `//div[contains(text(), 'Booking #')]`;
    static payment_updated           = `h5:has-text('Payment Method updated!')`;
    static current_card              = `span.card-label`;
    static canceled_quest            = `//*[contains(text(),'canceled')]`;
    static issue_description         = `//textarea[@formcontrolname='description']`;
    static cancellation_in_progress  = `//div[contains(@class,'pending')]//span[contains(text(),'Cancellation in Progress')]`;
    static review_and_select_an_option = `//app-modal[@header='Here are your Options!']//h2[contains(text(),'Review and Select an Option')]`;
    static first_choice_preference     = `//ng-select[contains(@class,'selected-option')]//span[contains(text(),'1st choice')]`;
    static cardOptionBooked            = `//app-option-card//div[contains(@class,'booked')][contains(normalize-space(),'Booked')]`;

    
    static appModalHeader(text: string){
        return `//div[contains(@class,'modal-header')]/h5[contains(text(),'${text}')]`;
    }

    static cardOptionPreference(preference:string){
        return `//app-option-card//div[contains(@class,'choice')][contains(text(),'${preference}')]`;
    }

    static sortBy(by: string){
        return `//div[contains(text(),'${by}')]`;
    }

    static questDetails(text: string){
        return `//div[@id='quest-details-component']//*[contains(text(),'${text}')]`;
    }

    static guest_responsability_property(property_name:string){
        return `//app-modal[@header='Guest Responsibility']//app-guest-responsible//div[contains(@class,'guest-reversed')]//p[contains(text(),'${property_name}')]`;
    }

    static guest_responsability_property_choice(property_name:string){
        return `//app-modal[@header='Guest Responsibility']//app-guest-responsible//div[contains(@class,'guest-reversed')]//p[contains(text(),'${property_name}')]/parent::div/following-sibling::div//div[contains(@class,'guest __choice')]`;
    }

    static select_option(option_id:number){
        return `//a[contains(@href,'/b2e/options/${option_id}')]/ancestor::td/preceding-sibling::td//*[contains(@class,'custom-select')]`
    }

    static set_option_preference(option_id:number, preference:string){
        return `//a[contains(@href,'/b2e/options/${option_id}')]/ancestor::td/preceding-sibling::td//*[contains(@class,'custom-select')]]//span[contains(text(),'${preference}')]`
    }

}