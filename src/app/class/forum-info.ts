export class ForumInfo {
    _id:string;
    title: String;
    brand:String;
    product:String;
    type: String;
    subType: String;
    tags:String[];
    content:String;
    author:String;
    avator:String;
    avatorPath:String;
    issueTime:Date;
    fromTime:String;
    images:String[];
    videos:String[];
    comment:String;
    read:String;
    support:String;
    constructor(){
        this.images = new Array();
        this.videos = new Array();
    }
}
