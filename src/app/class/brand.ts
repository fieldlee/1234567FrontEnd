import {Image} from './image';
export class Brand {
    _id: string;
    icon:string;
    iconname:string;
    name: string;
    company: string;
    address:string;
    tel:string;
    email:string;
    content:string;
    recommend:string;
    constructor(){
       this.recommend = "0";
       this.content = "";
    }
}