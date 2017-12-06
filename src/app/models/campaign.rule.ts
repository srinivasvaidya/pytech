/**
 * A model for an individual StoreCustomer
 */
export class CampaignRule {
    CampaignRuleId: number;
    BranchId: number;
    MerchantBranchId: number;
    CampaignName:string;
    CampaignType:string;
    CampaignTrigger:string;
    TriggerValue:string;
    CampaignText:string;
    CreatedDate:Date;
    CreatedBy:string;
    constructor(){
    }
}