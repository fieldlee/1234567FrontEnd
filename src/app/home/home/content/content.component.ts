import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ForumInfo } from '../../../class/forum-info';
import { Comment } from '../../../class/comment';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  providers: [HttpService, LoadJQService]
})
export class ContentComponent implements OnInit {
  forum: ForumInfo;
  id: string;
  commentAvatorName: string;
  commentrepid: string;
  curComment: Comment;
  commentNumber: string = "0";
  commentList: Comment[] = [];
  commentContent: string;
  isSelfForum: boolean = false;
  forumList: ForumInfo[] = [];
  loadingable: boolean = true;
  isloading: boolean = false;
  page: Number = 1;
  hadSupport: boolean = false;
  hadAttent: boolean = false;
  isAdmin:boolean = false;
  constructor(private _location: Location,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private loadJqService: LoadJQService) {
    this.forum = new ForumInfo();
    this.curComment = new Comment();
    this.commentContent = "";
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      if (this.id != undefined) {
        this.httpService.getForumsById(this.id).then(resp => {
          if (resp) {
            resp.contentSafe = this.sanitizer.bypassSecurityTrustHtml(resp.content);
            this.forum = resp;
            // 读取相关的帖子
            this.httpService.getForumsByType(this.forum.type, "1").then(resp => {
              if (resp.success) {
                this.forumList = resp.results as ForumInfo[];
                var self = this;
                this.forumList = this.forumList.filter(function (item) {
                  return item._id != self.forum._id;
                });
              }
            });
            // 判断是否是自己的帖子
            if (this.forum.author == window.localStorage.getItem("username")) {
              this.isSelfForum = true;
            }

            //  获得关注信息
            const folwjson = { "username": window.localStorage.getItem("username"), "followusername": this.forum.author };
            this.httpService.getFollowByUser(folwjson).then(resp => {

              if (resp.success) {
                this.hadAttent = false;
              } else {
                this.hadAttent = true;
              }
            });
          }
        });
        //  获得帖子的评论
        this.httpService.getComment(this.id, this.page.toString()).then(resp => {
          console.log(resp);
          var comlist = new Array();
          for (var i = 0; i < resp.results.length; i++) {
            var tCom = resp.results[i] as Comment;
            if (tCom.subComments && tCom.subComments.length > 0) {
              for (var j = 0; j < tCom.subComments.length; j++) {
                tCom.subComments[j].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.subComments[j].content);
              }
            }
            resp.results[i].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.content);

          }
          this.commentList = resp.results as Comment[];
          this.commentNumber = resp.count.toString();
        });

      }
    })
    this.isAdmin = false;
    if(window.localStorage.getItem("admin") && window.localStorage.getItem("admin")!=null){
      this.isAdmin = true;
    }
  }
  goBack() {
    this._location.back();
  }

  share(type: string) {

  }

  support() {
    if (this.forum.support) {
      this.forum.support = (Number(this.forum.support) + 1).toString();
    } else {
      this.forum.support = "1";
    }

    this.httpService.supportForumById(this.id).then(resp => {
      var message = "成功收到您的赞";
      var type = "success";
      if (this.hadSupport == true) {
        message = "你已经赞过该帖子";
        type = "warning";
      }
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
      this.hadSupport = true;
      return;
    });
  }

  collect() {
    if (window.localStorage.getItem("username")) {
      var body = {
        "avatorPath": this.forum.avatorPath,
        "avator": this.forum.avator,
        "forumId": this.forum._id,
        "author": this.forum.author,
        "title": this.forum.title,
        "username": window.localStorage.getItem("username")
      };
      this.httpService.collectForum(body).then(resp => {
        var message = "";
        var type = "";
        if (resp.success) {
          if (this.forum.collect) {
            this.forum.collect = (Number(this.forum.collect) + 1).toString();
          } else {
            this.forum.collect = "1";
          }
          message = "成功收藏了此帖子";
          type = 'success';
        } else {
          message = resp.message;
          type = "warning";
        }
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
    } else {
      $.notify("请先登录后，再收藏此帖子", {
        type: "warning",
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
  }

  topup(id: string) {
    this.httpService.topupForumById(id).then(resp => {
      var message = "";
      var type = "success";
      if (resp.success) {
        message = resp.message;
        type = "success";
      } else {
        message = resp.message;
        type = "warning";
      }
      $.notify("成功置顶该帖子", {
        type: "success",
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

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadJqService.froalaEditorComment('forumComment');
    this.loadJqService.froalaEditorComment('Commentconent');

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
          self.httpService.getComment(self.id, self.page.toString()).then(resp => {
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
  replyComment(id, name) {
    this.commentrepid = id;
    this.commentAvatorName = name;
  }
  supportComment(id) {
    console.log(id);
    for (var i = 0; i < this.commentList.length; i++) {
      if (this.commentList[i]._id == id) {
        if (this.commentList[i].support) {
          this.commentList[i].support = (Number(this.commentList[i].support) + 1).toString();
        } else {
          this.commentList[i].support = "1";
        }

      }
    }
    this.httpService.supportCommentById(id).then(resp => {
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
  // 提交reply
  repSubmit() {
    if (window.localStorage.getItem("username")=="" || window.localStorage.getItem("username") == undefined) {
      $('#loginModel').appendTo("body").modal('show');
      return;
    }
    // this.commentContent = $("#Commentconent").froalaEditor('html.get', true);
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
    this.httpService.createComment(this.curComment).then(resp => {
      this.curComment = new Comment();
      $('#Commentconent').froalaEditor('html.set', '');//清空回复内容
      $('#commentbymodal').modal('hide'); //隐藏modal
      // 获得帖子的评论
      this.page = 1;
      this.httpService.getComment(this.id, this.page.toString()).then(resp => {
        for (var i = 0; i < resp.results.length; i++) {
          var tCom = resp.results[i] as Comment;
          if (tCom.subComments && tCom.subComments.length > 0) {
            for (var j = 0; j < tCom.subComments.length; j++) {
              tCom.subComments[j].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.subComments[j].content);
            }
          }
          resp.results[i].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.content);
        }
        this.commentList = resp.results as Comment[];
        this.commentNumber = resp.count.toString();
      })
    })
  };

  // 提交评论
  submitComment() {

    if (window.localStorage.getItem("username")=="" || window.localStorage.getItem("username") == undefined) {
      $('#loginModel').appendTo("body").modal('show');
      return;
    }

    this.commentContent = $("#forumComment").froalaEditor('html.get', true);
    if (this.commentContent == undefined || this.commentContent == "") {
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
    console.log(this.commentContent);
    this.curComment.content = this.commentContent;
    this.curComment.author = window.localStorage.getItem("username");
    this.curComment.issueTime = new Date();
    this.curComment.parentId = this.id;
    this.httpService.createComment(this.curComment).then(resp => {
      this.curComment = new Comment();
      this.commentContent = "";
      $('#forumComment').froalaEditor('html.set', '');
      // 获得帖子的评论
      this.page = 1;
      this.httpService.getComment(this.id, this.page.toString()).then(resp => {
        for (var i = 0; i < resp.results.length; i++) {
          var tCom = resp.results[i] as Comment;
          if (tCom.subComments && tCom.subComments.length > 0) {
            for (var j = 0; j < tCom.subComments.length; j++) {
              tCom.subComments[j].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.subComments[j].content);
            }
          }
          resp.results[i].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.content);
        }
        this.commentList = resp.results as Comment[];
      })
    })
  }
}
