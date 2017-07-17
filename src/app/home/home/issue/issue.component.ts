import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ForumInfo } from '../../../class/forum-info';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css'],
  providers: [HttpService, LoadJQService]
})
export class IssueComponent implements OnInit {
  type: string;
  subType: string;
  types: string[];
  subTypes: string[];
  showType: boolean;
  showSubType: boolean;
  forum: ForumInfo;
  constructor(private httpService: HttpService, private loadJq: LoadJQService,
    private route: ActivatedRoute) {
    this.showType = false;
    this.showSubType = true;
    this.forum = new ForumInfo();


  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params["type"];
      this.subType = params["subtype"];
      //  读取分类
      this.httpService.getType().then(response => {
        console.log(response.results);
        this.types = new Array();
        response.results.forEach(element => {
          console.log(element.type);
          this.types.push(element.type);
        });
      });

      if (this.type) {
        this.httpService.getSubType(this.forum.type).then(
          resp => {
            this.subTypes = new Array();
            resp.results.forEach(element => {
              this.subTypes.push(element.subType);
            });
            console.log(this.subTypes);
          })
      }

    })



    const self = this;

    this.loadJq.froalaEditor("forumContent", function (imageurl: string) {
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
  typeListener() {
    this.httpService.getSubType(this.forum.type).then(
      resp => {

        this.subTypes = new Array();
        resp.results.forEach(element => {
          this.subTypes.push(element.subType);
        });
        console.log(this.subTypes);
      })
  }
}
