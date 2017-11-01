import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { LoadJQService } from '../../../../load-jq.service';
import { LiveService } from '../live.service';
import { Show } from '../../../../class/show';
import { Class } from '../../../../class/class';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;

declare var MediaRecorder: any;
declare var requestUserMedia: any;
declare var attachMediaStream: any;
@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.css'],
  providers: [HttpService, LoadJQService, LiveService]
})
export class LiveStreamComponent implements OnInit {

  client: any;
  // { width: 1280, height: 720 } ,mandatory: {}, optional: [] 
  mediaConfig = { audio: true, video: { width:640,height:360} };
  camera: any = {};
  cameraIsOn: boolean = false;
  name = '';
  link = '';
  avator = "";
  avatorPath = "";
  say = "";
  sayto="";
  messagelist = [];
  recording: boolean = false;
  mediaRecorder: any;
  recordedBlobs = [];

  type:string;
  id:string;
  show:Show;
  class:Class;
  liveTitle = "";
  constructor(
    private httpService: HttpService,
    private liveService: LiveService,
    private route: ActivatedRoute,
    private loadJQService: LoadJQService) {

    this.client = liveService.getClient();//获得创建的问题
    this.show  = new Show();
    this.class = new Class();
  }

  ngOnInit() {
    //确认登录
    if (window.localStorage.getItem("username")=="" || window.localStorage.getItem("username") == undefined) {
      $('#loginModel').appendTo("body").modal('show');
      return;
    }
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.type = params["type"];
      if(this.type == "show"){
        this.httpService.getShowById(this.id).then(resp=>{
          if (resp.success) {
            this.show = resp.data as Show;
            this.liveTitle = this.show.sign;
          }
        })
      }
      if (this.type == "class") {
        this.httpService.getClassById(this.id).then(resp=>{
          if (resp.success) {
            this.class = resp.data as Class;
            this.liveTitle = this.class.title;
          }
        })
      }
    });

    this.name = window.localStorage.getItem("username");
    this.avatorPath = window.localStorage.getItem("avatorPath");
    this.avator = window.localStorage.getItem("avator");
  }
  ngAfterContentInit() {
    this.camera.preview = window.document.getElementById("localVideo");
    const self = this;
    this.camera.start = function () {
      return requestUserMedia(self.mediaConfig).then(stream => {
        console.log("stream===start");
        console.log(stream);
        console.log("stream===end");
        attachMediaStream(self.camera.preview, stream);
        self.client.setLocalStream(stream);
        self.camera.stream = stream;
        self.cameraIsOn = true;
      }).catch(Error('Failed to get access to local media.'));
    };
    this.camera.stop = function () {
      return new Promise(function (resolve, reject) {
        try {
          //camera.stream.stop() no longer works
          var tracks = self.camera.stream.getTracks();
          for (var track in tracks) {
            tracks[track].stop();
          }
          self.camera.preview.src = '';
          self.link = "";
          resolve();
        } catch (error) {
          reject(error);
        }
      })
        .then(function (result) {
          self.cameraIsOn = false;
        });
    };

    this.client.getSocket().on('message', function (message) {
      var type = message.type,
        from = message.from;
      if (message.type == "message") {
        self.messagelist.push(message);
        self.messagelist = self.messagelist.filter(function(t) {
           return t.from !=  self.client.getId()
        });
      }
    });
//  监听id emit 事件
    this.client.getSocket().on('id', function (id) {
      console.log("------live stream start-----");
      self.client.send('joinRoom',{room:self.id,id:id});
      if(self.type == "show"){
        // 获取更新后的show
        self.liveService.updateShowMainid(self.id,id).then(resp=>{
          if(resp.success){
            self.show = resp.data as Show;
          }
        });
      }

      if(self.type == "class"){
        self.liveService.updateClassMainid(self.id,id).then(resp=>{
          if (resp.success) {
            self.class = resp.data as Class;
          }
        })
      }
      
      console.log("------live stream end-----");
    });
  }

  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.loadJQService.reloadJQ(null);
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.client.send('leave',{room:this.id,id:this.client.getId()});
    //主播离开
    // this.liveService.leaveShow(this.id,this.client.getId(),"main").then(resp=>{
    //   if(resp.success){
    //     this.show = resp.data as Show;
    //   }
    // });
    // this.liveService.leaveClass(this.id,this.client.getId(),"main").then(resp=>{
    //   if(resp.success){
    //     this.class = resp.data as Class;
    //   }
    // });

  }

  startLive() {
    const self = this;
    if (this.cameraIsOn == false) {
      this.camera.start().then(result => {
        this.link = this.client.getId();
        this.client.send('readyToStream', { name: this.name,type:this.type,id:this.id });
        if (this.type == "show") {
          this.liveService.startShow(this.id,this.client.getId()).then(resp=>{
            if (resp.success) {
              this.show = resp.data as Show;
            }
          });
        }
        if (this.type == "class") {
          this.liveService.startClass(this.id,this.client.getId()).then(resp=>{
              if (resp.success) {
                this.class = resp.data as Class;
              }
          })
        }
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      this.camera.stop()
        .then(result => {
          this.client.send('leave',{room:this.id,id:this.client.getId()});
          // this.client.send('leave',{id:this.id});
          this.client.setLocalStream(null);
          // 主播离开直播
          if (this.type == "show") {
            this.liveService.leaveShow(this.id,this.client.getId(),"main").then(resp=>{
              if(resp.success){
                this.show = resp.data as Show;
              }
            });
          }
          if (this.type == "class") {
            this.liveService.leaveClass(this.id,this.client.getId(),"main").then(resp=>{
              if(resp.success){
                this.class  = resp.data as Class;
              }
            })
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  saveCapture() {
    var video = window.document.querySelector('video');
    var canvas = window.document.querySelector('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var link = document.getElementById('link');
    var imageName = (new Date()).getTime() + ".png";
    link.setAttribute('download', imageName);
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
  }

  anwser(from,avator){
    this.say="@"+avator+":"
    this.sayto = from;
  }
  keypress(event) {
    if (event.keyCode == "13" && this.say != "") {
      this.send();
    }
  }
  send() {
    const payload = {
      "type": "message",
      "room":this.id,
      "to": this.sayto==""?this.client.getId():this.sayto,
      "avator": this.avator,
      "avatorPath": this.avatorPath,
      "message": this.say
    };
    this.messagelist.push(payload);
    this.client.send("message", payload);
    this.say = "";
    this.sayto = "";
  }

  startRecording() {
    const self = this;
    if (this.recording == false) {
      this.recording = true;
      var options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        // console.log(options.mimeType + ' is not Supported');
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          // console.log(options.mimeType + ' is not Supported');
          options = { mimeType: 'video/webm' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            // console.log(options.mimeType + ' is not Supported');
            options = { mimeType: '' };
          }
        }
      }
      try {
        this.mediaRecorder = new MediaRecorder(this.camera.stream, options);
      } catch (e) {
        // console.error('Exception while creating MediaRecorder: ' + e);
        // alert('Exception while creating MediaRecorder: '
        //   + e + '. mimeType: ' + options.mimeType);
        return;
      }
      // console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

      // mediaRecorder.onstop = handleStop;
      this.mediaRecorder.ondataavailable = function (event) {
       
        if (event.data && event.data.size > 0) {
          self.recordedBlobs.push(event.data);
        }
      };
      this.mediaRecorder.start(10); // collect 10ms of data
      
    }
    else {
      this.recording = false;
      this.mediaRecorder.stop();
      console.log('Recorded Blobs: ', this.recordedBlobs);
      var blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const videoName = (new Date()).getTime();
      a.download = videoName + '.webm';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  }
}
