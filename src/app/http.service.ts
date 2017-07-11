import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Ads } from "./class/ads";
import { News } from "./class/news";
import { ForumAction } from "./class/forum-action";
import { ForumInfo } from "./class/forum-info";
import { Brand } from "./class/brand";
import { Product } from "./class/product";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpService {
  private headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  private fileheaders = new Headers({ 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarysd3pNkhHgm8eLc2k' });//{ 'Content-Type': 'multipart/form-data'}
  private rootUrl = '/api';
  constructor(private http: Http) { }
  // 图片信息配置

  uploadFile(formdata: any): Promise<any> {
    // const url = `${this.rootUrl}/web/file`;
    const url = `${this.rootUrl}/web/upload/upload_image`;
    return this.http.post(url, formdata, { headers: this.fileheaders })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  deleteImage(deleteJson:any){
    const url = `${this.rootUrl}/web/file/delete`;
    return this.http.post(url,JSON.stringify(deleteJson), { headers: this.headers }).toPromise()
    .then(response=>response.json())
    .catch(this.handleError);
  }

  // 广告信息配置

  getAds(): Promise<Ads[]> {
    const url = `${this.rootUrl}/web/ads`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as Ads[])
      .catch(this.handleError);
  }

  createAds(ads: Ads): Promise<Ads> {
    const url = `${this.rootUrl}/web/ads`;
    return this.http.post(url, JSON.stringify(ads), { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as Ads)
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
    return this.http.post(url, JSON.stringify(action), { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as ForumAction)
      .catch(this.handleError);
  }

  // 新闻发布
  getNews(): Promise<News[]> {
    const url = `${this.rootUrl}/web/news`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as News[])
      .catch(this.handleError);
  }

  createNews(news: News): Promise<News> {
    const url = `${this.rootUrl}/web/news`;
    return this.http.post(url, JSON.stringify(news), { headers: this.headers })
      .toPromise()
      .then(response => response.json().data as News)
      .catch(this.handleError);
  }
  // 论坛发布

  getForums(): Promise<ForumInfo[]> {
    const url = `${this.rootUrl}/web/forum`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as ForumInfo[])
      .catch(this.handleError);
  }

  createForum(forum: ForumInfo): Promise<ForumInfo> {
    const url = `${this.rootUrl}/web/forum`;
    return this.http.post(url, JSON.stringify(forum), { headers: this.headers })
      .toPromise()
      .then(response => {console.log("----");console.log(response.json().data);response.json().data as ForumInfo})
      .catch(this.handleError);
  }
//  品牌信息
  getBrands(): Promise<Brand[]> {
    const url = `${this.rootUrl}/web/brand`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as Brand[])
      .catch(this.handleError);
  }
  createBrand(brand:Brand):Promise<Brand>{
    const url = `${this.rootUrl}/web/brand`;
    return this.http.post(url,JSON.stringify(brand),{headers:this.headers}).toPromise()
    .then(response => {response.json().data as Brand})
    .catch(this.handleError);
  }
//  产品信息
  getProducts(): Promise<Product[]> {
    const url = `${this.rootUrl}/web/product`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().results as Product[])
      .catch(this.handleError);
  }
  createProduct(product:Product):Promise<Product>{
    const url = `${this.rootUrl}/web/product`;
    return this.http.post(url,JSON.stringify(product),{headers:this.headers}).toPromise()
    .then(response => {response.json().data as Product})
    .catch(this.handleError);
  }

  // 省市区
  createProvince(provinceList: any) {
    const url = `${this.rootUrl}/basic/city`;
    this.http.post(url, JSON.stringify(provinceList), { headers: this.headers })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  createCity(province: String, cityList: any) {
    const url = `${this.rootUrl}/basic/city/${province}`;
    this.http.post(url, JSON.stringify(cityList), { headers: this.headers })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  createDistrict(province: String, city: String, districtList: any) {
    const url = `${this.rootUrl}/basic/city/${province}/${city}`;
    this.http.post(url, JSON.stringify(districtList), { headers: this.headers })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  getProvinces(): Promise<any> {
    const url = `${this.rootUrl}/basic/city`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  getCitys(province: String): Promise<any> {
    const url = `${this.rootUrl}/basic/city/${province}`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  getDistricts(province: String, city: String): Promise<any> {
    const url = `${this.rootUrl}/basic/city/${province}/${city}`;
    return this.http.get(url).toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  // 配置信息
  createType(typeList: any) {
    const url = `${this.rootUrl}/basic/type`;
    this.http.post(url, JSON.stringify(typeList), { headers: this.headers })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }

  getType(): Promise<any> {
    const url = `${this.rootUrl}/basic/type`;
    return this.http.get(url)
      .toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }
  createSubType(type: String, subtypeList: any) {
    const url = `${this.rootUrl}/basic/type/${type}`;
    this.http.post(url, JSON.stringify(subtypeList), { headers: this.headers })
      .toPromise()
      .then(resp => { console.log(resp.json) })
      .catch(this.handleError);
  }
  createTypeConfigs(type: String, subtype: String,configs:any) {
    const url = `${this.rootUrl}/basic/type/${type}/${subtype}`;
    this.http.post(url, JSON.stringify(configs), { headers: this.headers })
      .toPromise()
      .then(resp => { console.log(resp) })
      .catch(this.handleError);
  }
  getSubType(type: String): Promise<any> {
    const url = `${this.rootUrl}/basic/type/${type}`;
    return this.http.get(url)
      .toPromise()
      .then(repsonse => repsonse.json())
      .catch(this.handleError);
  }

// tags 信息配置
  createTags(configInfo:any){
    const url = `${this.rootUrl}/basic/configpraise`;
    this.http.post(url, JSON.stringify(configInfo), { headers: this.headers })
      .toPromise()
      .then(resp => { console.log(resp) })
      .catch(this.handleError);
  }

  getTags() : Promise<any> {
    const url = `${this.rootUrl}/basic/configpraise`;
    return this.http.get(url)
      .toPromise()
      .then(resp => resp.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
