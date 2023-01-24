export default class Text{
    static customize_housing_options = `div.options-header-text`;
    static property_name             = `div.property-details-section span.property-label`;
    static proeprty_address          = `div.property-details-section div.text-location-name`;
    static request_sent              = `//modal-container[@class='modal fade in']//h5[contains(text(),'Request Sent!')]`; 
    static requested                 = `//div[contains(@class,'parent-detail-option')]//div[contains(text(),'REQUESTED')]`;
    static pending_quest             = `div.hero-head span:has-text('pending Quest')`;
    static booking_id                = `//div[contains(text(), 'Booking #')]`;
}