/**
 * Created by andrey on 8/12/24.
 */

public with sharing class CreateSkillRequirementParamsWrapper extends SamodelkinWrapper{

    public Id relatedRecordId;
    public Id skillId;
    public Decimal skillLevel;
}