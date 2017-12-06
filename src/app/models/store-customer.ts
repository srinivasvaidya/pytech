/**
 * A model for an individual StoreCustomer
 */
export class StoreCustomer {
    StoreCustomerId: number;
    MerchantBranchId: number;
    Source:string;
    CustomerType:string;
    FirstName:string;
    LastName:string;
    CompanyName:string;
    CompanyWebsite:string;
    PrimaryPhone:string;
    SecondaryPhone:string;
    Email:string;
    Address1:string;
    Address2:string;
    Country:string;
    State:string;
    City:string;
    ZipCode:string;
    BirthMonth:string;
    BirthDay:number;
    AnnivMonth:string;
    AnnivDay:number;
    PosId:number;
    BranchId:number;
    CreatedDate:Date;
    CreatedBy: string;
    ModifiedDate:Date;
    ModifiedBy: string;
    ExternalCustomerId:string;
    Latitude:string;
    Longitude:string;
    GMAP_Address1:string;
    GMAP_Address2:string;
    GMAP_Country:string;
    GMAP_City:string;
    GMAP_ZipCode:string;
    constructor(){
    }
}