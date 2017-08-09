export class Product {
    _id: string;
    name: string;
    brand:string;
    type: string;
    subType: string;
    recomment:string;
    recommentPrice:string;
    content:string;
    status:string;
    images:string[];
    appearimages:string[];
    detailimages:string[];
    config:any;
    praise:any;
    constructor(){
        this.recomment = "0";
        this.status = "insale";
        this.images = new Array();
    }
}