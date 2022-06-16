import { LightningElement } from 'lwc';

export default class WizardStep1 extends LightningElement {
    
    handleSuccess(event) {
        const filId = event.detail.id;
        this.dispatchEvent(new CustomEvent('next', {detail: filId}));
    }

}