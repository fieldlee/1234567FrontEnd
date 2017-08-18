
export class Score {
    _id: string;
    title: string;
    type: string;
    region:string;
    mp3:any;
    files:any[];
    difficult:string;
    bpt:string;
    style:string;
    constructor(){
        this.files = new Array();
    }
}