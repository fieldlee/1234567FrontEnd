export class Image {
    _id:string;
    originName:string;
    path:string;
    size:string;
    constructor(){
        
    }
    reinit(obj:any){
        this._id = obj["_id"];
        this.originName = obj["originName"];
        this.path = obj["path"];
        this.size = obj["size"];
    }
}