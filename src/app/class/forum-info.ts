export class ForumInfo {
    _id:string;
    title: String;
    type: String;
    content:String;
    author:String;
    avator:String;
    issueTime:Date;
    images:string[];
    videos:string[];
    constructor(){
        this.images = new Array();
        this.videos = new Array();
    }
}
