import {SafeHtml} from '@angular/platform-browser';
export class Comment {
    _id:string;
    parentId:string;
    content:string;
    contentSafe:SafeHtml;
    author:string;
    issueTime:Date;
    fromTime:string;
    avator:string;
    avatorPath:string;
    support:string;
    subComments:Comment[];
    constructor(){
    }
}
