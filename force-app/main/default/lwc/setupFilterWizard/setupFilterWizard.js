import { LightningElement, api } from 'lwc';
import createCustomFilter from '@salesforce/apex/SetupFilterController.createCustomFilter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CUSTOM_FILTER_OBJECT from '@salesforce/schema/CustomFilter__c';

export default class SetupFilterWizard extends LightningElement {
    steps = [{label: "Choose Object API Name", value: "1"}, {label: "Filters setup", value: "2"}, {label: "Display information", value: "3"}];
    current = "1";
    currentIndex = 0;
    objectApiName;

    customFilter = CUSTOM_FILTER_OBJECT;

    get step1() {
        return this.current == this.steps[0].value;
    }

    get step2() {
        return this.current == this.steps[1].value;
    }

    get step3() {
        return this.current == this.steps[2].value;
    }

    handleNext(event) {

        if(this.currentIndex + 1 == this.steps.length) {
            this.toastEventFire('Success','Custom Filter Record is Saved','success');
            this.currentIndex = 0;
            this.current = this.steps[this.currentIndex].value;
        } else {
            this.currentIndex++;
            this.current = this.steps[this.currentIndex].value;
        }
        
    }

    handleObjectApiNameSelection(event){
        this.customFilter.ObjectApiName__c = event.detail;
        this.objectApiName =  this.customFilter.ObjectApiName__c ;
    }

    handleFilterSetup(event){
        this.customFilter.InitialFilterCondition__c = event.detail.InitialFilterCondition__c;
        this.customFilter.FilteringFields__c = event.detail.FilteringFields__c;
        this.handleNext(event);
    }

    handleDisplayInfo(event){
        this.customFilter.DisplayedColumns__c = event.detail.displayedColumns;
        this.customFilter.Color__c = event.detail.color;
        this.customFilter.Font__c = event.detail.font;

        createCustomFilter({ customFilter : this.customFilter})
        .then(result =>{
            this.toastEventFire('Success','Custom Filter Record is Saved','success');
            this.handleNext(event);
        })
        .catch(error =>{
            this.error = error;
        }) 
    }

    toastEventFire(title,msg,variant,mode){
        const e = new ShowToastEvent({
            title: title,
            message: msg,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(e);
    } 

}