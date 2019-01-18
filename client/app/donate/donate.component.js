'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './donate.routes';

export class DonateController {
  submitted = false;
  ProjectName = '';
  donation = {
    Type: 'general',
    Frequency: 'monthly',
    ProjectId: null,
    ValueInCents: 10000
  };
  plans = [{
    planId: '',
    value: 50,
    frequency: 'monthly',
    visible: false
  }, {
    planId: '',
    value: 100,
    frequency: 'monthly',
    visible: true
  }, {
    planId: '',
    value: 150,
    frequency: 'monthly',
    visible: false
  }, {
    planId: '',
    value: 200,
    frequency: 'monthly',
    visible: true
  }, {
    planId: '',
    value: 250,
    frequency: 'monthly',
    visible: false
  }, {
    planId: '',
    value: 300,
    frequency: 'monthly',
    visible: true
  }, {
    planId: '',
    value: 400,
    frequency: 'monthly',
    visible: true
  }, {
    planId: '',
    value: 500,
    frequency: 'monthly',
    visible: true
  }, {
    planId: '',
    value: 750,
    frequency: 'monthly',
    visible: false
  }, {
    planId: '',
    value: 1000,
    frequency: 'monthly',
    visible: false
  }, {
    value: 200,
    frequency: 'once',
    visible: true
  }, {
    value: 400,
    frequency: 'once',
    visible: true
  }, {
    value: 600,
    frequency: 'once',
    visible: true
  }, {
    value: 800,
    frequency: 'once',
    visible: true
  }, {
    value: 1000,
    frequency: 'once',
    visible: true
  }];
  selectedOption = null;
  customValue = 0;

  //for dev
  funding = {
    type: 'mensal',
    donationType: 'general',
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

  constructor(Auth, Modal, $anchorScroll, $http, $state, $stateParams, Project, Donation, Checkout) {
    'ngInject';

    this.getCurrentUser = Auth.getCurrentUser;
    this.Modal = Modal;
    this.$anchorScroll = $anchorScroll;
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Project = Project;
    this.Donation = Donation;
    this.Checkout = Checkout;
  }

  $onInit() {
    this.$anchorScroll('top');
    this.Project.load()
      .then(result => {
        if(this.$stateParams.ProjectId) {
          this.donation.Type = 'project';
          this.donation.ProjectId = parseInt(this.$stateParams.ProjectId);
          for (var project of result) {
            if (project.ProjectId === this.donation.ProjectId) {
              this.ProjectName = project.ProjectName;
            }
          }
        }
      });
    
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

    var date = new Date();
    this.currentSemester = (date.getMonth() >= 5 && date.getMonth() <= 10) ? 2 : 1;
    this.currentYear = date.getFullYear();
    this.currentYear = 2018;

    this.selectFrequency('monthly');

  }

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

  selectType(type) {
    this.donation.Type = type;
    if(type === 'general') {
      this.donation.ProjectId = null; 
      this.ProjectName = '';
    }
  }

  selectFrequency(frequency) {
    this.donation.Frequency = frequency;
    for(var option of this.plans) {
      if(option.visible && option.frequency === frequency) {
        this.selectValue(option);
        break;
      }
    }
  }

  selectValue(option) {
    this.selectedOption = option;
    this.donation.ValueInCents = 100 * option.value;
    this.customValue = 0;
  }  

  setCustomValue(value) {
    this.selectedOption = {
      value: value,
      frequency: 'once',
      visible: false
    };
    this.donation.ValueInCents = 100 * value;
  }

  submitFunding(form) {
    this.submitted = true;

    if (!this.user.PersonId) {
      // User needs to login
      this.Modal.openLogin();
    } else if (form.$valid) {
      console.log(this.funding);
      // this.Modal.openCheckout(this.funding);
    }


    // inicia a instância do checkout
    // var checkout = new PagarMeCheckout.Checkout({
    //   encryption_key: 'ek_test_z9QmtfjZR9PunDBBHp4XPJXZd9DwlC',
    //   success: ,
    //   error: function(err) {
    //     console.log(err);
    //   },
    //   close: function() {
    //     console.log('The modal has been closed.');
    //   }
    // });
    
    var this_ = this;
    this.Checkout.open({
      amount: this.donation.ValueInCents,
      buttonText: 'Pagar',
      headerText: this.donation.Frequency === 'monthly' ? 'Contribuição mensal {price_info}' : 'Valor da contribuição {price_info}',
      customerData: 'true',
      createToken: 'false',
      paymentMethods: this.donation.Frequency === 'monthly' ? 'credit_card' : 'credit_card,boleto',
      // customer: {
      //   external_id: this.user.PersonId,
      //   name: this.user.name,
      //   email: this.user.email,
      //   type: 'individual',
      //   country: 'br',
      // //   documents: [
      // //     {
      // //       type: 'cpf',
      // //       number: '71404665560',
      // //     },
      // //   ],
      // //   phone_numbers: ['+5511999998888', '+5511888889999'],
      // //   birthday: '1985-01-01'
      // }
    }, (data) => {
      console.log(this);

      var dataa = {
        "installments":null,
        "amount":10000,
        "payment_method":"credit_card",
        "customer":{
          "name":"Gabriel Dilly",
          "email":"gabriel_dilly@hotmail.com",
          "document_number":"00000000000000",
          "phone":{"ddd":"32","number":"999892092"},
          "address":{"zipcode":"36016320","street":"Avenida Presidente Itamar Franco","street_number":"1430","complementary":"202","neighborhood":"Centro","city":"Juiz de Fora","state":"MG"}
        },
        "card_hash":"1396852_ESWW7+zFGfp46TSkKY7t6WuM4MV2IE1grrp/Oc6bd+2nS/tM6cIDoI3AXkkwLt8BhaOmojH6PpgcLeF+b3u82aI342oj/mUWgfvOnmZPMOTmFmH4vwiqTmSMagehT/UGvKn/36j04OKNfhU+DK9Atpv91deFfUP9+8FpOUumxF/PudlrdeeVIKlzOuoQqZ3/bqnfOygl4UNGDxLODikuE0Ho19NQiyhgcvqoSzcP+0um6Ph906trvyMeIbwqoyFQmvabAiCf+T6mpGzeNrnEMdJr/ry3bwcEHX5nJ7XHgsBq3WJUuEgIQ1LQtldvJB5jY0kYkTAR8ixovNRIXFtCEw=="
      };

      data.plan_id = '403308';

      this_.$http.post('/api/pagseguro/pay', data)
        .then(res => {
          console.log(res); 
        })
        .catch(err => {
          console.log(err);
        });
    });

  }

}

export default angular.module('alumniApp.donate', [uiRouter])
  .config(routes)
  .controller('DonateController', DonateController)
  .name;
