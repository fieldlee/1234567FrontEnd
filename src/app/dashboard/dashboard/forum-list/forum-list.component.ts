import { Component, OnInit } from '@angular/core';
import { ForumInfo } from '../../../class/forum-info';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;
declare var BootstrapDialog: any;
@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css'],
  providers: [HttpService, LoadJQService]
})
export class ForumListComponent implements OnInit {
  forum: ForumInfo;
  forums: ForumInfo[];
  constructor(private httpService: HttpService, private loadJqService: LoadJQService) {
    this.forum = new ForumInfo();
  }

  ngOnInit() {

    const self = this;
    this.loadJqService.reloadJQ(null);
    this.httpService.getForums().then(responses => {
      this.forums = responses
    });
    this.loadJqService.froalaEditor("forumContent", function (imageurl: string) {
      if (self.forum.images == undefined) {
        self.forum.images = new Array<string>();
      }
      self.forum.images.push(imageurl);
    }, function (imageurl: string) {
      if (self.forum.images != undefined) {
        self.forum.images = self.forum.images.filter(function (item) {
          return item != imageurl
        })
      }
    }, function (videoUrl: string) {
      if (self.forum.videos == undefined) {
        self.forum.videos = new Array<string>();
      }
      this.forum.videos.push(videoUrl);
    }, function (videoUrl: string) {
      this.forum.videos = this.forum.videos.filter(function (item) {
        return item != videoUrl
      })
    });
  }
  update(pro: ForumInfo) {
    this.forum = pro;
  }
  cancel() {
    this.forum = new ForumInfo();
  }
  submit() {
    console.log(this.forum);

    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要提交该信息吗?',
      type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '提交', // <-- Default value is 'OK',
      btnOKClass: 'btn-success', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          if (self.forum.title == "") {
            alert("请输入论坛标题");
            return
          }
          if (self.forum.content == "") {
            alert("请输入论坛内容");
            return
          }
          self.httpService.createForum(self.forum).then(resp => {
            console.log(resp);
            self.httpService.getForums().then(responses => {
              self.forums = responses
            });
          });
        }
      }
    });
  }
}
