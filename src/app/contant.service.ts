import { Injectable } from '@angular/core';
import { HomeComponent } from './home/home/home.component';
@Injectable()
export class ContantService {
  homeComponent:HomeComponent;
  constructor() { }
  // setMenuActive(type){
  //   this.homeComponent.setActive(type);
  // }
  getType(type:String){
    switch (type) {
      case "键盘乐器":
        return "A";
      case "管式乐器":
        return "B";
      case "拉弦乐器":
        return "C";
      case "弹拨乐器":
        return "D";
      case "打击乐器":
        return "E";
      case "吹奏乐器":
        return "F";
      default:
        break;
    }
  }
  getInstrumentType(type:String){
    switch (type) {
      case "A":
        return "键盘乐器";
      case "B":
        return "管式乐器";
      case "C":
        return "拉弦乐器";
      case "D":
        return "弹拨乐器";
      case "E":
        return "打击乐器";
      case "F":
        return "吹奏乐器";
      default:
        break;
    }
  }
  getSubForums(type:String){
    switch (type) {
      case "A":
        return ["全部","钢琴","其他"];
      case "B":
        return ["全部","萨克斯","其他"];
      case "C":
        return ["全部","小提琴","吉他","其他"];
      case "D":
        return ["全部","琵琶","其他"];
      case "E":
        return ["全部"];
      case "F":
        return ["全部"];
      default:
        break;
    }
  }
}
