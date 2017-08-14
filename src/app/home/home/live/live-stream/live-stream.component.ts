import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { LoadJQService } from '../../../../load-jq.service';
import { LiveService } from '../live.service';
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
  mediaConfig = { audio: true, video: { mandatory: {}, optional: [] } };
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
  constructor(
    private httpService: HttpService,
    private liveService: LiveService,
    private route: ActivatedRoute,
    private loadJQService: LoadJQService) {
    this.client = liveService.getClient();//获得创建的问题
  }

  ngOnInit() {
    this.name = window.localStorage.getItem("username");
    this.avatorPath = window.localStorage.getItem("avatorPath");
    this.avator = window.localStorage.getItem("avator");
  }
  ngAfterContentInit() {
    this.camera.preview = window.document.getElementById("localVideo");
    const self = this;
    this.camera.start = function () {
      return requestUserMedia(self.mediaConfig).then(stream => {
        // console.log(stream);
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
      }
    });
  }

  startLive() {
    console.log(this.client);
    const self = this;
    if (this.cameraIsOn == false) {
      this.camera.start().then(result => {
        this.link = this.client.getId();
        this.client.send('readyToStream', { name: this.name });
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      this.camera.stop()
        .then(result => {
          this.client.send('leave');
          this.client.setLocalStream(null);
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

  send() {
    const payload = {
      "type": "message",
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
