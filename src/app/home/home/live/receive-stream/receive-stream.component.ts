import { Component, OnInit } from '@angular/core';
import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { HttpService } from '../../../../http.service';
import { LoadJQService } from '../../../../load-jq.service';
import { LiveService } from '../live.service';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;
declare var MediaRecorder: any;
@Component({
  selector: 'app-receive-stream',
  templateUrl: './receive-stream.component.html',
  styleUrls: ['./receive-stream.component.css'],
  providers: [HttpService, LoadJQService, LiveService]
})
export class ReceiveStreamComponent implements OnInit {
  remoteStreams = [];
  client: any;
  streamId = "";
  avator = "";
  avatorPath = "";
  say = "";
  messagelist = [];
  recording: boolean = false;
  mediaRecorder: any;
  recordedBlobs = [];
  remoteStream: any;
  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private liveSercie: LiveService,
    private loadJQService: LoadJQService) {
    this.client = liveSercie.getClient();//读取客户端的client
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.streamId = params["id"];
      if (this.streamId != undefined) {
        this.loadData();
        this.call(this.streamId);
      }
    });
    this.avatorPath = window.localStorage.getItem("avatorPath");
    this.avator = window.localStorage.getItem("avator");
  }

  ngAfterContentInit() {
    this.client.getSocket().on('message', function (message) {
      var type = message.type,
        from = message.from;
      if (message.type == "message") {
        self.messagelist.push(message);
      }
    });
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    const self = this;
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).
      then(function (stream) {
        self.remoteStream = stream;
      }).catch(function (err) {
        console.log('navigator.getUserMedia error: ', err);
      });
  }

  reload() {
    if (this.streamId) {
      this.loadData();
      this.view(this.streamId);
    }
  }

  send() {
    const payload = {
      "type": "message",
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
    } else {
      this.client.peerInit(stream.id);
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
}
