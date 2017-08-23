import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
import { LoadJQService } from '../../../../load-jq.service';
import { Score } from '../../../../class/score';
import { Comment } from '../../../../class/comment';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;
declare var pt: any;
declare var bt: any;
declare var bp: any;

@Component({
  selector: 'app-scoreplay',
  templateUrl: './scoreplay.component.html',
  styleUrls: ['./scoreplay.component.css'],
  providers: [HttpService, LoadJQService, ContantService]
})
export class ScoreplayComponent implements OnInit {
  l1: any;
  scoreid: string;
  score: Score;
  relateScores:Score[]=[];
  mp3Path: string;
  filesPath: string[] = [];
  backGroundPath: string;
  counter: Number = 0;
  curPage: Number = 0;
  mp3Player: any;
  playbtn: any;
  commentList: Comment[]=[];
  page: Number = 1;
  scoreComment: string;
  curComment: Comment;
  commentrepid: string;
  commentAvatorName: string;
  loadingable: boolean = true;
  isloading: boolean = false;
  hadAttent: boolean = false;
  isSelfForum:boolean = false;
  constructor(private contantService: ContantService,
    private sanitizer: DomSanitizer,
    private loadJq: LoadJQService,
    private httpService: HttpService,
    private route: ActivatedRoute) { 
      this.curComment = new Comment();
      this.score = new Score();
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.scoreid = params["id"];
      if (this.scoreid != undefined) {
        this.httpService.getScoreById(this.scoreid).then(resp => {
          console.log(resp);
          if (resp.success) {
            this.score = resp.data as Score;
            this.mp3Path =  this.score.mp3.path;
            this.preloadMP3();//预加载mp3
            this.filesPath = [];
            this.curPage = 0;
            this.page = 1;
            for (var index = 0; index < this.score.files.length; index++) {
              var element = this.score.files[index];
              this.filesPath.push( element.path);
            }
           
            document.getElementById("score").style.backgroundImage = `url()`;
            if (this.filesPath.length > 0) {
              const page = parseInt(this.curPage.toString());
              this.backGroundPath = this.filesPath[page];
              
              document.getElementById("score").style.backgroundImage = `url(${this.backGroundPath})`;
              this.counter = this.filesPath.length;
            }
            this.curPage = 0;
            this.preload();//预加载曲谱
            this.playshowArea();
            // 读取相关乐谱
            this.httpService.getScoresByType(this.score.type,this.page.toString()).then(resp=>{
              if(resp.success){
                this.relateScores = resp.results as Score[];
                const curscoreid = this.scoreid;
                this.relateScores = this.relateScores.filter(function(item){
                  return item._id != curscoreid;
                })
              }
            })
          }
        });
        // 获得评论
        this.loadComment(this.page.toString());
        // 判断是否是自己的帖子
        if (this.score.author == window.localStorage.getItem("username")) {
          this.isSelfForum = true;
        }

        //  获得关注信息
        const folwjson = { "username": window.localStorage.getItem("username"), "followusername": this.score.author };
        this.httpService.getFollowByUser(folwjson).then(resp => {

          if (resp.success) {
            this.hadAttent = false;
          } else {
            this.hadAttent = true;
          }
        });
      }
    });
  }

  loadComment(page) {
    this.httpService.getScoreComment(this.scoreid, page).then(resp => {
      if (resp.success) {
        for (var i = 0; i < resp.results.length; i++) {
          var tCom = resp.results[i] as Comment;
          if (tCom.subComments && tCom.subComments.length > 0) {
            for (var j = 0; j < tCom.subComments.length; j++) {
              tCom.subComments[j].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.subComments[j].content);
            }
          }
          resp.results[i].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.content);
        }
        if (page == "1") {
          this.commentList = resp.results as Comment[];
        }
        else {
          var comments = resp.results as Comment[];
          this.commentList = this.commentList.concat(comments);
        }
      }
    });
  }

  preloadMP3() {
    this.mp3Player = document.getElementById("mp3play");
    this.mp3Player.src = this.mp3Path;
    this.mp3Player.load();
    this.buildMp3play();
  }
  preload() {
    var images = new Array(this.filesPath.length);
    for (var index = 0; index < this.filesPath.length; index++) {
      var element = this.filesPath[index];
      images[index] = new Image();
      images[index].src = element;
    }
  }

  getClickPosition($event) {
    var e = $event;
    this.mp3Player = document.getElementById("mp3play");
    var curpageStartTime = 0.0;
    var start = 1;

    if (this.curPage > 0) {
      if (pt[parseInt(this.curPage.toString())]) {
        curpageStartTime = pt[parseInt(this.curPage.toString())].e;
      }

      // 循环判断
      for (var index = 1; index < bt.length; index++) {
        var element = bt[index];
        // console.log(element.e , this.mp3Player.currentTime*10);
        if (element.e > curpageStartTime * 10) {
          start = element.b;
          break;
        }
      }
    }

    var parentOffset = $("#mainscore").offset();
    //or $(this).offset(); if you really just want the current element's offset
    var relX = e.pageX - parentOffset.left;
    var relY = e.pageY - parentOffset.top;
    // console.log(relX,relY);
    const sco = document.getElementById("score");
    var u = window.getComputedStyle(sco).getPropertyValue("width");
    var v = window.getComputedStyle(sco).getPropertyValue("height");
    var toppercwidth = window.getComputedStyle(sco).getPropertyValue("width");
    var topwidth = (650 / parseFloat(toppercwidth.toString()));

    var leftpercwidth = window.getComputedStyle(sco).getPropertyValue("height");
    var leftwidth = (841 / parseFloat(leftpercwidth.toString()));
    // 
    var n = 0, t = 0, p = 0;
    n += e.currentTarget.offsetLeft - e.currentTarget.scrollLeft + e.currentTarget.clientLeft;
    t += e.currentTarget.offsetTop - e.currentTarget.scrollTop + e.currentTarget.clientTop;

    var position = { x: relX, y: relY };
    for (var index = start; index < bp.length; index++) {
      var element = bp[index];
      var top = ((element.t) - (30)) / leftwidth;
      var left = ((element.l) - 1) / topwidth;
      var width = (((element.w) + (2)) / topwidth);
      var height = (((element.h) + (60)) / topwidth);
      // console.log("top:"+top,"left:"+left,"down:"+(top+height),"right:"+(left+width));
      if (position.x > left && position.x < (left + width) && position.y > top && position.y < (top + height)) {
        if (index == 1) {
          this.mp3Player.currentTime = 0;
        } else {
          this.mp3Player.currentTime = (bt[index - 1].e) / 10 + 0.01;
        }
        this.mp3Player.play();
        this.playbtn.setPlayState('pause');
        break;
      }
    }
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    // document.getElementById("score").addEventListener('click', this.getClickPosition, false);
    this.loadJq.froalaEditorComment('scoreComment');
    this.loadJq.froalaEditorComment('Commentconent');
    //  用户评论翻屏
    var win = $(window);
    var self = this;
    var commentDiv = $("#forumCommentDiv");
    // Each time the user scrolls
    win.scroll(function () {
      if (self.loadingable == true && self.isloading == false) {

        if ($(window).scrollTop() + $(window).height() >= commentDiv.height() + commentDiv.offset().top) {
          self.isloading = true;
          self.page = parseInt(self.page.toString()) + 1;
          //  获得帖子的评论
          console.log(self.page);
          self.httpService.getScoreComment(self.scoreid, self.page.toString()).then(resp => {
            console.log(resp);
            var comlist = new Array();
            if (resp.results.length == 0) {
              self.isloading = false;
              self.loadingable = false;
            } else {
              self.isloading = false;
              for (var i = 0; i < resp.results.length; i++) {
                var tCom = resp.results[i] as Comment;
                if (tCom.subComments && tCom.subComments.length > 0) {
                  for (var j = 0; j < tCom.subComments.length; j++) {
                    tCom.subComments[j].contentSafe = self.sanitizer.bypassSecurityTrustHtml(tCom.subComments[j].content);
                  }
                }
                resp.results[i].contentSafe = self.sanitizer.bypassSecurityTrustHtml(tCom.content);
              }
              self.commentList = self.commentList.concat(resp.results as Comment[]);
              // this.commentNumber = resp.count.toString();
            }

          })
        }
      }
    });
  }

  playshowArea() {
    if (this.score.bpt.trim().length > 0) {
      eval.call(null, this.score.bpt.trim());
      this.l1 = document.getElementById("layer1");
    }
  }

  prepage() {
    this.mp3Player = document.getElementById("mp3play");
    if (this.curPage >= 1) {
      this.curPage = parseInt(this.curPage.toString()) - 1;
      const page = parseInt(this.curPage.toString());
      this.backGroundPath = this.filesPath[page];
      document.getElementById("score").style.backgroundImage = `url(${this.backGroundPath})`;
      // 循环判断时间
      for (var index = 1; index < pt.length; index++) {
        var element = pt[index];
        if (page + 1 == index) {
          if (index == 1) {
            this.mp3Player.currentTime = 0;
          } else {
            this.mp3Player.currentTime = pt[index - 1].e;
          }
        } else {
          continue;
        }
      }

    }
  }
  nextpage() {
    this.mp3Player = document.getElementById("mp3play");
    if (this.curPage < this.counter) {
      this.curPage = parseInt(this.curPage.toString()) + 1;
      const page = parseInt(this.curPage.toString());
      this.backGroundPath = this.filesPath[page];
      document.getElementById("score").style.backgroundImage = `url(${this.backGroundPath})`;
      // 循环判断时间
      for (var index = 1; index < pt.length; index++) {
        var element = pt[index];
        if (page + 1 == index) {
          if (index == 1) {
            this.mp3Player.currentTime = 0;
          } else {
            this.mp3Player.currentTime = pt[index - 1].e;
          }
        } else {
          continue;
        }
      }

    }
  }

  supportScore() {
    if (this.score.support) {
      this.score.support = (Number(this.score.support) + 1).toString();
    } else {
      this.score.support = "1";
    }
    this.httpService.supportScoreById(this.scoreid).then(resp => {
      var message = "成功收到您的赞";
      var type = "success";
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
    })
  }

  collect() {
    // if (window.localStorage.getItem("username")) {
    //   var body = {
    //     "avatorPath": this.forum.avatorPath,
    //     "avator": this.forum.avator,
    //     "forumId": this.forum._id,
    //     "author": this.score.author,
    //     "title": this.score.title,
    //     "username": window.localStorage.getItem("username")
    //   };
    //   this.httpService.collectForum(body).then(resp => {
    //     var message = "";
    //     var type = "";
    //     if (resp.success) {
    //       if (this.forum.collect) {
    //         this.forum.collect = (Number(this.forum.collect) + 1).toString();
    //       } else {
    //         this.forum.collect = "1";
    //       }
    //       message = "成功收藏了此帖子";
    //       type = 'success';
    //     } else {
    //       message = resp.message;
    //       type = "warning";
    //     }
    //     $.notify(message, {
    //       type: type,
    //       placement: {
    //         from: 'bottom',
    //         align: 'center'
    //       }
    //     }, {
    //         animate: {
    //           enter: 'animated lightSpeedIn',
    //           exit: 'animated lightSpeedOut'
    //         }
    //       });
    //     return;
    //   })
    // } else {
    //   $.notify("请先登录后，再收藏此帖子", {
    //     type: "warning",
    //     placement: {
    //       from: 'bottom',
    //       align: 'center'
    //     }
    //   }, {
    //       animate: {
    //         enter: 'animated lightSpeedIn',
    //         exit: 'animated lightSpeedOut'
    //       }
    //     });
    //   return;
    // }
  }

  addAttention(username) {
    const folwjson = { "username": window.localStorage.getItem("username"), "followusername": username };

    this.httpService.createFollow(folwjson).then(resp => {
      if (resp.success) {
        $.notify(resp.message, {
          type: 'success',
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
      } else {
        $.notify(resp.message, {
          type: 'warning',
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
    });
  }

  supportComment(id) {
    for (var i = 0; i < this.commentList.length; i++) {
      if (this.commentList[i]._id == id) {
        if (this.commentList[i].support) {
          this.commentList[i].support = (Number(this.commentList[i].support) + 1).toString();
        } else {
          this.commentList[i].support = "1";
        }
      }
    }
    this.httpService.supportScoreCommentById(id).then(resp => {
      if (resp.success) {
        $.notify("成功收到您的赞", {
          type: 'success',
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
    });
  }

  replyComment(id, name) {
    this.commentrepid = id;
    this.commentAvatorName = name;
  }

  repSubmit() {
    if ($("#Commentconent").froalaEditor('html.get', true) == undefined || $("#Commentconent").froalaEditor('html.get', true) == "") {
      $.notify("请输入评论内容", {
        type: 'warning',
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

    this.curComment.content = $("#Commentconent").froalaEditor('html.get', true);
    this.curComment.author = window.localStorage.getItem("username");
    this.curComment.issueTime = new Date();
    this.curComment.parentId = this.commentrepid;
    this.httpService.createScoreComment(this.curComment).then(resp => {
      this.curComment = new Comment();
      $('#Commentconent').froalaEditor('html.set', '');//清空回复内容
      $('#commentbymodal').modal('hide'); //隐藏modal
      // 获得帖子的评论
      this.page = 1;
      this.loadComment(this.page.toString());
    })
  };
  // 提交评论
  submitComment() {
    this.scoreComment = $("#scoreComment").froalaEditor('html.get', true);
    if (this.scoreComment == undefined || this.scoreComment == "") {
      $.notify("请输入评论内容", {
        type: 'warning',
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

    this.curComment.content = this.scoreComment;
    this.curComment.author = window.localStorage.getItem("username");
    this.curComment.issueTime = new Date();
    this.curComment.parentId = this.scoreid;
    this.httpService.createScoreComment(this.curComment).then(resp => {
      this.curComment = new Comment();
      this.scoreComment = "";
      $('#scoreComment').froalaEditor('html.set', '');
      this.page = 1;
      this.loadComment(this.page.toString());
    })
  }

  elementInViewport(el) {

    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;
    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }
    return (
      top >= window.pageYOffset && left >= window.pageXOffset && (top + height) <= (window.pageYOffset + window.innerHeight) && (left + width) <= (window.pageXOffset + window.innerWidth));
  }

  updatePlay(time) {
    const sco = document.getElementById("score");
    var u = window.getComputedStyle(sco).getPropertyValue("width");
    var v = window.getComputedStyle(sco).getPropertyValue("height");
    var toppercwidth = window.getComputedStyle(sco).getPropertyValue("width");
    var topwidth = (650 / parseFloat(toppercwidth.toString()));

    var leftpercwidth = window.getComputedStyle(sco).getPropertyValue("height");
    var leftwidth = (841 / parseFloat(leftpercwidth.toString()));

    for (var aaa = 1; aaa < pt.length; aaa++) {

      if (aaa == 1 && pt[1].e > time) {
        this.curPage = 0;
        const page = parseInt(this.curPage.toString());
        this.backGroundPath = this.filesPath[page];
        sco.style.backgroundImage = `url(${this.backGroundPath})`;
      } else if (aaa > 1 && pt[aaa - 1].e < time && time < pt[aaa].e) {
        this.curPage = pt[aaa].p - 1;
        console.log(this.curPage);
        const page = parseInt(this.curPage.toString());
        this.backGroundPath = this.filesPath[page];
        sco.style.backgroundImage = `url(${this.backGroundPath})`;
      } else {
        continue;
      }
    }

    for (var index = 1; index < bt.length; index++) {
      if (index > 1) {
        var elementpre = bt[index - 1];
      }
      var element = bt[index];

      if ((elementpre && elementpre.e < time * 10 && index > 1) || (index == 1 && element.e > time * 10)) {
        var l = bp[element.b];
        this.l1.style.visibility = 'visible';
        this.l1.style.top = ((l.t) - (30)) / leftwidth + 'px';
        this.l1.style.left = ((l.l) - 1) / topwidth + 'px';
        this.l1.style.width = (((l.w) + (2)) / topwidth) + 'px';
        this.l1.style.height = (((l.h) + (60)) / topwidth) + 'px';
        // console.log("l1.style.top:" + this.l1.style.top, "l1.style.left:" + this.l1.style.left, "l1.style.width:" + this.l1.style.width, "l1.style.height:" + this.l1.style.height);
        sco.style.backgroundRepeat = 'no-repeat';
        sco.style.top = '0';
        document.getElementById('mainscore').style.height = '100%';
        // 滚屏显示可见曲谱
        console.log(this.elementInViewport(this.l1));
        if (this.elementInViewport(this.l1) == false) {
          this.l1.scrollIntoView(false);
        }
      } else {
        continue;
      }
    }
    // 播放完成
    this.mp3Player = document.getElementById("mp3play");
    // console.log(this.mp3Player.duration);
    if (time >= this.mp3Player.duration) {
      this.curPage = 0;
      const page = parseInt(this.curPage.toString());
      this.backGroundPath = this.filesPath[page];
      sco.style.backgroundImage = `url(${this.backGroundPath})`;
      this.l1.style.visibility = 'hidden';
    }
  }

  buildMp3play() {
    const self = this;
    $('audio[controls]').before(function () {
      var song = this;
      song.controls = false;

      var player_box = document.createElement('div');
      $(player_box).addClass($(song).attr('class') + ' well container-fluid playa');

      var data_sec = document.createElement('section');
      $(data_sec).addClass('collapsing center-block row col-sm-12');

      var toggle_holder = document.createElement('div');
      $(toggle_holder).addClass('btn-group center-block row col-sm-12');

      var data_toggle = document.createElement('button');
      $(data_toggle).html('<i class="glyphicon glyphicon-align-justify" style="top:-3px"></i>');
      $(data_toggle).addClass('btn btn-default btn-lg btn-block row col-sm-12');
      $(data_toggle).attr('style', 'opacity:0.3');
      $(data_toggle).click(function () { $(data_sec).collapse('toggle'); });
      $(data_toggle).attr('title', 'Details');
      $(data_toggle).tooltip({ 'container': 'body', 'placement': 'top', 'html': true });
      $(toggle_holder).append(data_toggle);

      var data_table = document.createElement('table');
      $(data_table).addClass('table table-condensed');

      var player = document.createElement('section');
      $(player).addClass('btn-group  center-block row  col-sm-12');

      var load_error = function () {
        // console.log('error');
        $(player_box).find('.btn').addClass('disabled');
        $(player_box).find('input[type="range"]').hide();
        $(player_box).find('.glyphicon-refresh').text('Error');
        $(player_box).find('.glyphicon-refresh').parent().attr('title', 'There was an error loading the audio.');
        $(player_box).find('.glyphicon-refresh').parent().tooltip('fixTitle');
        $(player_box).find('.glyphicon-refresh').removeClass('glyphicon glyphicon-refresh spin');
      }; // load_error

      var addPlay = function () {
        var play: any = document.createElement('button');
        self.playbtn = play; //将play button 赋值给playbtn
        $(play).addClass('btn  btn-default disabled col-sm-1');

        play.setPlayState = function (toggle) {
          $(play).removeClass('disabled');
          if (toggle === 'play') {
            $(play).html('<i class="glyphicon glyphicon-play"></i>');
            $(play).click(function () {
              song.play();
            });
          }
          if (toggle === 'pause') {
            $(play).html('<i class="glyphicon glyphicon-pause"></i>');
            $(play).click(function () {
              song.pause();
            });
          }
        }; // setPlayState

        // media events from the audio element will trigger rebuilding the play button
        $(song).on('play', function () { play.setPlayState('pause'); });
        $(song).on('canplay', function () { play.setPlayState('play'); });
        $(song).on('pause', function () { play.setPlayState('play'); });

        var timeout = 0;

        var loadCheck = setInterval(function () {
          if (isNaN(song.duration) === false) {
            play.setPlayState('play');
            clearInterval(loadCheck);
            return true;
          }
          if (song.networkState === 3 || timeout === 75) {
            load_error();
            clearInterval(loadCheck);
            return false;
          }
          timeout++;
        }, 50);
        $(player).append(play);
      }; // addPlay

      var addSeek = function () {
        var seek: any = document.createElement('input');
        $(seek).attr({
          'type': 'range',
          'min': 0,
          'value': 0,
          'class': 'seek'
        });

        seek.progress = function () {
          var i, bufferedstart, bufferedend;
          var bg = 'rgba(223, 240, 216, 1) 0%';
          bg += ', rgba(223, 240, 216, 1) ' + ((song.currentTime / song.duration) * 100) + '%';
          bg += ', rgba(223, 240, 216, 0) ' + ((song.currentTime / song.duration) * 100) + '%';
          for (i = 0; i < song.buffered.length; i++) {
            if (song.buffered.end(i) > song.currentTime &&
              isNaN(song.buffered.end(i)) === false &&
              isNaN(song.buffered.start(i)) === false) {

              if (song.buffered.end(i) < song.duration) {
                bufferedend = ((song.buffered.end(i) / song.duration) * 100);
              } else {
                bufferedend = 100;
              }
              if (song.buffered.start(i) > song.currentTime) {
                bufferedstart = ((song.buffered.start(i) / song.duration) * 100);
              } else {
                bufferedstart = ((song.currentTime / song.duration) * 100);
              }
              bg += ', rgba(217, 237, 247, 0) ' + bufferedstart + '%';
              bg += ', rgba(217, 237, 247, 1) ' + bufferedstart + '%';
              bg += ', rgba(217, 237, 247, 1) ' + bufferedend + '%';
              bg += ', rgba(217, 237, 247, 0) ' + bufferedend + '%';
            }
          }
          $(seek).css('background', '-webkit-linear-gradient(left, ' + bg + ')');
          //These may be re-enabled when/if other browsers support the background like webkit
          //$(seek).css('background','-o-linear-gradient(left,  ' + bg + ')');
          //$(seek).css('background','-moz-linear-gradient(left,  ' + bg + ')');
          //$(seek).css('background','-ms-linear-gradient(left,  ' + bg + ')');
          //$(seek).css('background','linear-gradient(to right,  ' + bg + ')');
          $(seek).css('background-color', '#ddd');
        }; // seek.progress

        seek.set = function () {
          $(seek).val(song.currentTime);
          seek.progress();
        };

        seek.slide = function () {
          song.currentTime = $(seek).val();
          seek.progress();
        };

        seek.init = function () {
          $(seek).attr({
            'max': song.duration,
            'step': song.duration / 100
          });
          seek.set();
        };

        seek.reset = function () {
          $(seek).val(0);
          song.currentTime = $(seek).val();
          if (!song.loop) {
            song.pause();
          } else {
            song.play();
          }
        };

        var seek_wrapper = document.createElement('div');
        $(seek_wrapper).addClass('btn btn-default col-sm-4 hidden-xs');
        $(seek_wrapper).append(seek);

        // bind seek / position slider events
        $(seek).on('change', seek.slide);

        // bind audio element events to trigger seek slider updates
        $(song).on('timeupdate', seek.init);
        $(song).on('loadedmetadata', seek.init);
        $(song).on('loadeddata', seek.init);
        $(song).on('progress', seek.init);
        $(song).on('canplay', seek.init);
        $(song).on('canplaythrough', seek.init);
        $(song).on('ended', seek.reset);
        if (song.readyState > 0) {
          seek.init();
        }

        $(player).append(seek_wrapper);
      }; // addSeek

      var addTime = function () {
        var time: any = document.createElement('button');
        $(time).addClass('btn btn-default col-sm-3');
        $(time).tooltip({ 'container': 'body', 'placement': 'right', 'html': true });

        time.twodigit = function (myNum) {
          return ('0' + myNum).slice(-2);
        }; // time.twodigit

        time.timesplit = function (a) {
          if (isNaN(a)) {
            return '<i class="glyphicon glyphicon-refresh spin"></i>';
          }
          var hours = Math.floor(a / 3600);
          var minutes = Math.floor(a / 60) - (hours * 60);
          var seconds = Math.floor(a) - (hours * 3600) - (minutes * 60);
          var timeStr = time.twodigit(minutes) + ':' + time.twodigit(seconds);
          if (hours > 0) {
            timeStr = hours + ':' + timeStr;
          }
          return timeStr;
        }; // time.timesplit

        time.showtime = function () {
          var position_title = 'Click to Reset<hr style="padding:0; margin:0;" />Position: ';
          var length_title = 'Click to Reset<hr style="padding:0; margin:0;" />Length: ';
          if (!song.paused) {
            self.updatePlay(song.currentTime);
            $(time).html(time.timesplit(song.currentTime));
            $(time).attr({ 'title': length_title + (time.timesplit(song.duration)) });
          } else {
            $(time).html(time.timesplit(song.duration));
            $(time).attr({ 'title': position_title + (time.timesplit(song.currentTime)) });
          }
          $(time).tooltip('fixTitle');
        }; // time.showtime

        $(time).click(function () {
          song.pause();
          song.currentTime = 0;
          time.showtime();
          $(time).tooltip('fixTitle');
          $(time).tooltip('show');
        }); // time.click

        $(time).tooltip('show');
        $(song).on('loadedmetadata', time.showtime);
        $(song).on('loadeddata', time.showtime);
        $(song).on('progress', time.showtime);
        $(song).on('canplay', time.showtime);
        $(song).on('canplaythrough', time.showtime);
        $(song).on('timeupdate', time.showtime);
        if (song.readyState > 0) {
          time.showtime();
        } else {
          $(time).html('<i class="glyphicon glyphicon-refresh spin"></i>');
        }
        $(player).append(time);
      }; // addTime

      var addMute = function () {
        var mute: any = document.createElement('button');
        $(mute).addClass('btn btn-default  col-sm-1');

        mute.checkVolume = function () {
          if (song.volume > 0.5 && !song.muted) {
            $(mute).html('<i class="glyphicon glyphicon-volume-up"></i>');
          } else if (song.volume < 0.5 && song.volume > 0 && !song.muted) {
            $(mute).html('<i class="glyphicon glyphicon-volume-down"></i>');
          } else {
            $(mute).html('<i class="glyphicon glyphicon-volume-off"></i>');
          }
        }; // mute.checkVolume

        $(mute).click(function () {
          if (song.muted) {
            song.muted = false;
            song.volume = song.oldvolume;
          } else {
            song.muted = true;
            song.oldvolume = song.volume;
            song.volume = 0;
          }
          mute.checkVolume();
        }); // mute.click(

        mute.checkVolume();
        $(song).on('volumechange', mute.checkVolume);
        $(player).append(mute);
      }; // addMute

      var addVolume = function () {
        var volume: any = document.createElement('input');
        $(volume).attr({
          'type': 'range',
          'min': 0,
          'max': 1,
          'step': 1 / 100,
          'value': 1
        });

        volume.slide = function () {
          song.muted = false;
          song.volume = $(volume).val();
        }; // volume.slide

        volume.set = function () {
          $(volume).val(song.volume);
        };

        var vol_wrapper = document.createElement('div');
        $(vol_wrapper).addClass('btn  btn-default  row col-sm-3  hidden-xs');
        $(vol_wrapper).append(volume);
        $(volume).on('change', volume.slide);
        $(song).on('volumechange', volume.set);
        $(player).append(vol_wrapper);

      }; // addVolume

      var addAlbumArt = function () {
        var albumArt = document.createElement('img');
        $(albumArt).addClass('thumbnail');
        $(albumArt).attr('src', $(song).data('infoAlbumArt'));
        $(data_sec).append(albumArt);
      }; // addAlbumArt

      var addInfo = function (title, dataId) {
        var row = document.createElement('tr');
        var head = document.createElement('th');
        var data = document.createElement('td');
        $(head).html(title);
        $(data).html($(song).data(dataId));
        $(row).append(head);
        $(row).append(data);
        $(data_table).append(row);
      }; // addInfo

      var addData = function () {
        // jslint will complain about our use of `typeof` but 
        // it's the only way not to raise an error by referencing 
        // a nnon-existent data-* variable 
        if (typeof ($(song).data('infoAlbumArt')) !== 'undefined') {
          addAlbumArt();
        }
        if (typeof ($(song).data('infoArtist')) !== 'undefined') {
          addInfo('Artist', 'infoArtist');
        }
        if (typeof ($(song).data('infoTitle')) !== 'undefined') {
          addInfo('Title', 'infoTitle');
        }
        if (typeof ($(song).data('infoAlbumTitle')) !== 'undefined') {
          addInfo('Album', 'infoAlbumTitle');
        }
        if (typeof ($(song).data('infoLabel')) !== 'undefined') {
          addInfo('Label', 'infoLabel');
        }
        if (typeof ($(song).data('infoYear')) !== 'undefined') {
          addInfo('Year', 'infoYear');
        }
        if ($(data_table).html() !== '') {
          $(data_sec).append(data_table);
          $(player_box).append(toggle_holder);
          $(player_box).append(data_sec);
        }
      }; // addData

      var addPlayer = function () {
        if ($(song).data('play') !== 'off') {
          addPlay();
        }
        if ($(song).data('seek') !== 'off') {
          addSeek();
        }
        if ($(song).data('time') !== 'off') {
          addTime();
        }
        if ($(song).data('mute') !== 'off') {
          addMute();
        }
        if ($(song).data('volume') !== 'off') {
          addVolume();
        }
        $(player_box).append(player);
      }; // addPlayer

      var addAttribution = function () {
        var attribution = document.createElement('div');
        $(attribution).addClass('row col-sm-10 col-sm-offset-1');
        if (typeof ($(song).data('infoAttLink')) !== 'undefined') {
          var attribution_link = document.createElement('a');
          $(attribution_link).addClass('text-muted btn btn-link btn-sm');
          $(attribution_link).attr('href', $(song).data('infoAttLink'));
          $(attribution_link).html($(song).data('infoAtt'));
          $(attribution).append(attribution_link);
        } else {
          $(attribution).html($(song).data('infoAtt'));
        }
        $(player_box).append(attribution);
      }; // addAttribution

      var fillPlayerBox = function () {
        addData();
        addPlayer();
        if (typeof ($(song).data('infoAtt')) !== 'undefined') {
          addAttribution();
        }
      }; // fillPlayerBox

      fillPlayerBox();
      $(song).on('error', function () {
        load_error();
      });
      return player_box;
    });
  }
}
