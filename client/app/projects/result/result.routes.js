'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('result', {
      url: '/projects/result/:ProjectId',
      template: require('./result.html'),
      controller: 'ResultController',
      controllerAs: 'vm',
      authenticate: true,
      data: {
        meta: {
          title: 'Inserir Resultados do Projeto',
          description: 'Insira o resultado do projeto realizado com descrição e fotos.',
        }
      }
    });
}
