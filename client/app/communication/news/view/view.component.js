'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './view.routes';

export class ViewController {
  news = {};

  constructor(Modal, $state, $stateParams, News, Project, Util, Auth, ngMeta, appConfig, $anchorScroll) {
    'ngInject';

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Modal = Modal;
    this.News = News;
    this.Project = Project;
    this.Util = Util;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUserPromise = Auth.getCurrentUser;
    this.ngMeta = ngMeta;
    this.appConfig = appConfig;
    this.$anchorScroll = $anchorScroll;
  }

  $onInit() {
    var loading = this.Modal.showLoading();
    if(this.$stateParams.NewsId && this.$stateParams.forceReload !== null) {
      var NewsId = this.$stateParams.NewsId;
      this.getCurrentUserPromise(() => {
          var preview = this.isAdmin();
          this.News.get(NewsId, this.$stateParams.forceReload, preview)
          .then(news => {
            loading.close();
  
            this.ngMeta.setTitle(news.Title);
            this.ngMeta.setTag('description', news.Subtitle);
            this.ngMeta.setTag('og:image', `${this.appConfig.url}/${news.constructions[0].images[0].Path}`);
            this.ngMeta.setTag('og:url', `${this.appConfig.url}/news/view/${news.NewsId}/${this.Util.convertToSlug(news.Title)}`);
  
            this.news = news;
            this.Project.load();
            this.News.load();
            this.$anchorScroll('top');
          })
          .catch(() => {
            loading.close();
            this.$state.go('news');
          });
        });        
    } else {
      loading.close();
      this.$state.go('news');
    }
  }

  openPhoto(images, index) {
    this.Modal.openPhoto(images, index);
  }

}

export default angular.module('alumniApp.view', [uiRouter])
  .config(routes)
  .controller('ViewController', ViewController)
  .name;
