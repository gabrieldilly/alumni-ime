'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@PersonId'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    updateUserById: {
      method: 'PUT',
      params: {
        controller: 'profile'
      }
    },
    updateUserByToken: {
      method: 'PUT',
      params: {
        controller: 'registry'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
}
