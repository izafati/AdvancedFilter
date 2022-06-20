public with sharing class SetupFilterController {

/*     @AuraEnabled(cacheable=true)
    public static string getInitialFilters(){
        string query = 'select DeveloperName,QualifiedApiName from FieldDefinition where EntityDefinition.QualifiedApiName = :objectname ORDER BY DeveloperName ASC';
        list<FieldDefinition> lstObject = Database.query(query);
        system.debug('lstObject==> '+lstObject);
        for(Integer i=0;i<lstObject.Size();i++){
            system.debug('lstObject==> '+lstObject[i].QualifiedApiName);
        }
    } */

    @AuraEnabled(cacheable=true)
    public static List<sObject> searchObjectApiNames(String searchTerm) {
        List <String> existingObjectFilters = new List<String>();
        for (CustomFilter__c customFilter : [SELECT ObjectApiName__c
            FROM CustomFilter__c
            WITH SECURITY_ENFORCED]) {    
                existingObjectFilters.add(customFilter.ObjectApiName__c); 
        }
        String myQuery = null;
        myQuery = 'Select Id, QualifiedApiName from EntityDefinition Where QualifiedApiName Like  \'%' + searchTerm + '%\' AND QualifiedApiName NOT IN :existingObjectFilters LIMIT  15';
        List<sObject> lookUpList = database.query(myQuery);
        return lookUpList;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getFieldsForSobject(String objectApiName){
        Map <String, Schema.SObjectType> mapSobjects = Schema.getGlobalDescribe();
        Map <String, Schema.SObjectField> fieldMap = mapSobjects.get(objectApiName).getDescribe().fields.getMap();
        return new List<String>(fieldMap.keySet());
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> searchForRecords(String queryField, String searchTerm, String tableName, List<String> excludeItems) {
        String whereQuery = ' Where {1} Like \'%{2}%\' ';
        String filterQuery = ' AND {1} NOT IN :{3} ';
        String limitQuery = 'LIMIT  15';
        String query = 'Select Id, {1} from {0} ';
        if(!String.isBlank(searchTerm)) {
            query += whereQuery;
        }
        if(excludeItems != null && !excludeItems.IsEmpty()) {
            query += filterQuery;
        }
        query += limitQuery;
        return Database.query(String.format(query, new List<Object>{ tableName, queryField, searchTerm, excludeItems}));
    }

    @AuraEnabled
    public static void createCustomFilter(CustomFilter__c customFilter) {
        try{
                insert customFilter;
        }catch (exception e){
                throw new AuraHandledException(e.getMessage());
        }
    }
}
