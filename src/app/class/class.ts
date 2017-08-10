export class Class {
    _id: string;
    title: string;
    subtitle: string;
    price:string;
    start:any;
    end:any;
    status:string;
    telphone:string;
    lecture:string;
    images:string[];
    schedules:any[];
    content:string;
    constructor(){
        this.images = new Array<string>();
        this.schedules = new Array<any>();
    }
}