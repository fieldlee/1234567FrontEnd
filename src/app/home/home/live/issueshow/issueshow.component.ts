import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { LiveService } from '../live.service';
import { ContantService } from '../../../../contant.service';
import { LoadJQService } from '../../../../load-jq.service';
import { Show } from '../../../../class/show';

import { Routes, RouterModule, ActivatedRoute ,Router} from '@angular/router';
declare var $ :any;
@Component({
  selector: 'app-issueshow',
  templateUrl: './issueshow.component.html',
  styleUrls: ['./issueshow.component.css'],
  providers: [HttpService, LoadJQService,ContantService,LiveService]
})
export class IssueshowComponent implements OnInit {
  show:Show;
  instruments:string[]=['钢琴','萨克斯','笛子'];
  imageCanvas: any;
  constructor(private httpService: HttpService,
    private router:Router,
    private contantService:ContantService,
    private loadJq: LoadJQService,
    private liveService: LiveService,
    private route: ActivatedRoute) {
      this.show = new Show();
     }

  ngOnInit() {

  }
  showToast(message,type) {
    $.notify(message, {
      type: type,
      placement: {
        from: 'bottom',
        align: 'center'
      }
    }, {
        animate: {
          enter: 'animated lightSpeedIn',
          exit: 'animated lightSpeedOut'
        }
      });
    return;
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const self = this;
    this.imageCanvas = $("#imageHead");
    this.imageCanvas.cropper({
      aspectRatio: 1.57,
      preview: "#headerPreview"
    });
    var $inputImage = $("#inputImage");
    $inputImage.change(function () {
      var fileReader = new FileReader(),
        files = this.files,
        file;
      if (!files.length) {
        return;
      }
      file = files[0];
      if (/^image\/\w+$/.test(file.type)) {
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
          $inputImage.val("");
          self.imageCanvas.cropper("reset", true).cropper("replace", this.result);
        };
      } else {
        this.showToast('请上传身份证','warning');
      }
    });
    this.loadJq.reloadJQ(null);
  }
  changeListener($event): void {
    const _this = this;
    $('#uploadForm').ajaxSubmit({
      error: function (xhr) {
        console.log(xhr)
      },
      success: function (response) {
        console.log(response);
        var respJson;
        if (typeof respJson == "string") {
          respJson = JSON.parse(response);
        } else {
          respJson = response;
        }
        _this.show.image = respJson["path"];
        // _this.class.certifyfilename = respJson["originName"];
      }
    });
  }
  UploadImage() {
    $('#modifyIdCARDmodal').appendTo("body").modal('show');
  }
  getIdImageData() {
    console.log(this.imageCanvas.cropper({"fillColor":"#fff"}).cropper("getCroppedCanvas")) ;
    var imageDate = this.imageCanvas.cropper("getDataURL");
    var qulity = 1.0;
    if (imageDate.length > 1000000) {
      qulity = 0.2;
    } else if (imageDate.length > 500000) {
      qulity = 0.4;
    } else if (imageDate.length > 250000) {
      qulity = 0.8;
    } else {
      qulity = 1.0;
    }
    var newImageData = this.imageCanvas.cropper("getDataURL",{
                    width: 150,
                    height: 150
                }, "image/jpeg",qulity);
               
    this.show.idcard = newImageData;
    console.log(this.show.idcard);
  }
  // 发布直播
  issueshow(){
    if(this.show.sign == undefined || this.show.sign == ""){
      this.showToast('请填写直播签名','warning');
      return;
    }
    var self = this;

    $("#selecttypes option:selected").map(function (i, el) {
      // console.log($(el).text());
      self.show.types.push($(el).text())
    });
    this.show.author = window.localStorage.getItem("username");

    this.httpService.createShow(this.show).then(resp=>{
      if(resp.success){
        this.showToast('直播发布完成','success');
        this.show = resp.data as Show;
      }
    });
  }
}
