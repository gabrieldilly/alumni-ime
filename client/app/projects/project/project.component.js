'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './project.routes';

export class ProjectController {
  project = {
    ProjectName: ''
  };
  selectedProjectImage = {};
  selectedProjectImageIndex = 0;
  selectedResultImage = {};
  selectedResultImageIndex = 0;
  previewMode = false;
  acceptDonation = true;

  constructor(Auth, Modal, $state, $stateParams, Project, Donation, Util, ngMeta, appConfig, $anchorScroll) {
    'ngInject';

    this.Auth = Auth
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Modal = Modal;
    this.Project = Project;
    this.Donation = Donation;
    this.Util = Util;
    this.ngMeta = ngMeta;
    this.appConfig = appConfig;
    this.$anchorScroll = $anchorScroll;
  }

  $onInit() {
    this.Auth.getCurrentUser((user) => {
      this.user = user;
    });

    var loading = this.Modal.showLoading();
    if(this.$stateParams.ProjectId && this.$stateParams.preview !== null && this.$stateParams.forceReload !== null) {
      var ProjectId = this.$stateParams.ProjectId;
      var PrettyURL = this.$stateParams.PrettyURL;
      this.previewMode = this.$stateParams.preview;
      this.loadFacebookShare(ProjectId, PrettyURL);
      this.loadLinkedInShare(ProjectId, PrettyURL);
      this.loadTwitterShare(ProjectId, PrettyURL);
      this.Project.get(ProjectId, this.previewMode, this.$stateParams.forceReload)
        .then(project => {      
          loading.close();
          project.DonationSum = 0;
          for(let i = 0, len = project.donations.length; i<len; i++){
            project.DonationSum += project.donations[i].ValueInCents;
          }
          this.ngMeta.setTitle(project.ProjectName);
          this.ngMeta.setTag('description', project.Abstract.slice(0, 200));
          this.ngMeta.setTag('author', project.leader.name);
          this.ngMeta.setTag('og:image', `${this.appConfig.url}/${project.images[0].Path}`);
          this.ngMeta.setTag('og:url', `${this.appConfig.url}/projects/view/${project.ProjectId}/${this.Util.convertToSlug(project.ProjectName)}`);

          this.project = project;
          var today = new Date().getTime();
          var limit = new Date(this.project.CollectionLimitDate).getTime();
          if(today > limit) {
            this.acceptDonation = false;
          }
          this.projectImages = this.project.images.filter((image) => {
            return image.Type === 'project';
          });
          this.resultImages = this.project.images.filter((image) => {
            return image.Type === 'result';
          });
          this.selectedProjectImage = this.projectImages[0];
          this.selectedResultImage = this.resultImages[0];
          this.$anchorScroll('top');
        })
        .catch(() => {
          loading.close();
          if(this.previewMode) {
            this.$state.go('profile', {view: 'submitted_projects'});
          } else {
            this.$state.go('show');
          }
        });
    } else {
      loading.close();
      this.$state.go('show');
    }
  }

  selectImage($index, Type) {
    if (Type === 'project') {
      this.selectedProjectImage = this.projectImages[$index];
      this.selectedProjectImageIndex = $index;
    }
    if (Type === 'result') {
      this.selectedResultImage = this.resultImages[$index];
      this.selectedResultImageIndex = $index;
    }
  }

  openPhoto(images, index) {
    this.Modal.openPhoto(images, index);
  }

  editProject(project) {
    this.$state.go('edit', {ProjectId: project.ProjectId});
  }

  insertResult(project) {
    this.$state.go('result', {ProjectId: project.ProjectId});
  }

  loadFacebookShare(ProjectId, PrettyURL){
    this.facebookDataHref = "https://www.alumniime.com.br/projects/view/" + 
      ProjectId + '/' + PrettyURL;
    this.facebookHref = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.alumniime.com.br%2Fprojects%2Fview%2F" + 
    ProjectId + "%2F" + PrettyURL + "&amp;src=sdkpreparse"
  }

  loadLinkedInShare(ProjectId, PrettyURL){
    this.linkedinHref = "http://www.linkedin.com/shareArticle?mini=true&url=" + "www.alumniime.com.br/projects/view/" +
    ProjectId + '/' + PrettyURL;
  }

  loadTwitterShare(ProjectId, PrettyURL){
    this.twitterHref = "http://www.twitter.com/share?url=" + "https://www.alumniime.com.br/projects/view/" +
    ProjectId + '/' + PrettyURL;
    }

  openSupportProject(project) {
    console.log('OI: ', project);
    if(this.user.email!=''){
      this.Modal.openSupportProject(project)
        .then(() => {
          console.log('Fechou e deu certo');
        }).catch(err => {
          console.log(err);
        })
    }else{
      this.Modal.openLogin();
    }
  }

}

export default angular.module('alumniApp.project', [uiRouter])
  .config(routes)
  .controller('ProjectController', ProjectController)
  .name;
