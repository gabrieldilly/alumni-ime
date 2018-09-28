'use strict';

export default function routes($stateProvider, appConfig) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/admin',
    abstract: true,
    template: require('./admin.html'),
    authenticate: 'admin',
    data: {
      meta: {
        description: 'Painel administrativo para gerenciamento dos usuários, projetos e notícias do site da associação.'
      }
    }
  });

  $stateProvider.state('admin.users', {
    url: '/users',
    template: require('./users/users.html'),
    controller: 'AdminUsersController',
    controllerAs: 'admin',
    authenticate: 'admin',
    data: {
      meta: {
        title: 'Gerenciar Usuários',
        'og:url': `${appConfig.url}/admin/users`
      }
    }
  });

  $stateProvider.state('admin.news', {
    url: '/news',
    template: require('./news/news.html'),
    controller: 'AdminNewsController',
    controllerAs: 'admin',
    authenticate: 'admin',
    data: {
      meta: {
        title: 'Gerenciar Notícias',
        'og:url': `${appConfig.url}/admin/news`
      }
    }
  });
}
