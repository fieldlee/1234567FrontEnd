import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { News } from '../../../class/news';
import { Comment } from '../../../class/comment';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';

import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-newcontent',
  templateUrl: './newcontent.component.html',
  styleUrls: ['./newcontent.component.css'],
  providers: [HttpService, LoadJQService]
})
export class NewcontentComponent implements OnInit {
  news: News;
  lastNews: News[] = [];
  id: string;
  commentAvatorName: string;
  commentrepid: string;
  curComment: Comment;
  commentList: Comment[] = [];
  commentContent: string;
  isSelfForum: boolean = false;
  loadingable: boolean = true;
  isloading: boolean = false;
  page: Number = 1;
  hadAttent: boolean = false;
  constructor(private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private httpService: HttpService,
    private loadJqService: LoadJQService) {
    this.news = new News();
    this.curComment = new Comment();
    this.commentContent = "";
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      if (this.id != undefined) {
        this.httpService.getNewsById(this.id).then(resp => {
          if (resp) {
            console.log(resp);
            resp.contentSafe = this.sanitizer.bypassSecurityTrustHtml(resp.content);
            this.news = resp;

            var self = this;
            this.httpService.getNews("1").then(resp => {
              this.lastNews = resp;
              this.lastNews = this.lastNews.filter(function (item) {
                return item._id != self.news._id;
              })
            });

            // 判断是否是自己的帖子
            if (this.news.author == window.localStorage.getItem("username")) {
              this.isSelfForum = true;
            }

            //  获得关注信息
            const folwjson = { "username": window.localStorage.getItem("username"), "followusername": this.news.author };
            this.httpService.getFollowByUser(folwjson).then(resp => {
              console.log(resp);
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

          for (var i = 0; i < resp.results.length; i++) {
            var tCom = resp.results[i] as Comment;
            if (tCom.subComments && tCom.subComments.length > 0) {
              for (var j = 0; j < tCom.subComments.length; j++) {
                tCom.subComments[j].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.subComments[j].content);
              }
            }
            resp.results[i].contentSafe = this.sanitizer.bypassSecurityTrustHtml(tCom.content);
          }
          this.commentList = resp.results;
        })
      }
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
    var commentDiv = $("#newsCommentDiv");
    // Each time the user scrolls
    win.scroll(function () {
      if (self.loadingable == true && self.isloading == false) {
        if ($(window).scrollTop() + $(window).height() >= commentDiv.height() + commentDiv.offset().top) {
          self.isloading = true;
          self.page = parseInt(self.page.toString()) + 1;
          //  获得帖子的评论

          self.httpService.getComment(self.id, self.page.toString()).then(resp => {

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
    console.log(folwjson);
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


  collect() {
    if (window.localStorage.getItem("username")) {
      var body = {
        "avatorPath": this.news.avatorPath,
        "avator": this.news.avator,
        "newsId": this.news._id,
        "author": this.news.author,
        "title": this.news.title,
        "username": window.localStorage.getItem("username")
      };
      this.httpService.collectNews(body).then(resp => {
        var message = "";
        var type = "";
        if (resp.success) {
          if (this.news.collect) {
            this.news.collect = (Number(this.news.collect) + 1).toString();
          } else {
            this.news.collect = "1";
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

  support() {
    if (this.news.support) {
      this.news.support = (Number(this.news.support) + 1).toString();
    } else {
      this.news.support = "1";
    }
    this.httpService.supportNewsById(this.id).then(resp => {
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
        this.commentList = resp.results;
      })
    })
  };

  // 提交评论
  submitComment() {
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
        this.commentList = resp.results;
      })
    })
  }
}


