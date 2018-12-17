'use strict';

export default class AdminProjectsController {

  /*@ngInject*/
  constructor(Util, Modal, $http, $state) {
    this.Util = Util;
    this.Modal = Modal;
    this.$http = $http;
    this.$state = $state;
  }
  
  $onInit() {

    var loading = this.Modal.showLoading();
    this.$http.get('/api/projects/all')
      .then(response => {
        loading.close();
        this.projects = response.data;
      });

  }

  //Need to create project modal
  editProjects(projectId) {
    this.Modal.editProjects(projectId)
    .then(() => {
      this.$state.reload();
    });
  }

}
