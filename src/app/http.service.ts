import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Ads } from "./class/ads";
import { News } from "./class/news";
import { ForumAction } from "./class/forum-action";
import { ForumInfo } from "./class/forum-info";
import { Brand } from "./class/brand";
import { Product } from "./class/product";
import { Comment } from "./class/comment";
import { Praise } from "./class/praise";
import 'rxjs/add/operator/toPromise';
declare var $: any;
@Injectable()
export class HttpService {
  // private headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  private fileheaders = new Headers({ 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarysd3pNkhHgm8eLc2k' });//{ 'Content-Type': 'multipart/form-data'}
  private rootUrl = '/api';
  constructor(private http: Http) { }

  constructHeader() {
    var header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Access-Control-Allow-Origin', '*');
    if (window.localStorage.getItem("x-access-token")) {
      header.append('x-access-token', window.localStorage.getItem("x-access-token"));
    }
    if (window.localStorage.getItem("username")) {
      header.append('x-access-username', window.localStorage.getItem("username"));
    }
    if (window.localStorage.getItem("avator")) {
      header.append('x-access-avator', window.localStorage.getItem("avator"));
    }
    return header;
  }
  // Login

  login(formdata: any): Promise<any> {
    const url = `${this.rootUrl}/auth/login`;
    const header = this.constructHeader();
    return this.http.post(url, formdata, { headers: header })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
// getUsername
  getUser(username: any): Promise<any> {
    const url = `${this.rootUrl}/auth/user/${username}`;
    const header = this.constructHeader();
    return this.http.get(url, { headers: header })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
    updateUser(user:any):Promise<any>{
      const url = `${this.rootUrl}/auth/user/update`;
      const header = this.constructHeader();
      return this.http.post(url,user,{ headers: header }).toPromise()
        .then(response=>response.json())
        .catch(this.handleError);
    }
  // register
  register(formdata: any): Promise<any> {
    const url = `${this.rootUrl}/auth/register`;
    const header = this.constructHeader();
    return this.http.post(url, formdata, { headers: header })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  // forget
  forget(formdata: any): Promise<any> {
    const url = `${this.rootUrl}/auth/forget`;
    const header = this.constructHeader();
    return this.http.post(url, formdata, { headers: header })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  // changepassword
  changepassword(formdata: any): Promise<any> {
    const url = `${this.rootUrl}/auth/changepassword`;
    const header = this.constructHeader();
    return this.http.post(url, formdata, { headers: header })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // 图片信息配置

  uploadFile(formdata: any): Promise<any> {
    const url = `${this.rootUrl}/web/upload/upload_image`;
    return this.http.post(url, formdata, { headers: this.fileheaders })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  deleteImage(deleteJson: any) {
    const url = `${this.rootUrl}/web/file/delete`;
    return this.http.post(url, JSON.stringify(deleteJson), { headers: this.constructHeader() }).toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // 广告信息配置

  getAds(): Promise<Ads[]> {
    const url = `${this.rootUrl}/web/ads`;
    return this.http.get(url)
      .toPromise()
      .then(response =>response.json().results as Ads[])
      .catch(this.handleError);
  }

  createAds(ads: Ads): Promise<Ads> {
    const url = `${this.rootUrl}/web/ads`;
    return this.http.post(url, JSON.stringify(ads), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json().data as Ads)
      .catch(this.handleError);
  }

  deleteAds(ads: Ads): Promise<any> {
    const url = `${this.rootUrl}/web/ads/delete`;
    return this.http.post(url, JSON.stringify(ads), { headers: this.constructHeader() })
      .toPromise()
      .then(response =>response.json())
      .catch(this.handleError);
  }

//  查询

  search(body:any):Promise<any>{
    const url = `${this.rootUrl}/web/search`;
    return this.http.post(url, JSON.stringify(body), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  // 论坛活动
  
  getActions(): Promise<ForumAction[]> {
    const url = `${this.rootUrl}/web/action`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as ForumAction[])
      .catch(this.handleError);
  }

  createAction(action: ForumAction): Promise<ForumAction> {
    const url = `${this.rootUrl}/web/action`;
    return this.http.post(url, JSON.stringify(action), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json().data as ForumAction)
      .catch(this.handleError);
  }

  deleteAction(action: ForumAction): Promise<any> {
    const url = `${this.rootUrl}/web/action/delete`;
    return this.http.post(url, JSON.stringify(action), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  // 新闻发布
  getNewsNumber(): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/news/number?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response =>  response.json())
      .catch(this.handleError);
  }

  getNews(page:string): Promise<News[]> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/news/${page}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => 
          response.json().results as News[]
      )
      .catch(this.handleError);
  }

  getNewsById(id:string): Promise<any> {
    const url = `${this.rootUrl}/web/news/byid/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => 
          response.json().data
      )
      .catch(this.handleError);
  }

  supportNewsById(id:String):Promise<any>{
    const url = `${this.rootUrl}/web/news/support`;
    return this.http.post(url,JSON.stringify({"id":id}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  createNews(news: News): Promise<News> {
    const url = `${this.rootUrl}/web/news`;
    return this.http.post(url, JSON.stringify(news), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json().data as News)
      .catch(this.handleError);
  }
  deleteNews(news: News): Promise<any> {
    const url = `${this.rootUrl}/web/news/delete`;
    return this.http.post(url, JSON.stringify(news), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  // 关注
  getFollow():Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/follow?${time}`;
    return this.http.get(url,{ headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  createFollow(folwJson:any):Promise<any>{
    const url = `${this.rootUrl}/web/follow`;
    return this.http.post(url, JSON.stringify(folwJson), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getFollowByUser(folwJson:any):Promise<any>{
    // const folwjson = { "username": window.localStorage.getItem("username"), "followusername": username };

    const url = `${this.rootUrl}/web/follow/byuser`;
    return this.http.post(url,JSON.stringify(folwJson),{ headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  // 论坛发布
  getRecentForums():Promise<any>{
    const url = `${this.rootUrl}/web/forum/sub/recent`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getForumsByUsername(username:String): Promise<any> {
    const url = `${this.rootUrl}/web/forum/sub/byusername/${username}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getForumsByType(type:String,page:string): Promise<any> {

    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/forum/${type}/${page}?${time}`;
    console.log(url);
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getForumsByTypeAndSub(type:String,subtype:String,page:string): Promise<any> {
     console.log(page);
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/forum/${type}/${subtype}/${page}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getForumsById(id:String): Promise<ForumInfo> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/forum/sub/byid/${id}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as ForumInfo)
      .catch(this.handleError);
  }
  getForumsByProductId(id:String): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/forum/sub/byproductid/${id}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  // 收藏帖子 
  collectNews(body:any):Promise<any>{
    const url = `${this.rootUrl}/web/collect`;
    return this.http.post(url,JSON.stringify(body), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  collectForum(body:any):Promise<any>{
    const url = `${this.rootUrl}/web/collect`;
    return this.http.post(url,JSON.stringify(body), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getCollections(username:string):Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/collect/${username}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  supportForumById(id:String):Promise<any>{
    const url = `${this.rootUrl}/web/forum/sub/support/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  supportCommentById(id:String):Promise<any>{
    const url = `${this.rootUrl}/web/comment/support`;
    return this.http.post(url,JSON.stringify({"id":id}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getForums(): Promise<ForumInfo[]> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/forum?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as ForumInfo[])
      .catch(this.handleError);
  }
  createForum(forum: ForumInfo): Promise<any> {
    const url = `${this.rootUrl}/web/forum`;
    return this.http.post(url, JSON.stringify(forum), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);
  }
  deleteForum(forum: ForumInfo): Promise<any> {
    const url = `${this.rootUrl}/web/forum/delete`;
    return this.http.post(url, JSON.stringify(forum), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  //  回帖
  getComment(pid:String,page:string):Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/comment/${pid}/${page}?${time}`;
    return this.http.get(url).toPromise()
    .then(response=>response.json())
    .catch(this.handleError);
  } 

  createComment(comment:Comment):Promise<any>{
    const url = `${this.rootUrl}/web/comment`;
    return this.http.post(url,JSON.stringify(comment), { headers: this.constructHeader() })
    .toPromise()
    .then(response=>response.json().data)
    .catch(this.handleError);
    }
  //  品牌信息
  getBrandById(id:string): Promise<Brand> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/brand/${id}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Brand)
      .catch(this.handleError);
  }
  getBrands(): Promise<Brand[]> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/brand?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as Brand[])
      .catch(this.handleError);
  }
  createBrand(brand: Brand): Promise<Brand> {
    const url = `${this.rootUrl}/web/brand`;
    return this.http.post(url, JSON.stringify(brand), { headers: this.constructHeader() }).toPromise()
      .then(response => { response.json().data as Brand })
      .catch(this.handleError);
  }

  deleteBrand(brand: Brand): Promise<any> {
    const url = `${this.rootUrl}/web/brand/delete`;
    return this.http.post(url, JSON.stringify(brand), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  //  产品口碑信息
  getPraiseConfig(type:string):Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/praise/config/${type}?${time}`;
    return this.http.get(url).toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  createParise(praise:Praise):Promise<Praise>{
    const url = `${this.rootUrl}/web/praise`;
    return this.http.post(url, JSON.stringify(praise), { headers: this.constructHeader() }).toPromise()
      .then(response =>  response.json().data as Praise)
      .catch(this.handleError);
  }

  getPariseById(id:string):Promise<Praise>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/praise/${id}?${time}`;
    return this.http.get(url).toPromise()
      .then(response => response.json().data as Praise)
      .catch(this.handleError);
  }
  getPariseByProductId(id:string):Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/praise/byproduct/${id}?${time}`;
    return this.http.get(url).toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  //  产品信息
  getProductById(id:string): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/product/${id}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getProducts(): Promise<Product[]> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/product?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as Product[])
      .catch(this.handleError);
  }
  createProduct(product: Product): Promise<Product> {
    const url = `${this.rootUrl}/web/product`;
    return this.http.post(url, JSON.stringify(product), { headers: this.constructHeader() }).toPromise()
      .then(response =>  response.json().data as Product )
      .catch(this.handleError);
  }
  deleteProduct(product: Product): Promise<any> {
    const url = `${this.rootUrl}/web/product/delete`;
    return this.http.post(url, JSON.stringify(product), { headers: this.constructHeader() }).toPromise()
      .then(response =>  response.json())
      .catch(this.handleError);
  }
  // 创建琴行信息
  createDelegate(delegate:any):Promise<any>{
    const url = `${this.rootUrl}/basic/delegate`;
    return this.http.post(url,JSON.stringify(delegate), { headers: this.constructHeader() }).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }

  getDelegates():Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/delegate?${time}`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }

  deleteDelegate(id:string):Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/delegate/delete/${id}?${time}`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }

  // 省市区
  createProvince(provinceList: any) {
    const url = `${this.rootUrl}/basic/city`;
    this.http.post(url, JSON.stringify(provinceList), { headers: this.constructHeader() })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  createCity(province: String, cityList: any) {
    const url = `${this.rootUrl}/basic/city/${province}`;
    this.http.post(url, JSON.stringify(cityList), { headers: this.constructHeader() })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  createDistrict(province: String, city: String, districtList: any) {
    const url = `${this.rootUrl}/basic/city/${province}/${city}`;
    this.http.post(url, JSON.stringify(districtList), { headers: this.constructHeader() })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  getProvinces(): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/city?${time}`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  getCitys(province: String): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/city/${province}?${time}`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  getDistricts(province: String, city: String): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/city/${province}/${city}?${time}`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  // 配置信息
  createType(typeList: any) {
    const url = `${this.rootUrl}/basic/type`;
    this.http.post(url, JSON.stringify(typeList), { headers: this.constructHeader() })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }

  getType(): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/type?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  createSubType(type: String, subtypeList: any) {
    const url = `${this.rootUrl}/basic/type/${type}`;
    this.http.post(url, JSON.stringify(subtypeList), { headers: this.constructHeader() })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  createTypeConfigs(type: String, subtype: String, configs: any) {
    const url = `${this.rootUrl}/basic/type/${type}/${subtype}`;
    this.http.post(url, JSON.stringify(configs), { headers: this.constructHeader() })
      .toPromise()
      .then(resp => { console.log(resp) })
      .catch(this.handleError);
  }
  getSubType(type: String): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/type/${type}?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  getAllSubType(): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/type/allsubtype?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  // tags 信息配置
  createTags(configInfo: any) {
    const url = `${this.rootUrl}/basic/configpraise`;
    this.http.post(url, JSON.stringify(configInfo), { headers: this.constructHeader() })
      .toPromise()
      .then(resp => { console.log(resp) })
      .catch(this.handleError);
  }

  getTags(): Promise<any> {
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/basic/configpraise?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(resp => resp.json())
      .catch(this.handleError);
  }
// 品牌产品信息
  getBrandProducts():Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/brand?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(resp => resp.json())
      .catch(this.handleError);
  }
  // 省市区get json
  getRegion(){
    return this.http.get("https://raw.githubusercontent.com/louisgeek/LouisAreaSelectDemo/master/DropDownViewLib/src/main/res/raw/ssq.json")
      .toPromise()
      .then(resp => resp.json())
      .catch(this.handleError);
  }

  // 获得stream
  getStream():Promise<any>{
    const time = (new Date()).getTime();
    const url = `${this.rootUrl}/web/streams?${time}`;
    return this.http.get(url)
      .toPromise()
      .then(resp => resp)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
