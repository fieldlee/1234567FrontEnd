import { Injectable } from '@angular/core';
declare var $: any;
declare var uiLoad: any;
declare var jp_config: any;
@Injectable()
export class LoadJQService {

  constructor() {

  }

  reloadJQ(callback: (start: Date, end: Date) => void) {
    $("[ui-jq]").each(function () {
      var self = $(this);
      var options = eval('[' + self.attr('ui-options') + ']');

      if ($.isPlainObject(options[0])) {
        options[0] = $.extend({}, options[0]);
      }
      if (uiLoad) {
        uiLoad.load(jp_config[self.attr('ui-jq')]).then(function () {
          self[self.attr('ui-jq')].apply(self, options);
        });
      }
    });

    $('input[ui-jq="daterangepicker"]').on('apply.daterangepicker', function (ev, picker) {
      if (callback) {
        callback(new Date(picker.startDate.format('YYYY-MM-DD')), new Date(picker.endDate.format('YYYY-MM-DD')));
      }
    });
    $('input[ui-jq="daterangepicker"]').on('cancel.daterangepicker', function (ev, picker) {
      $(this).val('');
      if (callback) {
        callback(null, null);
      }
    });
  }

  froalaEditorComment(froalaEditorObjid: string) {
    $('#' + froalaEditorObjid).froalaEditor({
      language: 'zh_cn',
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough',  'fontSize', '|', 'color', 'emoticons'],
      emoticonsStep: 8
    });
  }

  froalaEditor(froalaEditorObjid: string, callback1: (imageurl: string) => void, callback2: (imageurl: string) => void,
    callback3: (videourl: string) => void, callback4: (videourl: string) => void) {
    $('#' + froalaEditorObjid).froalaEditor({
      language: 'zh_cn',
      // Set the image upload URL.
      toolbarButtons:['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|',  'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertImage', 'insertVideo','insertLink', 'insertTable','|',  'insertHR', 'clearFormatting', '|', 'undo', 'redo'],
      toolbarButtonsXS:['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|',  'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertImage', 'insertVideo','insertLink', 'insertTable','|',  'insertHR', 'clearFormatting', '|', 'undo', 'redo'],
      emoticonsStep: 8,
      heightMin: 160,
      heightMax: 800,
      placeholderText: '请说点啥吧',
      // toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', '|', 'color', 'emoticons',  '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent'],
      fileUploadURL: '/api/web/upload/upload_file',
      videoUploadURL: '/api/web/upload/upload_file',
      imageUploadURL: '/api/web/upload/upload_image',
      // Set max image size to 5MB.
      imageMaxSize: 5 * 1024 * 1024,
      fileMaxSize: 5 * 1024 * 1024,
      videoMaxSize: 30 * 1024 * 1024,
      // Allow to upload PNG and JPG.
      fileAllowedTypes: ['*'],
      videoAllowedTypes: ['webm', 'mp4', 'ogg','3gp'],
      imageAllowedTypes: ['jpeg', 'jpg', 'png',"pdf"]
    })
      .on('froalaEditor.image.beforeUpload', function (e, editor, images) {
        // Return false if you want to stop the image upload.
      })
      .on('froalaEditor.image.uploaded', function (e, editor, response) {
        // Image was uploaded to the server.
        console.log("Image was uploaded to the server");
      })
      .on('froalaEditor.image.inserted', function (e, editor, $img, response) {
        // Image was inserted in the editor.
        var respJson = response;
        if (typeof response == "string") {
          respJson = JSON.parse(response);
        }
        console.log(respJson["link"]);
        callback1($img.attr('src'));
      })
      .on('froalaEditor.image.removed', function (e, editor, $img) {
        $.ajax({
          method: "POST",
          url: "/api/web/upload/delete_image",
          data: {
            src: $img.attr('src')
          }
        })
          .done(function (data) {
            callback2($img.attr('src'));
            console.log('image was deleted');
          })
          .fail(function () {
            console.log('image delete problem');
          })
      })
      .on('froalaEditor.video.inserted', function (e, editor, $video) {
        callback3($video.contents().get(0).src);
      })
      .on('froalaEditor.video.removed', function (e, editor, $video) {
        

        $.ajax({
          method: "POST",
          url: "/api/web/upload/delete_file",
          data: {
            src: $video.contents().get(0).src
          }
        })
          .done(function (data) {
            callback4($video.contents().get(0).src);
            console.log('video was deleted');
          })
          .fail(function () {
            console.log('video delete problem');
          })
      })
      .on('froalaEditor.image.replaced', function (e, editor, $img, response) {
        // Image was replaced in the editor.
      })
      .on('froalaEditor.image.error', function (e, editor, error, response) {
        // Response contains the original server response to the request if available.
      });
  }
}
