import {SafeHtml} from '@angular/platform-browser';
export class ForumInfo {
    _id:string;
    title: string;
    brand:string;
    product:string;
    type: string;
    subType: string;
    tags:string[];
    content:string;
    contentSafe : SafeHtml ;
    author:string;
    avator:string;
    avatorPath:string;
    issueTime:Date;
    fromTime:string;
    images:string[];
    videos:string[];
    comment:string;
    read:string;
    support:string;
    collect:string;
    constructor(){
        this.images = new Array();
        this.videos = new Array();
    }
}
