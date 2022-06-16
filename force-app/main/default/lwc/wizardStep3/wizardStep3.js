import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WizardStep3 extends LightningElement {
    @api filterId;

    handleSuccess(event) {
        const filId = event.detail.id;
        this.toastEventFire('Success','New Advanced Filter Setup is Saved','success');
        this.dispatchEvent(new CustomEvent('next', {detail: filId}));
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