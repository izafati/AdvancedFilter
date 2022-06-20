import { LightningElement, api, wire, track } from 'lwc';
import getFieldsForSobject from '@salesforce/apex/SetupFilterController.getFieldsForSobject';

export default class WizardStep2 extends LightningElement {
    @api objectApiName;
    initialFilterCondition__c;
    filteringFields__c;
    filteringFields;

    handleNext(event) {
        this.filteringFields__c = this.filteringFields.join(', ');
        this.initialFilterCondition__c = this.initialFilterCondition.join(', ');
        console.log('$$$$');
        console.log(this.initialFilterCondition__c);
        let myEvent = new CustomEvent('filtersetup', { detail:
            {
                InitialFilterCondition__c : this.initialFilterCondition__c,
                FilteringFields__c : this.filteringFields__c
            } 
        });
        this.dispatchEvent(myEvent);
    }

    @wire(getFieldsForSobject, {objectApiName : '$objectApiName'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    handleInitialFiltersChange(event) {
        this.initialFilterCondition = event.detail;
        console.log(this.initialFilterCondition);
    }

    handleFilteringFieldsChange(event) {
        this.filteringFields = event.detail;
        console.log(this.filteringFields);
    }
}