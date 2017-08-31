import { Component, OnInit } from '@angular/core';
import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { HttpService } from '../../../../http.service';
import { LoadJQService } from '../../../../load-jq.service';
import { LiveService } from '../live.service';
import { Show } from '../../../../class/show';
import { Class } from '../../../../class/class';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;
declare var MediaRecorder: any;
declare var navigator : any;
@Component({
  selector: 'app-receive-stream',
  templateUrl: './receive-stream.component.html',
  styleUrls: ['./receive-stream.component.css'],
  providers: [HttpService, LoadJQService, LiveService]
})
export class ReceiveStreamComponent implements OnInit {
  remoteStreams = [];
  client: any;
  id = "";
  type = "";
  show:Show;
  class:Class;

  streamId = "";
  avator = "";
  avatorPath = "";
  say = "";
  messagelist = [];
  recording: boolean = false;
  mediaRecorder: any;
  recordedBlobs = [];
  remoteStream: any;

  rewardlist:string[];
  rewardnames:string[];
  rewardvalues:string[];

  rewardto:string="";
  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private liveSercie: LiveService,
    private loadJQService: LoadJQService) {
    this.client = liveSercie.getClient();//读取客户端的client
    this.show = new Show();
    this.rewardlist = this.liveSercie.Adwardlist;
    this.rewardnames = this.liveSercie.AdwardNames;
    this.rewardvalues = this.liveSercie.AdwardValues;
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
      if (this.id != undefined) {
        if (this.type == "show") {
          this.httpService.getShowById(this.id).then(resp=>{
            if (resp.success) {
              this.show = resp.data as Show;
              this.rewardto = this.show.author;
              if (this.show.mainid != undefined) {
                this.streamId = this.show.mainid;// 主播id
                this.loadData();
                this.view(this.streamId);
              }
            }
          })
        }
        if (this.type == "class") {
          this.httpService.getClassById(this.id).then(resp=>{
            if (resp.success) {
              this.class = resp.data as Class;
              this.rewardto = this.class.author ;
              if (this.class.mainid != undefined) {
                this.streamId = this.class.mainid;// 主播id
                this.loadData();
                this.view(this.streamId);
              }
            }
          })
        }
      }
    });
    this.avatorPath = window.localStorage.getItem("avatorPath");
    this.avator = window.localStorage.getItem("avator");
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadJQService.reloadJQ(null);
  }

  ngAfterContentInit() {
    const self = this;
    this.client.getSocket().on('readyToStream', function (message) {
      //  当有人 ready 了，刷新列表
      self.reload();
    });

    this.client.getSocket().on('message', function (message) {
      var type = message.type,
        from = message.from;
      if (message.type == "message") {
        self.messagelist.push(message);
      }
    });

    this.client.getSocket().on('id', function (id) {
      console.log("------receive stream start-----");
      console.log(id);
      self.client.send('joinRoom',{room:self.id,id:id});
      if (self.type == "show") {
        self.liveSercie.joinShow(self.id,id).then(resp=>{
          if (resp.success) {
            self.show = resp.data as Show; //读取直播信息
          }
        })
      }
      if(self.type == "class"){
        self.liveSercie.joinClass(self.id,id).then(resp=>{
          if (resp.success) {
            self.class = resp.data as Class;
          }
        })
      }
      console.log("------receive stream end-----");
    });
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    // navigator.getUserMedia || 
    // (navigator.getUserMedia = navigator.mozGetUserMedia ||  navigator.webkitGetUserMedia || navigator.msGetUserMedia);
    // if (navigator.getUserMedia) {
    //   navigator.getUserMedia({
    //     audio: true,
    //     video: true
    //   }).
    //     then(function (stream) {
    //       self.remoteStream = stream;
    //     }).catch(function (err) {
    //       console.log('navigator.getUserMedia error: ', err);
    //     });
    // } else {
    //   console.log("====不支持====")
      // navigator.mediaDevices.getUserMedia({
      //   audio: true,
      //   video: true
      // }).
      //   then(function (stream) {
      //     self.remoteStream = stream;
      //   }).catch(function (err) {
      //     console.log('navigator.getUserMedia error: ', err);
      //   });
    // }
    

  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.client.send('leave',{room:this.id,id:this.client.getId()});

    // 离开直播
    // if (this.type == "show") {
    //   this.liveSercie.leaveShow(this.id,this.client.getId(),"member").then(resp=>{
    //     if (resp.success) {
          
    //     }
    //   })
    // }
    // if (this.type == "class") {
    //   this.liveSercie.leaveClass(this.id,this.client.getId(),"member").then(resp=>{

    //   })
    // }
    
  }

  reload() {
    if (this.streamId) {
      this.loadData();
      this.view(this.streamId);
    }
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
      "to": this.streamId,
      "avator": this.avator,
      "avatorPath": this.avatorPath,
      "message": this.say
    };
    this.messagelist.push(payload);
    this.client.send("message", payload);
    this.say = "";
  }

  getStreamById(id) {
    for (var i = 0; i < this.remoteStreams.length; i++) {
      if (this.remoteStreams[i].id === id) { return this.remoteStreams[i]; }
    }
  }

  loadData() {
    const self = this;
    this.httpService.getStream().then(resp => {
      if (resp instanceof Array) {
        const streams = resp.filter(function (stream) {
          return stream.id != self.client.getId();
        });
        for (var i = 0; i < streams.length; i++) {
          var stream = this.getStreamById(streams[i].id);
          streams[i].isPlaying = (!!stream) ? stream.isPLaying : false;
        }
        this.remoteStreams = streams;
      }
    })
  }

  view(stream) {
    if (!stream.id) {
      stream = { id: stream, isPlaying: false };
      this.remoteStreams.push(stream);
    }
    this.client.peerInit(stream.id);
    // 加入直播
    if (this.type == "show") {
      this.liveSercie.joinShow(this.id,this.streamId).then(resp=>{
        if (resp.success) {
          this.show = resp.data as Show;
        }
      })
    }
    if (this.type == "class") {
      this.liveSercie.joinClass(this.id,this.streamId).then(resp=>{
        if (resp.success) {
          this.class = resp.data as Class;
        }
      })
    }
    
    stream.isPlaying = !stream.isPlaying;
  }

  call(stream) {
    if (!stream.id) {
      stream = { id: stream, isPlaying: false };
      this.remoteStreams.push(stream);
    }
    this.client.toggleLocalStream(stream.id);
    if (stream.isPlaying) {
      this.client.peerRenegociate(stream.id);
      this.client.send('leave',{room:this.id,id:this.client.getId()});
      // this.client.send('leave',{id:this.id}); // 离开直播
    } else {
      this.client.peerInit(stream.id);
      this.client.send('readyToStream', { name: window.localStorage.getItem("username"),type:this.type,id:this.id });
    }
    stream.isPlaying = !stream.isPlaying;
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
        console.log(self.remoteStream);
        this.mediaRecorder = new MediaRecorder(self.remoteStream, options);
      } catch (e) {
        // console.error('Exception while creating MediaRecorder: ' + e);
        // alert('Exception while creating MediaRecorder: '
        //   + e + '. mimeType: ' + options.mimeType);
        return;
      }
      // console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

      // mediaRecorder.onstop = handleStop;
      this.mediaRecorder.ondataavailable = function (event) {
        console.log(event);
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

  reward(id,name,value){

    const payload = {
      "type": "message",
      "room":this.id,
      "to": this.streamId,
      "avator": this.avator,
      "avatorPath": this.avatorPath,
      "message": "送出 <img class='img-thumbnail' src='./public/img/food/40X40/"+id+".png'>"
    };
    this.messagelist.push(payload);

    this.client.send('reward',
          {
          room:this.id,
          id:this.client.getId(),
          from:window.localStorage.getItem("username"),
          to:this.rewardto,
          rewardid:id,
          rewardname:name,
          rewardvalue:value
        });
  }
}
