/**
 * A model for an individual StoreCustomer
 */
export class Campaign {
    CampaignId: number;
    BranchId: number;
    MerchantBranchId: number;
    CampaignName:string;
    CampaignType:string;
    isAuto:Boolean;
    CampaignText:string;
    CampaignRule:string;
    CampaignDate:Date;
    CreatedDate:Date;
    CreatedBy:string;
    constructor(){
    }
}