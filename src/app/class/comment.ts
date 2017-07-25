export class Comment {
    _id:String;
    parentId:String;
    content:String;
    author:String;
    issueTime:Date;
    fromTime:String;
    avator:String;
    avatorPath:String;
    support:String;
    subComments:Comment[];
    constructor(){
    }
}
