export class Product {
    _id: string;
    name: String;
    brand:String;
    type: String;
    subType: String;
    recomment:String;
    recommentPrice:String;
    content:String;
    status:String;
    images:String[];
    config:any;
    praise:any;
    constructor(){
        this.recomment = "0";
        this.status = "insale";
        this.images = new Array();
    }
}