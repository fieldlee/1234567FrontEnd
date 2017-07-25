import {Image} from './image';
export class Brand {
    _id: string;
    icon:string;
    iconname:string;
    name: string;
    company: string;
    province:string;
    city:string;
    char:string;
    district:string;
    address:string;
    tel:string;
    email:string;
    fax:string;
    url:string;
    content:string;
    recommend:string;
    productkeys:string[];
    products:any[];
    constructor(){
       this.recommend = "0";
       this.content = "";
       
    }
}