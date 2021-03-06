'use strict';

import _ from 'lodash';


class _User {
  PersonId = '';
  PersonTypeId = '';
  name = '';
  email = '';
  role = '';
  $promise = undefined;
}

export function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
  'ngInject';

  var safeCb = Util.safeCb;
  var currentUser = new _User();
  var userRoles = appConfig.userRoles || [];
  /**
   * Check if userRole is >= role
   * @param {String} userRole - role of current user
   * @param {String} role - role to check against
   */
  var hasRole = function (userRole, role) {
    return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
  };

  if($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  var Auth = {
    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    login({email, password}, callback) {
      return $http.post('/auth/local', {
        email,
        password
      })
        .then(res => {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .then(user => {
          ga('set', 'userId', Util.SHA256(user.email));
          ga('send', 'event', 'authentication', 'user-id available');
          console.log(Util.SHA256(user.email));
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    /**
     * Authenticate user with a known token
     *
     * @param  {String}   token
     * @return {Promise}
     */
    loginWithToken(token) {
      $cookies.put('token', token);
      currentUser = User.get();
      return currentUser.$promise;
    },

    /**
     * Delete access token and user info
     */
    logout() {
      $cookies.remove('token');
      currentUser = new _User();
    },

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    createUser(user, callback) {
      return User.save(user, function (data) {
        // It only creates a NewUser, but he wont't be logged
        // $cookies.put('token', data.token);
        // currentUser = User.get();
        return safeCb(callback)(null, user);
      }, function (err) {
        Auth.logout();
        safeCb(callback)(err.data);
        return $q.reject(err.data);
      })
        .$promise;
    },

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - function(error, user)
     * @return {Promise}
     */
    changePassword(oldPassword, newPassword, callback) {
      return User.changePassword({
        id: currentUser.PersonId
      }, {
        oldPassword,
        newPassword
      }, function () {
        return safeCb(callback)(null);
      }, function (err) {
        return safeCb(callback)(err);
      })
        .$promise;
    },

    /**
     * Reset password
     *
     * @param  {String}   resetPasswordToken
     * @param  {String}   newPassword
     * @param  {Function} callback    - function(error, user)
     * @return {Promise}
     */
    resetPassword(resetPasswordToken, newPassword, callback) {
      return User.resetPasswordByToken({}, {
        resetPasswordToken,
        newPassword
      }, function () {
        return safeCb(callback)(null);
      }, function (err) {
        return safeCb(callback)(err);
      })
        .$promise;
    },

    /**
     * Update user profile using a token
     *
     * @param  {String}   token
     * @param  {Object}   user
     * @param  {Function} callback    - function(error, user)
     * @return {Promise}
     */
    updateByToken(token, user, callback) {
      return User.updateUserByToken({
        id: token
      }, user, function (data) {
        return safeCb(callback)(null, data);
      }, function (err) {
        return safeCb(callback)(err);
      })
        .$promise;
    },
    
    /**
     * Update user profile using a PersonId
     *
     * @param  {String}   PersonId
     * @param  {Object}   user
     * @param  {Function} callback    - function(error, user)
     * @return {Promise}
     */
    updateById(PersonId, user, callback) {
      return User.updateUserById({
        id: PersonId
      }, user, function () {
        return safeCb(callback)(null);
      }, function (err) {
        return safeCb(callback)(err);
      })
        .$promise;
    },

    /**
     * Gets all available info on a user
     *
     * @param  {Function} [callback] - function(user)
     * @return {Promise}
     */
    getCurrentUser(callback) {
      var value = _.get(currentUser, '$promise') ? currentUser.$promise : currentUser;

      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    /**
     * Gets all available info on a user
     *
     * @return {Object}
     */
    getCurrentUserSync() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @param  {Function} [callback] - function(is)
     * @return {Promise}
     */
    isLoggedIn(callback) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let is = _.get(user, 'role');

          safeCb(callback)(is);
          return is;
        });
    },

    /**
     * Check if a user is logged in
     *
     * @return {Bool}
     */
    isLoggedInSync() {
      return !!_.get(currentUser, 'role');
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {String}     role     - the role to check against
     * @param  {Function} [callback] - function(has)
     * @return {Promise}
     */
    hasRole(role, callback) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let has = hasRole(_.get(user, 'role'), role);

          safeCb(callback)(has);
          return has;
        });
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {String} role - the role to check against
     * @return {Bool}
     */
    hasRoleSync(role) {
      return hasRole(_.get(currentUser, 'role'), role);
    },

    /**
     * Check if a user is an admin
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Bool|Promise}
     */
    isAdmin(...args) {
      return Auth.hasRole(...Reflect.apply([].concat, ['admin'], args));
    },

    /**
     * Check if a user is an admin
     *
     * @return {Bool}
     */
    isAdminSync() {
      // eslint-disable-next-line no-sync
      return Auth.hasRoleSync('admin');
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
      return $cookies.get('token');
    }
  };

  return Auth;
}
