
export class Score {
    _id: string;
    title: string;
    type: string;
    region:string;
    mp3:any;
    files:any[];
    difficult:string;
    bpt:string;
    author:string;
    avator:string;
    authorPath:string;
    style:string;
    read:string;
    support:string;
    fromTime:string;
    constructor(){
        this.files = new Array();
    }
}