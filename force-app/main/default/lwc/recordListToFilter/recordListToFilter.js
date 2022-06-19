import { LightningElement,api,wire,track } from 'lwc';
import populateInitialList from '@salesforce/apex/CustomFilterController.populateInitialList';





export default class RecordListToFilter extends LightningElement {

    @api objectApiName;
    @track columns = [];
    @track data = [];

    @track filteringFieldProperties = [];
   

    @wire(populateInitialList,{objectToFilter:  "$objectApiName"})
    wiredCustomFilter(result,error) {
        
        if(result.data){
            //Get table's columns
             this.columns = this.getFieldsProperties(result?.data?.displayedColumns);


            // Get data 
             this.data = result.data.prefilteredRecords;

            // Build filter
             this.filteringFieldProperties = this.getFieldsProperties(result?.data?.filteringFieldsByType);

        }

    }


    getFieldsProperties(fieldsMap){

        let fieldsProperties = [];
        if(fieldsMap){
            for(var key in fieldsMap){
                for(var value in fieldsMap[key]){
                    fieldsProperties.push({
                        'label' : fieldsMap[key][value].label,
                        'fieldName' : fieldsMap[key][value].apiName,
                        'type' : key.toLowerCase()
                    });
                }
            }
        }
        return fieldsProperties;

    }


 


}