// front/app/authenticators/django.js

import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import ENV from '../config/environment';
import Cookies from 'ember-cli-js-cookie';



function isSecureUrl(url) {
  var link  = document.createElement('a');
  link.href = url;
  link.href = link.href;
  return link.protocol === 'https:';
}

export default Base.extend({

  /*
  init() {
    //var apiHost = ENV.APP.API_HOST;
    var apiAuthentication = ENV['ember-simple-auth'] || {};
    this.serverAuthEndpoint = apiAuthentication.serverAuthEndpoint;

  },
  */

  authenticate(identification,password) {

    return new Ember.RSVP.Promise((resolve, reject) => {
      let remoteResponse;
      if (!(identification && password)) {
        remoteResponse = this.requestBackendSession();
      } else {
        //remoteResponse = this.requestBackendSession();
        const data = { username: identification, password: password };
        let host = ENV.APP.API_HOST;
        let login_url = host + '/taskin/api/auth/login/';
        //let login_url = this.serverAuthEndpoint + 'login/';
        remoteResponse = this.makeRequest(login_url, data);
      }
      remoteResponse
      .then((response) => {
        Ember.run(() => {
          //console.log('django authenticate response:',response);
          resolve(response);
        });
      }, (xhr /*, status, error */) => {
        Ember.run(() => {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },

  /*
  restore(data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let host = ENV.APP.API_HOST;
      let meUrl = host + '/api/auth/me/';
      fetch(meUrl).then(( response ) => {
        resolve(data);
      }, ( xhr , status, error ) => {
        reject();
        this.invalidate();
      });
    });
  },
  */


  restore(data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      //console.log('authenticator django restore data', data);
      let host = ENV.APP.API_HOST;
      let verifyTokenUrl = host + '/taskin/api/auth/verify-token/';
      let access_token = {token:data.access_token};
      this.makeRequest(verifyTokenUrl, access_token).then((response) => {
        Ember.run(() => {
          resolve(response);
        });
      }, (/* xhr , status, error */) => {
        reject();
        //this.invalidate();
        //this.authenticate();
      });
    });
  },

  /*
  invalidate( data ) {
    function success(resolve) {
      resolve();
    }
    return new Ember.RSVP.Promise((resolve , reject ) => {
      //let logout_url = this.serverAuthEndpoint + 'logout/';
      let host = ENV.APP.API_HOST;
      let logout_url = host + '/api-auth/logout/';
      this.makeRequest(logout_url, {}).then(( response ) => {
        Ember.run(() => {
          success(resolve);
        });
      }, ( xhr, status, error ) => {
        Ember.run(() => {
          success(resolve);
        });
      });
    });
  },
  */

  makeRequest(url, data) {
    if (!isSecureUrl(url)) {
      Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: url,
        type: 'POST',
        beforeSend: function(request) {
          request.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
        },
        data: data,
      })
      .then((response) => {
        if (response.status === 400) {
          response.json().then((json) => {
            reject(json);
          });

        } else if (response.status > 400) {
          reject(response);
        } else {
          resolve(response);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },

  requestBackendSession(){

    let host = ENV.APP.API_HOST;
    let url = host + '/taskin/api/auth/token-sessionid/';
    let csrftoken = Cookies.get('csrftoken');
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: url,
        type: 'POST',
        beforeSend: function(xhr/*, settings*/) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        xhrFields: {
            withCredentials: true
        },
      })
      .then((response) => {
        if (response.status === 400) {
          response.json().then((json) => {
            reject(json);
          });

        } else if (response.status > 400) {
          reject(response);
        } else {
          resolve(response);
        }
      }).catch((err) => {
        reject(err);
        this.invalidate();
      });
    });
  }
});
