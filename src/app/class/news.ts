export class News {
    _id:string;
    title:string;
    content:string;
    author:string;
    date:Date;
    images:string[];
    videos:string[];
    constructor(){
        this.images = new Array();
        this.videos = new Array();
    }
}
