'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

export class BankController {
  submitted = false;
  donation = {
    Type: 'general',
    ProjectId: null,
    ValueInCents: 0
  };
  uploadImages = [];
  imageQuality = 1;
  maxImages = 1;
  maxSize = '5MB';
  currentYear = '';
  currentSemester = '';

  constructor(Auth, Modal, $state, $stateParams, $uibModal, Project, Donation, Upload, $anchorScroll) {
    'ngInject';

    this.getCurrentUser = Auth.getCurrentUser;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Modal = Modal;
    this.Upload = Upload;
    this.Project = Project;
    this.Donation = Donation;
    this.$uibModal = $uibModal;
    this.$anchorScroll = $anchorScroll;
  }

  $onInit() {
    this.$anchorScroll('top');
    this.Project.load()
      .then(() => {
        if(this.$stateParams.ProjectId) {
          this.donation.Type = 'project';
          this.donation.ProjectId = parseInt(this.$stateParams.ProjectId);
        }
      });

    this.loading = this.Modal.showLoading();
    this.getCurrentUser()
      .then(user => {
        this.user = user;
        this.loading.close();
        if(!user.PersonId) {
          this.Modal.openLogin();
        } else {
          this.donation.DonatorId = user.PersonId;
        }
      });

  }

  validDate(collectionLimitDate) {
    var today = new Date().getTime();
    var limit = new Date(collectionLimitDate).getTime();
    return today <= limit;
  }

  removeImage(image) {
    this.uploadImages.splice(this.uploadImages.indexOf(image), 1);
  }

  updateImages(files) {
    if(files === null) {
      this.loading = this.Modal.showLoading();
    } else {
      this.loading.close();
    }
  }

  submitDonation(form) {
    this.submitted = true;

    if(!this.user.PersonId) {
      // User needs to login
      this.Modal.openLogin();
    } else if(form.$valid && this.uploadImages && this.uploadImages.length === 1 && this.donation.ValueInCents > 0 && this.donation.ProjectId !== '') {

      this.donation.ValueInCents *= 100;
      if(this.donation.Type === 'general') {
        this.donation.ProjectId = null;
      }

      var loading = this.Modal.showLoading();

      var this_ = this;
      this.Upload.upload({
        url: '/api/donations/upload',
        arrayKey: '',
        data: {
          file: this.uploadImages[0],
          donation: this.donation
        }
      })
        .then(function success(result) {
          this_.donation.ValueInCents /= 100;
          loading.close();
          console.log(result);
          if(result.data.errorCode === 0) {
            this_.submitted = false;
            this_.uploadImages = [];
            this_.$state.go('profile', {view: 'supported_projects'});
            this_.Donation.loadMyDonations(true);
            this_.$uibModal.open({
              animation: true,
              component: 'modalSentReceipt',
              size: 'dialog-centered'
            });
          } else {
            this_.Modal.showAlert('Erro no envio', 'Por favor, tente novamente.');
          }
        }, function error(err) {
          this_.donation.ValueInCents /= 100;
          loading.close();
          console.log('Error: ' + err);
          this_.Modal.showAlert('Erro no servidor', 'Por favor, tente novamente.');
        }, function event(evt) {
          console.log(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ');
          this_.progress = 'progress: ' + progressPercentage + '% ';
        });

    }

  }

}

export default angular.module('alumniApp.bank', [uiRouter])
  .controller('BankController', BankController)
  .name;