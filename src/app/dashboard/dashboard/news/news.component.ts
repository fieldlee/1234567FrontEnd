import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { News } from '../../../class/news';
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

    this.httpService.getNews().then(resp => {
      this.newses = resp;
    });
  }

  update(n:News){
    this.editNews = n;
  }

  cancle() {
    this.editNews = new News();
    this.editNews.content = "";
  }
  submit() {
    console.log(this.editNews);
    if (this.editNews.title == "" || this.editNews.title == undefined){
      alert("请输入新闻发布标题");
      return;
    }
    this.httpService.createNews(this.editNews).then(resp => {
      console.log(resp);
      this.editNews = resp;
      this.httpService.getNews().then(resp => {
        this.newses = resp;
      });
    });
  }
}
