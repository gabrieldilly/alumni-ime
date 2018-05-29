import angular from 'angular';

export class FooterComponent {
  name = '';
  email = '';
  message = '';
  submitted = false;

  constructor(Modal, $http, $uibModal) {
    'ngInject';

    this.$http = $http;
    this.Modal = Modal;
    this.$uibModal = $uibModal;
  }
  
  sendContactEmail(form) {
    this.submitted = true;

    if(form.$valid){
      this.$http.post('/api/users/contact', {
        Name: this.name,
        Email: this.email,
        Message: this.message
      })
        .then(res => {
          console.log(res);
          this.Modal.showAlert('Email enviado!', 'Por favor, aguarde que lhe responderemos em breve.');
        })
        .catch(err => {
          alert('Erro ao enviar email');
          console.log(err);
        });
      }
  }
}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.html'),
    controller: FooterComponent
  })
  .name;

