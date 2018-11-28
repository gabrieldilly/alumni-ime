'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './donate.routes';

export class DonateController {
  submitted = false;
  // donation = {
  //   Type: 'general',
  //   ProjectId: null,
  //   ValueInCents: 0
  // };
  //for dev
  funding = {
    type: 'mensal',
    // contributor: 'ALEX N SOUZA',
    value: 'D8BC16C543436D2554104FB2EC5D1B96',
    customValue: null,
    // email: "alex.maodemartelo@sandbox.pagseguro.com.br",
    // cpf:"51646013204",
    // address: {
    //   city: "Rio de Janeiro",
    //   complement: "apto 1204",
    //   country: "Brasil",
    //   district: "copacabana",
    //   number: "250",
    //   postalCode: "22021-020",
    //   state: "RJ",
    //   street: "Rua Ronald de Carvalho"
    // },
    // paymentMethod: {
    //   creditCardHolderName: "alex n souza",
    //   creditCardNumber: "4111111111111111",
    //   cvv: "123",
    //   expires: {
    //     month: "12",
    //     year: "2030"
    //   }
    // },
    // telefone: {
    //   area: "21",
    //   numero: "994378187"
    // },
    // creditCardHolderBirthDate: '26/02/1980'
  };

  constructor(Auth, Modal, $anchorScroll) {
    'ngInject';

    this.getCurrentUser = Auth.getCurrentUser;
    this.Modal = Modal;
    this.$anchorScroll = $anchorScroll;
  }

  $onInit() {
    this.$anchorScroll('top');

    this.loading = this.Modal.showLoading();
    this.getCurrentUser()
      .then(user => {
        this.user = user;
        this.loading.close();
        if (!user.PersonId) {
          this.Modal.openLogin();
        } else {
          this.funding.contributor = user.FullName;
        }
      });

    // var date = new Date();
    // this.currentSemester = (date.getMonth() >= 5 && date.getMonth() <= 10) ? 2 : 1;
    // this.currentYear = date.getFullYear();

  }

  // removeImage(image) {
  //   this.uploadImages.splice(this.uploadImages.indexOf(image), 1);
  // }

  // updateImages(files) {
  //   if (files === null) {
  //     this.loading = this.Modal.showLoading();
  //   } else {
  //     this.loading.close();
  //   }
  // }

  // submitDonation(form) {
  //   this.submitted = true;

  //   if (!this.user.PersonId) {
  //     // User needs to login
  //     this.Modal.openLogin();
  //   } else if (form.$valid && this.uploadImages && this.uploadImages.length === 1 && this.donation.ValueInCents > 0 && this.donation.ProjectId !== '') {

  //     this.donation.ValueInCents *= 100;
  //     if (this.donation.Type === 'general') {
  //       this.donation.ProjectId = null;
  //     }

  //     var loading = this.Modal.showLoading();

  //     var this_ = this;
  //     this.Upload.upload({
  //       url: '/api/donations/upload',
  //       arrayKey: '',
  //       data: {
  //         file: this.uploadImages[0],
  //         donation: this.donation
  //       }
  //     })
  //       .then(function success(result) {
  //         loading.close();
  //         console.log(result);
  //         if (result.data.errorCode === 0) {
  //           this_.submitted = false;
  //           this_.uploadImages = [];
  //           this_.$state.go('profile', { view: 'supported_projects' });
  //           this_.Donation.loadMyDonations(true);
  //           this_.$uibModal.open({
  //             animation: true,
  //             component: 'modalSentReceipt',
  //             size: 'dialog-centered'
  //           });
  //         } else {
  //           this_.Modal.showAlert('Erro no envio', 'Por favor, tente novamente.');
  //         }
  //       }, function error(err) {
  //         loading.close();
  //         console.log('Error: ' + err);
  //         this_.Modal.showAlert('Erro no servidor', 'Por favor, tente novamente.');
  //       }, function event(evt) {
  //         console.log(evt);
  //         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
  //         console.log('progress: ' + progressPercentage + '% ');
  //         this_.progress = 'progress: ' + progressPercentage + '% ';
  //       });

  //   }

  // }

  submitFunding(form) {
    this.submitted = true;

    if (!this.user.PersonId) {
      // User needs to login
      this.Modal.openLogin();
    } else if (form.$valid) {
      console.log(this.funding);
      this.Modal.openCheckout(this.funding);
    }

  }

}

export default angular.module('alumniApp.donate', [uiRouter])
  .config(routes)
  .controller('DonateController', DonateController)
  .name;
