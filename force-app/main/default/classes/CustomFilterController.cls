public with sharing class CustomFilterController {


      private static final Map<String, String> DEFAULT_OPERATIONS_SYMBOL_MAPPING = new Map<String,String>{
                                    'equals' => '=',
                                    'does not equal' => '!=',
                                    'start with' => '%',
                                    'ends with' => '%',
                                    'is null' => '= null',
                                    'contains' => 'LIKE',
                                    'greater than' => '>',
                                    'less than' => '<',
                                    'greater than or equal' => '>=',
                                    'less than or equal' => '<='
    };

    public static final List<String> LOGIC_SYMBOL =  new List<String>{ 'OR', 'AND'};


    @AuraEnabled(Cacheable = true)
    public static CustomFilterWrapper populateInitialList(String objectToFilter){

          String queryCustomFilter = 'Select DisplayedColumns__c,FilteringFields__c,Font__c,Color__c,InitialFilterCondition__c,ObjectApiName__c from CustomFilter__c where ObjectApiName__c = ';
          List<CustomFilter__c> customFilter = Database.query(queryCustomFilter + '\'' + String.escapeSingleQuotes(objectToFilter) + '\'');
   

          CustomFilterWrapper customFilterWrapper = new CustomFilterWrapper();
          customFilterWrapper.displayedColumns =  populateFilteringFieldsByType((customFilter.get(0).DisplayedColumns__c).split(','),objectToFilter);
          customFilterWrapper.fontColor = customFilter.get(0).Color__c;
          customFilterWrapper.fontStyle =  customFilter.get(0).Font__c;
          customFilterWrapper.initialFilterCond = customFilter.get(0).InitialFilterCondition__c;
          customFilterWrapper.filteringFieldsByType = populateFilteringFieldsByType((customFilter.get(0).FilteringFields__c).split(','),objectToFilter);
      

          if(!customFilterWrapper.displayedColumns.isEmpty() && !String.isBlank(customFilterWrapper.initialFilterCond)){
                String filterRecordByInitialCond = 'Select id, '+ customFilter.get(0).DisplayedColumns__c+' from '+objectToFilter+' where '+customFilter.get(0).InitialFilterCondition__c;
                customFilterWrapper.prefilteredRecords = Database.query(filterRecordByInitialCond);
          }

         

          return customFilterWrapper;

    }

       public static Map<String,List<FieldWrapper>> populateFilteringFieldsByType(List<String> filteringFieldsByType,String objectApiName){

            SObjectType sObjectType = ((SObject)(Type.forName('Schema.'+objectApiName).newInstance())).getSObjectType();
            DescribeSObjectResult describeSObjectResult = sObjectType.getDescribe();

            Map<String,List<FieldWrapper>> filteringFieldsByTypeMap = new Map<String,List<FieldWrapper>>();
            String  fieldType;
            // limit : 100  such describes per session
            for(String fieldName :  filteringFieldsByType){
                  Schema.DescribeFieldResult describeObj = describeSObjectResult.fields.getMap().get(fieldName).getDescribe();
                  fieldType = String.valueOf(describeObj.getType());
                  FieldWrapper field = new FieldWrapper(fieldName,String.valueOf(describeObj.getLabel()));
                  if(!filteringFieldsByTypeMap.containsKey(fieldType)){
                        filteringFieldsByTypeMap.put(fieldType,new List<FieldWrapper>());
                        filteringFieldsByTypeMap.get(fieldType).add(field);
                  }  
                  else{
                        filteringFieldsByTypeMap.get(fieldType).add(field);
                  }  
            }
            return filteringFieldsByTypeMap;  
    }

    @AuraEnabled(Cacheable = true)
    public static Map<String,List<String>> populateOperatorsByFieldsType(List<String> fieldsType){
          Set<String> uniqueFieldTypes = new Set<String>(fieldsType);
          Map<String,List<String>> operatorsByFieldType = new Map<String,List<String>>();

          List<Operators_Configuration__mdt> operatorsList = [Select MasterLabel,Operators__c from Operators_Configuration__mdt where  MasterLabel in :fieldsType];
          for(Operators_Configuration__mdt operatorsConfig : operatorsList){
               List<String> operators = operatorsConfig.Operators__c.split(',');
               operatorsByFieldType.put(operatorsConfig.MasterLabel,operators);
          }

          return operatorsByFieldType;
          
    }




    public class CustomFilterWrapper {
          
        @AuraEnabled
        public List<Sobject> prefilteredRecords;
        @AuraEnabled
        public String fontColor;
        @AuraEnabled
        public String fontStyle;
        @AuraEnabled
        public Map<String,List<FieldWrapper>> displayedColumns;
        @AuraEnabled
        public String initialFilterCond;
        @AuraEnabled
        public Map<String,List<FieldWrapper>> filteringFieldsByType;
        @AuraEnabled
        public Map<String,String> labelByApiName;

        public CustomFilterWrapper(){

        }

        public CustomFilterWrapper(List<Sobject> prefilteredRecords,String fontColor,String fontStyle){
            this.prefilteredRecords = prefilteredRecords;
            this.fontColor = fontColor;
            this.fontStyle = fontStyle;
        }
    }

    public class FieldWrapper {
          
         @AuraEnabled
         public String apiName;
         @AuraEnabled
         public String label;

         public FieldWrapper(String apiName,String label){
               this.apiName = apiName;
               this.label = label;
         }
    }


}
