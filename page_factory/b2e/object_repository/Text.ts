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
    static review_and_select_an_option    = `//app-modal[@header='Here are your Options!']//h2[contains(text(),'Review and Select an Option')]`;
    static first_choice_preference        = `//ng-select[contains(@class,'selected-option')]//span[contains(text(),'1st choice')]`;
    //static card_option_booked             = `//app-option-card//div[contains(@class,'booked')][contains(normalize-space(),'Booked')]`;
    static guest_responsability_subheader = `//app-guest-responsible//p[contains(@class,'c-orange') and contains(text(),'Please Review the Fees and Deposits')]`;
    static guest_responsability_text      = `//app-guest-responsible//p[contains(text(),'The selected options may contain fees and deposits that you will')]`;
    static guest_fee_and_deposit_total    = `//app-guest-responsible//div[contains(@class,' summary-underline')]//p`;
    static option_confirmation_title      = `//app-option-confirmation//h2[contains(text(),'Provide payment method')]`;
    static guest_total                    = `//div[contains(text(),'Total')]/following-sibling::div//div[contains(text(),'$')]`;
    static option_charges_confirmed       = `//app-option-confirmation//app-future-payments//span[contains(text(),'When booking is confirmed')]`;
        
    static appModalHeader(text: string){
        return `//div[contains(@class,'modal-header')]/h5[contains(text(),'${text}')]`;
    }

    static cardOptionPreference(property_name:string,preference:string){
        return `//app-option-card//div[contains(text(),'${property_name}')]/parent::div/following-sibling::div//div[contains(@class,'choice')][contains(text(),'${preference}')]`;
    }

    static sortBy(by: string){
        return `//div[contains(text(),'${by}')]`;
    }

    static questDetails(text: string){
        return `//div[@id='quest-details-component']//*[contains(text(),'${text}')]`;
    }

    static guestResponsabilityProperty(property_name:string){
        return `//app-modal[@header='Guest Responsibility']//app-guest-responsible//div[contains(@class,'guest-reversed')]//p[contains(text(),'${property_name}')]`;
    }

    static guestResponsabilityPropertyChoice(property_name:string){
        return `//app-modal[@header='Guest Responsibility']//app-guest-responsible//div[contains(@class,'guest-reversed')]//p[contains(text(),'${property_name}')]/parent::div/following-sibling::div//div[contains(@class,'guest __choice')]`;
    }

    static selectOption(option_id:number){
        return `//a[contains(@href,'/b2e/options/${option_id}')]/ancestor::td/preceding-sibling::td//*[contains(@class,'custom-select')]`
    }

    static setOptionPreference(option_id:number, preference:string){
        return `//a[contains(@href,'/b2e/options/${option_id}')]/ancestor::td/preceding-sibling::td//*[contains(@class,'custom-select')]//span[contains(text(),'${preference}')]`;
    }

    static guestResponsabilityChoice(property_name:string, preference: string){
        return `//app-guest-responsible//p[contains(text(),'${property_name}')]/parent::div/following-sibling::div//div[contains(text(),'${preference}')]`;
    }

    static propertySelected(property_name:string){
        return `//app-guest-responsible//p[contains(text(),'${property_name}')]`;
    }

    static paidByGuestFeesAndDeposit(fees_and_deposit: string){
        return `//app-guest-responsible//p[contains(text(),'${fees_and_deposit}')]/parent::div/following-sibling::div/p`;
    }

    static paidByCompanyFeesAndDeposit(fees_and_deposit: string){
        return `//app-guest-responsible//p[contains(text(),'${fees_and_deposit}')]`;
    }

    static selectedProperty(property_name:string){
        return  `//app-set-preference//span[contains(text(),'You have selected:')]/span[contains(text(),'${property_name}')]`;
    }

    static cardOptionBooked(property_name:string){
        return `//app-option-card//div[contains(text(),'${property_name}')]/parent::div/following-sibling::div//div[contains(@class,'booked')][contains(normalize-space(),'Booked')]`;
        //app-option-card//div[contains(@class,'booked')][contains(normalize-space(),'Booked')]
    }

    static questDetailsPropertyName(property_name:string){
        return `//app-quest-detail//h1[contains(text(),'${property_name}')]`;
    }

    static otherChoiceInGuestResponsability(preference:string){
        return `//app-guest-responsible//div[contains(text(),'${preference}')]/parent::div/parent::div/preceding-sibling::div/p[contains(text(),'$0.00')]`;
    }

    static guestChargesFeesAndDeposit(fees_and_deposit: string){
        return `//div[@id='panel-charges']//span[contains(text(),'${fees_and_deposit}')]/parent::div/following-sibling::div/span`;
    }

    static propertyNameConfirmation(property_name: string){
        return `//app-option-confirmation//div[contains(text(),'${property_name}')]`;
    }

    static choicePreference(preference:string){
        return `//app-select//span[contains(text(),'${preference}')]`
    } 

}