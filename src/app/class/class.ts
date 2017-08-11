export class Class {
    _id: string;
    title: string;
    subtitle: string;
    price:string;
    start:any;
    end:any;
    author:string;
    record:boolean;
    status:string;
    telphone:string;
    lecture:string;
    lecturename:string;
    images:string[];
    schedules:any[];
    joins:any[];
    content:string;
    constructor(){
        this.images = new Array<string>();
        this.schedules = new Array<any>();
        this.joins = new Array<any>();
    }
}