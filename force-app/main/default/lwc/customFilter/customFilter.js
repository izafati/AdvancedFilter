import { LightningElement,api, wire,track } from 'lwc';
import populateOperatorsByFieldsType from '@salesforce/apex/CustomFilterController.populateOperatorsByFieldsType';

const LOGICAL_OPERATORS =  ['AND','OR'];
export default class CustomFilter extends LightningElement {

    displayLogicalOperators = false;
    @api objectApiName;
    @track filteringFieldProperties = [];
    @track fieldsType = [];
    operator;

    operators = [];



    @api set fieldsProperties(value) {
        this.filteringFieldProperties = value;
        this.fieldsType =  [...new Set(value.map(field => field.type))];
    }
    get fieldsProperties() {
        return this.fieldsType;
    }

 

    @wire(populateOperatorsByFieldsType,{fieldsType:'$fieldsType'})
    wiredOperators(result,error) {
      console.log('result --------->'+JSON.stringify(result));
      console.log('error --------->'+JSON.stringify(error));
      console.log(('filteringFieldProperties ----->'+JSON.stringify(this.filteringFieldProperties)));

      if(result.data){
          // if more than one filtering field logical operators are displayed
          if(this.filteringFieldProperties.length > 1){
              this.displayLogicalOperators = true;
          }


          // label - type - operators
          this.filteringFieldProperties = this.filteringFieldProperties.map(field => ({...field,
                    'label': field.label,
                    'type' : field.type,
                    'apiName' : field.fieldName,
                    'operators' : this.populateOperatorsChoices(result.data[field.type])
            }));
      }
    
    }



    populateOperatorsChoices(operators){

        return operators.map(operator => ({
          label : operator,
          value : operator
        }));
     }

   
    handleChangeOperator(event) {
      console.log('event.detail.value ******'+event.detail.value);
    }

}