export default class Text{
    static customize_housing_options = `div.options-header-text`;
    static property_name             = `div.property-details-section span.property-label`;
    static property_address          = `div.property-details-section div.text-location-name`;
    static request_sent              = `//modal-container[@class='modal fade in']//h5[contains(text(),'Request Sent!')]`; 
    static requested                 = `//div[contains(@class,'parent-detail-option')]//div[contains(text(),'REQUESTED')]`;
    static pending_quest             = `//div[contains(@class,'hero-head')]//span[contains(text(),'pending')]`;
    static future_quest              = `//div[contains(@class,'hero-head')]//span[contains(text(),'future')]`;
    static booking_id                = `//div[contains(text(), 'Booking #')]`;
    static payment_updated           = `h5:has-text('Payment Method updated!')`;
    static current_card              = `span.card-label`;
    static canceled_quest            = `//div[contains(@class,'cancelled')]//span[contains(text(),'canceled')]`;
    static cancellation_in_progress  = `//div[contains(@class,'pending')]//span[contains(text(),'Cancellation in Progress')]`;

    static sortBy(by: string){
        return `//div[contains(text(),'${by}')]`;
    }

    static questDetails(text: string){
        return `//div[@id='quest-details-component']//*[contains(text(),'${text}')]`;
    }
}