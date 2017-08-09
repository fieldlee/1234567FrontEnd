export class Delegate {
    _id: string;
    name:string;
    address:string;
    email:string;
    telephone:string;
    province:string;
    city:string;
    district:string;
    images:string[];
    constructor(){
        this.images = new Array();
    }
}
