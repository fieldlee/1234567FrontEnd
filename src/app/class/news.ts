export class News {
    _id:string;
    title: string;
    brand:string;
    product:string;
    type: string;
    subType: string;
    tags:string[];
    content:string;
    contentSafe:string;
    author:string;
    avator:string;
    avatorPath:string;
    issueTime:Date;
    fromTime:string;
    images:string[];
    videos:string[];
    comment:string;
    read:string;
    collect:string;
    support:string;
    constructor(){
        this.images = new Array();
        this.videos = new Array();
    }
}
