'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './search.routes';

export class SearchController {

  graduationYears = [];
  formerStudents = [];
  levelType = null;
  search = {
    GraduationYear: null
  };

  constructor(Auth, Modal, Util, $http, $state, $stateParams, $location, $anchorScroll) {
    'ngInject';

    this.getCurrentUser = Auth.getCurrentUser;
    this.Modal = Modal;
    this.Util = Util;
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
  }

  $onInit() {
    this.$anchorScroll('top');

    this.$http.get('/api/former_students/graduation_years')
      .then(response => {
        this.graduationYears = response.data;
      });

    this.$http.get('/api/former_students/industries')
      .then(response => {
        this.industriesList = response.data;
      });

    this.$http.get('/api/former_students/locations')
      .then(response => {
        this.locationsList = response.data;
        for(var location of this.locationsList) {
          if(location['profile.location.LocationId']) {
            location.profile = {
              location: {
                LocationId: location['profile.location.LocationId'],
                LinkedinName: location['profile.location.LinkedinName'],
                city: {
                  CityId: location['profile.location.city.CityId'],
                  Description: location['profile.location.city.Description'],
                  state: {
                    Code: location['profile.location.city.state.Code'],
                    StateId: location['profile.location.city.state.StateId'],
                  }
                },
                country: {
                  CountryId: location['profile.location.country.CountryId'],
                  Description: location['profile.location.country.Description'],
                }
              }
            }
            location.locationName = this.updateLocationName(location.profile.location);
          }
        }
        console.log(this.locationsList);
      });

    this.$http.get('/api/engineering')
      .then(response => {
        this.engineeringList = response.data;
      });

    this.$http.get('/api/countries')
      .then(response => {
        this.countriesList = response.data;
      });

    this.$http.get('/api/states')
      .then(response => {
        this.statesList = response.data;
      });

    this.$http.get('/api/levels')
      .then(response => {
        this.levelsList = response.data;
      });

    var loading = this.Modal.showLoading();

    this.getCurrentUser()
      .then(user => {
        this.user = user;
        if(!this.user.PersonId) {
          loading.close();
          this.Modal.openLogin();
        } else if(this.user.IsApproved && (this.user.personType.Description === 'FormerStudent' || this.user.personType.Description === 'FormerStudentAndProfessor')) {

          if(this.$stateParams.year) {
            this.search.GraduationYear = parseInt(this.$stateParams.year);
            this.$http.get(`/api/former_students/${this.search.GraduationYear}`)
              .then(response => {
                loading.close();
                this.formerStudents = response.data;
                for(var student of this.formerStudents) {
                  if(student.profile && student.profile.location) {
                    student.profile.locationName = this.updateLocationName(student.profile.location);
                  }
                }
                this.$location.hash('formerStudents');
                this.$anchorScroll();
              })
              .catch(() => {
                loading.close();
              });
          } else {
            loading.close();
          }

        } else {
          loading.close();
          this.Modal.showAlert('Consulta indisponível', 'Apenas ex-alunos cadastrados e aprovados podem realizar consultas.');
        }
      });

  }

  updateLocationName(location) {
    if(location) {
      var locationName = (location.LinkedinName ? location.LinkedinName.replace(' Area,', ',') : '');
      if(location.country.CountryId === 1 || (location.city && location.city.Description)) {
        locationName = (location.city.state ? `${location.city.Description} - ${location.city.state.Code}` : location.city.Description);
      } else {
        locationName = (location.country ? location.country.Description : '');
      }
    }
    return locationName || '';
  }

  searchStudents(form) {


    for (var field in this.search) {
      if(this.search[field] === null || this.search[field] === undefined || this.search[field] === '') {
        Reflect.deleteProperty(this.search, field);
      }
    }
    console.log(this.search);

    if(form.$valid && Object.keys(this.search).length > 0) {
      if(this.user.IsApproved && (this.user.personType.Description === 'FormerStudent' || this.user.personType.Description === 'FormerStudentAndProfessor')) {
        var loading = this.Modal.showLoading();
        this.$http.post('/api/former_students', this.search)
          .then(response => {
            loading.close();
            this.formerStudents = response.data;
            for(var student of this.formerStudents) {
              if(student.profile && student.profile.positions) {
                student.profile.locationName = this.updateLocationName(student.profile.positions[0].location);
              }
            }
            this.$location.hash('formerStudents');
            this.$anchorScroll();

            // if (this.search.GraduationYear) {
            //   this.$state.go('search', {year: this.search.GraduationYear}, {
            //     // prevent the events onStart and onSuccess from firing
            //     notify: false,
            //     // prevent reload of the current state
            //     reload: false, 
            //     // replace the last record when changing the params so you don't hit the back button and get old params
            //     location: 'replace', 
            //     // inherit the current params on the url
            //     inherit: true
            //   });
            // }
          })
          .catch(err => {
            loading.close();
              this.Modal.showAlert('Erro na consulta', 'Por favor, tente novamente.');
          });
        } else {
          this.Modal.showAlert('Consulta indisponível', 'Apenas ex-alunos cadastrados e aprovados podem realizar consultas.');
        }
    } else {
      this.Modal.showAlert('Erro na consulta', 'Por favor, selecione um ou mais filtros.');
    }
  }

}

export default angular.module('alumniApp.search', [uiRouter])
  .config(routes)
  .controller('SearchController', SearchController)
  .filter('sumByKey', function () {
    return function (data, key) {
      var sum = 0;
      if(typeof(data) === 'undefined' || typeof(key) === 'undefined') {
        return 0;
      }
      for(var i = data.length - 1; i >= 0; i--) {
        sum += parseInt(data[i][key]);
      }
      return sum;
    };
  })
  .name;

