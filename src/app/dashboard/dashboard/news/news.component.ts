import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { News } from '../../../class/news';
declare var BootstrapDialog: any;
declare var $: any;
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [HttpService, LoadJQService]
})
export class NewsComponent implements OnInit {
  editNews: News;
  newses: News[];
  constructor(private httpService: HttpService, private loadJqService: LoadJQService) {
    this.editNews = new News();
  }

  ngOnInit() {
    const self = this;
    this.loadJqService.froalaEditor("newsContent", function (imageurl: string) {
      self.editNews.images.push(imageurl);
    }, function (imageurl: string) {
      self.editNews.images = self.editNews.images.filter(function (item) {
        return item != imageurl
      })
    }, function (videoUrl: string) {
      self.editNews.videos.push(videoUrl);
    }, function (videoUrl: string) {
      self.editNews.videos = self.editNews.videos.filter(function (item) {
        return item != videoUrl
      })
    });

    this.httpService.getNews("1").then(resp => {
      this.newses = resp;
      // 重构dataTable
      this.loadJqService.reloadJQ(null);
    });
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadJqService.froalaEditor("newsContent", null,null,null,null);
  }

  update(n: News) {
    this.editNews = n;
  }

  delete(n:News){
    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要删除该信息吗?',
      type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '删除', // <-- Default value is 'OK',
      btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          self.httpService.deleteNews(n).then(resp=>{
            self.httpService.getNews("1").then(resp => {
              self.newses = resp;
            });
          })
        }
      }
    });
  }

  cancle() {
    this.editNews = new News();
    this.editNews.content = "";
  }
  submit() {

    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要提交该信息吗?',
      type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '提交', // <-- Default value is 'OK',
      btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {

          if (self.editNews.title == "" || self.editNews.title == undefined) {
            alert("请输入新闻发布标题");
            return;
          }
          self.editNews.content = $("#newsContent").froalaEditor('html.get', true);
          self.editNews.author = window.localStorage.getItem("username");
          self.editNews.issueTime = new Date();
          self.httpService.createNews(self.editNews).then(resp => {
            console.log(resp);
            self.editNews = resp;
            self.httpService.getNews("1").then(resp => {
              self.newses = resp;
              $("#newsContent").froalaEditor('html.set', "");
            });
          });
        }
      }
    });
  }
}
