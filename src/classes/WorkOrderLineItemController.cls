/**
 * Created by andrey on 8/5/24.
 */

public with sharing class WorkOrderLineItemController {

    @AuraEnabled
    public static WorkOrderLineItem createWorkOrderLineItemApexMethod(String paramsJSONString) {

        WorkOrderLineItem workOrderLineItem = new WorkOrderLineItem();

        try {
            CreateWorkOrderLineItemParamsWrapper wrapper = (CreateWorkOrderLineItemParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateWorkOrderLineItemParamsWrapper.class);

            String status = wrapper.status;
            Id workOrderId = wrapper.workOrderId;
            Id workTypeId = wrapper.workTypeId;
            String description = wrapper.description;

            workOrderLineItem = new WorkOrderLineItem(Status = status, WorkOrderId = workOrderId, WorkTypeId = workTypeId,
                    Description = description);
            insert workOrderLineItem;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workOrderLineItem;
    }

    @AuraEnabled
    public static SObject getWorkOrderNumberById(Id workOrderId) {

        SObject workOrder = new WorkOrder();

        String workOrderIdString = workOrderId.to15();
        try {
            String query =
                    'SELECT WorkOrderNumber FROM WorkOrder WHERE Id = ' + '\''+  workOrderIdString + '\'';

            workOrder = (BaseComponentController.getRecordsBySOQL(query))[0];

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workOrder;
    }
}