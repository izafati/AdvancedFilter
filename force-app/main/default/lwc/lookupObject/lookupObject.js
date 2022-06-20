import { LightningElement, api, track, wire } from 'lwc';
import getFieldsForSobject from '@salesforce/apex/SetupFilterController.getFieldsForSobject';

export default class LookupObject extends LightningElement {
    @api customLabel;
    @api multiSelect;
    @track displayConditions = true;
    @track objectAPINames= [];

    @api objName;
    @api iconName;
    @api filter = '';
    @api searchPlaceholder='Search';

    @track selectedNames = [];
    @track records;
    @track isValueSelected;
    @track blurTimeout;

    fieldOptions = [];

    searchTerm;
    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

    handleNext(event) {
        const filId = event.detail.id;
        this.dispatchEvent(new CustomEvent('next', {detail: filId}));
    }

    handleDisplayCondition(){
        let val = this.multiSelect || (!this.multiSelect && !this.isValueSelected);
        this.displayConditions = (val === 'true');
    }
    @wire(getFieldsForSobject, {objectApiName : '$objName'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    onSelect(event) {
        let selectedField = event.currentTarget.dataset.name;
        this.fieldOptions.push(selectedField);
        this.handleDisplayCondition();
        this.isValueSelected = true;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        this.records = this.records.filter( ( el ) => !this.fieldOptions.includes( el ) );
        this.fieldOptionsChange();
    }

    handleRemovePill(event) {
        let removedName = event.currentTarget.dataset.name;
        var index = this.fieldOptions.indexOf(removedName);
        if (index !== -1) {
           this.records.push(this.fieldOptions.splice(index, 1));
            this.records.sort();
            this.isValueSelected = false;
            this.isValueSelected = true;
            this.displayConditions();
        }
        this.fieldOptionsChange();
    }

    fieldOptionsChange(){
        this.dispatchEvent(new CustomEvent('valueselected', {detail: this.fieldOptions}));
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }
}