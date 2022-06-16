import { LightningElement } from 'lwc';

export default class SetupFilterWizard extends LightningElement {
    steps = [{label: "Choose Object API Name", value: "1"}, {label: "Filters setup", value: "2"}, {label: "Display information", value: "3"}];
    current = "1";
    currentIndex = 0;
    filterId;

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
        this.filterId = event.detail;
        if(this.currentIndex + 1 == this.steps.length) {
            console.log(this.filterId);

            this.currentIndex = 0;
            this.current = this.steps[this.currentIndex].value;
        } else {
            this.currentIndex++;
            this.current = this.steps[this.currentIndex].value;
        }
        
    }

}