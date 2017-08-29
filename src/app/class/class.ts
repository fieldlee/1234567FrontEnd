import {SafeHtml} from '@angular/platform-browser';
export class Class {
    _id: string;
    title: string;
    subtitle: string;
    price:string;
    start:any;
    end:any;
    author:string;
    record:boolean;
    status:string; // waiting progress close end
    telphone:string;
    lecture:string;
    lecturename:string;
    idcard:string;
    idno:string;
    mainid:string;
    members:string[];
    certifyfile:string;
    certifyfilename:string;
    materials:any[];
    images:string[];
    schedules:any[];
    joins:any[];
    content:string;
    contentSafe:SafeHtml;
    constructor(){
        this.images = new Array<string>();
        this.schedules = new Array<any>();
        this.joins = new Array<any>();
        this.materials = new Array<any>();
    }
}