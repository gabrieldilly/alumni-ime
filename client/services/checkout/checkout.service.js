'use strict';
const angular = require('angular');

/*@ngInject*/
export function CheckoutService($q, $interval, appConfig) {

  var Checkout = {

    /**
     * Opens pagarme checkout view with params
     * */
    open(params, success) {
      getInstance(success)
        .then((checkout) => {
          checkout.open(params);
        })
        .catch(() => {
          console.error('No Pagar.me checkout found. Did you import it?');
        });
    },

  };

  /**
   * Checks if PagarMeCheckout was loaded and creates a checkout instance
   * */
  function getInstance(success) {

    var promise = $q((resolve, reject) => {

      var elapsedTime = 0;
      var intervalTime = 100;

      var interval = $interval(() => {
        if(window.PagarMeCheckout) {
          if(window.PagarMeCheckout.Checkout){
            var data = {
              encryption_key: appConfig.pagarme.encryptionKey, 
              success: success,
              error: (err) => {
                console.log(err);
              },
              close: () => {
                console.log('The modal has been closed.');
              }
            };
            $interval.cancel(interval);
            resolve(new PagarMeCheckout.Checkout(data));
          }
        } else if(elapsedTime === 3000) {
          $interval.cancel(interval);
          reject('load timeout');
        }
        elapsedTime += intervalTime;
      }, intervalTime);
      
    });

    return promise;

  }
  
  return Checkout;
}

export default angular.module('alumniApp.checkoutService', [])
  .factory('Checkout', CheckoutService)
  .name;
