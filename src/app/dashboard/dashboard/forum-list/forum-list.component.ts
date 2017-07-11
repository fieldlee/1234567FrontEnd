import { Component, OnInit } from '@angular/core';
import { ForumInfo } from '../../../class/forum-info';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;
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
    if (this.forum.title == "") {
      alert("请输入论坛标题");
      return
    }
    if (this.forum.content == "") {
      alert("请输入论坛内容");
      return
    }
    this.httpService.createForum(this.forum).then(resp => {
      console.log(resp);
      this.httpService.getForums().then(responses => {
        this.forums = responses
      });
    });
  }
}
