/**
 * Created by andrey on 8/12/24.
 */

public with sharing class CreateWorkTypeParamsWrapper extends SamodelkinWrapper{
    public String workTypeName;
    public String description;
    public Decimal estimatedDuration;
    public String durationType;
    public Boolean shouldAutoCreateSvcAppt;

}