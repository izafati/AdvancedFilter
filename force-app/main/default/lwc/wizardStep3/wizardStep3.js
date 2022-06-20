import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getFieldsForSobject from '@salesforce/apex/SetupFilterController.getFieldsForSobject';

export default class WizardStep3 extends LightningElement {
    @api objectApiName;
    objectApiInfo;
    displayedColumns;
    font;
    color;

    displayedColumnsOptions = [];

    handleDisplayedColumnsChange(event) {
        this.displayedColumnsOptions = event.detail;
    }

    handleFontChange(event) {
        this.font = event.target.value;
        console.log(this.font);
    }

    handleColorChange(event) {
        this.color = event.target.value;
        console.log(this.color);
    }

    handleSave(event) {
        this.displayedColumns = this.displayedColumnsOptions.join(', ');
        let myEvent = new CustomEvent('displayinfo', { detail:
            {
                displayedColumns : this.displayedColumns,
                color : this.color,
                font : this.font
            } 
        });
        this.dispatchEvent(myEvent);
    }

}