"use strict";



define('ember-taskin/adapters/application', ['exports', 'ember-taskin/adapters/drf'], function (exports, _emberTaskinAdaptersDrf) {
  exports['default'] = _emberTaskinAdaptersDrf['default'];
});
define('ember-taskin/adapters/drf', ['exports', 'ember', 'ember-django-adapter/adapters/drf', 'ember-taskin/config/environment'], function (exports, _ember, _emberDjangoAdapterAdaptersDrf, _emberTaskinConfigEnvironment) {
  exports['default'] = _emberDjangoAdapterAdaptersDrf['default'].extend({
    host: _ember['default'].computed(function () {
      return _emberTaskinConfigEnvironment['default'].APP.API_HOST;
    }),

    namespace: _ember['default'].computed(function () {
      return _emberTaskinConfigEnvironment['default'].APP.API_NAMESPACE;
    })
  });
});
define('ember-taskin/app', ['exports', 'ember', 'ember-taskin/resolver', 'ember-load-initializers', 'ember-taskin/config/environment'], function (exports, _ember, _emberTaskinResolver, _emberLoadInitializers, _emberTaskinConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _emberTaskinConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _emberTaskinConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberTaskinResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _emberTaskinConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('ember-taskin/application/adapter', ['exports', 'ember-taskin/adapters/drf', 'ember-simple-auth/mixins/data-adapter-mixin'], function (exports, _emberTaskinAdaptersDrf, _emberSimpleAuthMixinsDataAdapterMixin) {
  exports['default'] = _emberTaskinAdaptersDrf['default'].extend(_emberSimpleAuthMixinsDataAdapterMixin['default'], {
    authorizer: 'authorizer:django'
  });
});
// app/application/adapter.js
define('ember-taskin/application/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    session: _ember['default'].inject.service('session'),
    actions: {
      selectProject: function selectProject(project_id) {
        var project = this.store.peekRecord('project', project_id);
        this.get('session').set('data.project', { 'id': project.id, 'name': project.get('name') });
        //this.transitionToRoute('tasks', {queryParams: {project: project.id}});
        this.transitionToRoute('tasks', project.id);
      }
    }
  });
});
define('ember-taskin/application/route', ['exports', 'ember', 'ember-simple-auth/mixins/application-route-mixin'], function (exports, _ember, _emberSimpleAuthMixinsApplicationRouteMixin) {
  exports['default'] = _ember['default'].Route.extend(_emberSimpleAuthMixinsApplicationRouteMixin['default'], {
    session: _ember['default'].inject.service('session'),
    init: function init() {
      this.get('session').authenticate('authenticator:django');
    },

    titleToken: 'Projects',

    model: function model() {
      return this.get('store').findAll('project');
    },

    setupController: function setupController(controller, model) {
      controller.set("model", model);

      var sessionProjectName = this.get('session.data.project.name');
      //console.log(this.get('session.data.project.id'));
      var session = this.get('session');
      this.store.query('project', { 'name': sessionProjectName }).then(function (currentProject) {
        if (currentProject.get('length') == 0) {
          session.set('data.project', {});
        }
      });
    }
  });
});
define("ember-taskin/application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vvO1jJZB", "block": "{\"statements\":[[\"comment\",\"\\n{{#link-to 'projects' (query-params page=1)}}<a class=\\\"navbar-brand\\\" href>Taskin projects</a>{{/link-to}}\\n{{user-info}}\\n{{outlet}}\\n\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"partial\",\"navbar\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":true}", "meta": { "moduleName": "ember-taskin/application/template.hbs" } });
});
define('ember-taskin/authenticators/django', ['exports', 'ember', 'ember-simple-auth/authenticators/base', 'ember-taskin/config/environment', 'ember-cli-js-cookie'], function (exports, _ember, _emberSimpleAuthAuthenticatorsBase, _emberTaskinConfigEnvironment, _emberCliJsCookie) {

  function isSecureUrl(url) {
    var link = document.createElement('a');
    link.href = url;
    link.href = link.href;
    return link.protocol === 'https:';
  }

  exports['default'] = _emberSimpleAuthAuthenticatorsBase['default'].extend({

    /*
    init() {
      //var apiHost = ENV.APP.API_HOST;
      var apiAuthentication = ENV['ember-simple-auth'] || {};
      this.serverAuthEndpoint = apiAuthentication.serverAuthEndpoint;
     },
    */

    authenticate: function authenticate(identification, password) {
      var _this = this;

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        var remoteResponse = undefined;
        if (!(identification && password)) {
          remoteResponse = _this.requestBackendSession();
        } else {
          //remoteResponse = this.requestBackendSession();
          var data = { username: identification, password: password };
          var host = _emberTaskinConfigEnvironment['default'].APP.API_HOST;
          var login_url = host + '/taskin/api/auth/login/';
          //let login_url = this.serverAuthEndpoint + 'login/';
          remoteResponse = _this.makeRequest(login_url, data);
        }
        remoteResponse.then(function (response) {
          _ember['default'].run(function () {
            //console.log('django authenticate response:',response);
            resolve(response);
          });
        }, function (xhr /*, status, error */) {
          _ember['default'].run(function () {
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

    restore: function restore(data) {
      var _this2 = this;

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        //console.log('authenticator django restore data', data);
        var host = _emberTaskinConfigEnvironment['default'].APP.API_HOST;
        var verifyTokenUrl = host + '/taskin/api/auth/verify-token/';
        var access_token = { token: data.access_token };
        _this2.makeRequest(verifyTokenUrl, access_token).then(function (response) {
          _ember['default'].run(function () {
            resolve(response);
          });
        }, function () /* xhr , status, error */{
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

    makeRequest: function makeRequest(url, data) {
      if (!isSecureUrl(url)) {
        _ember['default'].Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }

      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        _ember['default'].$.ajax({
          url: url,
          type: 'POST',
          beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-CSRFToken", _emberCliJsCookie['default'].get('csrftoken'));
          },
          data: data
        }).then(function (response) {
          if (response.status === 400) {
            response.json().then(function (json) {
              reject(json);
            });
          } else if (response.status > 400) {
            reject(response);
          } else {
            resolve(response);
          }
        })['catch'](function (err) {
          reject(err);
        });
      });
    },

    requestBackendSession: function requestBackendSession() {
      var _this3 = this;

      var host = _emberTaskinConfigEnvironment['default'].APP.API_HOST;
      var url = host + '/taskin/api/auth/token-sessionid/';
      var csrftoken = _emberCliJsCookie['default'].get('csrftoken');
      return new _ember['default'].RSVP.Promise(function (resolve, reject) {
        _ember['default'].$.ajax({
          url: url,
          type: 'POST',
          beforeSend: function beforeSend(xhr /*, settings*/) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          },
          xhrFields: {
            withCredentials: true
          }
        }).then(function (response) {
          if (response.status === 400) {
            response.json().then(function (json) {
              reject(json);
            });
          } else if (response.status > 400) {
            reject(response);
          } else {
            resolve(response);
          }
        })['catch'](function (err) {
          reject(err);
          _this3.invalidate();
        });
      });
    }
  });
});
// front/app/authenticators/django.js
define('ember-taskin/authorizers/django', ['exports', 'ember-simple-auth/authorizers/base', 'ember-cli-js-cookie'], function (exports, _emberSimpleAuthAuthorizersBase, _emberCliJsCookie) {
  exports['default'] = _emberSimpleAuthAuthorizersBase['default'].extend({
    authorize: function authorize(sessionData, block) {
      var csrftoken = _emberCliJsCookie['default'].get('csrftoken');
      block('X-CSRFToken', csrftoken);
    }
  });
});
define('ember-taskin/choiceperson/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    user: _emberData['default'].belongsTo('user'),
    name: _emberData['default'].attr('string'),
    tasks_customer: _emberData['default'].hasMany('task'),
    creator: _emberData['default'].belongsTo('user')
  });
});
define('ember-taskin/choiceuser/model', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Model.extend({
    username: _emberData['default'].attr('string'),
    first_name: _emberData['default'].attr('string'),
    last_name: _emberData['default'].attr('string'),
    //person: DS.belongsTo('company/person', { inverse: null }),
    full_name: _ember['default'].computed('first_name', 'last_name', function () {
      if (this.get('first_name')) {
        return this.get('last_name') + ' ' + this.get('first_name');
      } else {
        return '' + this.get('username');
      }
    })
  });
});
define('ember-taskin/components/date-time-picker', ['exports', 'ember-datetimepicker/components/date-time-picker'], function (exports, _emberDatetimepickerComponentsDateTimePicker) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDatetimepickerComponentsDateTimePicker['default'];
    }
  });
});
define('ember-taskin/components/user-info/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    session: _ember['default'].inject.service('session'),

    actions: {
      invalidateSession: function invalidateSession() {
        this.get('session').invalidate();
      }
    }
  });
});
define("ember-taskin/components/user-info/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+6rSZPWP", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"navbar-right\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"session\",\"isAuthenticated\"]]],null,2,1],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"t\"],[\"Login\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"style\",\"color:white;margin-right:10px;\"],[\"flush-element\"],[\"text\",\"\\n      You aren't authenticated.\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"login\"],[[\"class\",\"role\"],[\"btn btn-default btn-login\",\"button\"]],0]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"style\",\"color:black;\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"if\"],[[\"get\",[\"session\",\"data\",\"authenticated\",\"user\",\"first_name\"]],[\"get\",[\"session\",\"data\",\"authenticated\",\"user\",\"first_name\"]],[\"get\",[\"session\",\"data\",\"authenticated\",\"user\",\"username\"]]],null],false],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"invalidateSession\"]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"t\"],[\"Logout\"],null],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/components/user-info/template.hbs" } });
});
define('ember-taskin/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _emberWelcomePageComponentsWelcomePage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWelcomePageComponentsWelcomePage['default'];
    }
  });
});
define('ember-taskin/helpers/app-version', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _emberTaskinConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('ember-taskin/helpers/is-after', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/is-after'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersIsAfter) {
  exports['default'] = _emberMomentHelpersIsAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/is-before', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/is-before'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersIsBefore) {
  exports['default'] = _emberMomentHelpersIsBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/is-between', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/is-between'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersIsBetween) {
  exports['default'] = _emberMomentHelpersIsBetween['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/is-same-or-after', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersIsSameOrAfter) {
  exports['default'] = _emberMomentHelpersIsSameOrAfter['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/is-same-or-before', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersIsSameOrBefore) {
  exports['default'] = _emberMomentHelpersIsSameOrBefore['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/is-same', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/is-same'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersIsSame) {
  exports['default'] = _emberMomentHelpersIsSame['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-add', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-add'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentAdd) {
  exports['default'] = _emberMomentHelpersMomentAdd['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-calendar', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentCalendar) {
  exports['default'] = _emberMomentHelpersMomentCalendar['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('ember-taskin/helpers/moment-format', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-from-now', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-from', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-from'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentFrom) {
  exports['default'] = _emberMomentHelpersMomentFrom['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-subtract', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-subtract'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentSubtract) {
  exports['default'] = _emberMomentHelpersMomentSubtract['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-to-date', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-to-date'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentToDate) {
  exports['default'] = _emberMomentHelpersMomentToDate['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-to-now', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-to', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/helpers/moment-to'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentHelpersMomentTo) {
  exports['default'] = _emberMomentHelpersMomentTo['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('ember-taskin/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('ember-taskin/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _emberMomentHelpersMoment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMoment['default'];
    }
  });
});
define('ember-taskin/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _emberMomentHelpersNow) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersNow['default'];
    }
  });
});
define('ember-taskin/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('ember-taskin/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('ember-taskin/helpers/t', ['exports', 'ember-i18n/helper'], function (exports, _emberI18nHelper) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberI18nHelper['default'];
    }
  });
});
define('ember-taskin/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _emberMomentHelpersUnix) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix['default'];
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersUnix.unix;
    }
  });
});
define('ember-taskin/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'ember-taskin/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _emberTaskinConfigEnvironment) {
  var _config$APP = _emberTaskinConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('ember-taskin/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('ember-taskin/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ember-taskin/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('ember-taskin/initializers/ember-i18n', ['exports', 'ember-i18n/initializers/ember-i18n'], function (exports, _emberI18nInitializersEmberI18n) {
  exports['default'] = _emberI18nInitializersEmberI18n['default'];
});
define('ember-taskin/initializers/ember-simple-auth', ['exports', 'ember-taskin/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _emberTaskinConfigEnvironment, _emberSimpleAuthConfiguration, _emberSimpleAuthInitializersSetupSession, _emberSimpleAuthInitializersSetupSessionService) {
  exports['default'] = {
    name: 'ember-simple-auth',

    initialize: function initialize(registry) {
      var config = _emberTaskinConfigEnvironment['default']['ember-simple-auth'] || {};
      config.baseURL = _emberTaskinConfigEnvironment['default'].rootURL || _emberTaskinConfigEnvironment['default'].baseURL;
      _emberSimpleAuthConfiguration['default'].load(config);

      (0, _emberSimpleAuthInitializersSetupSession['default'])(registry);
      (0, _emberSimpleAuthInitializersSetupSessionService['default'])(registry);
    }
  };
});
define('ember-taskin/initializers/export-application-global', ['exports', 'ember', 'ember-taskin/config/environment'], function (exports, _ember, _emberTaskinConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_emberTaskinConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _emberTaskinConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_emberTaskinConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('ember-taskin/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ember-taskin/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('ember-taskin/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("ember-taskin/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('ember-taskin/instance-initializers/ember-i18n', ['exports', 'ember-i18n/instance-initializers/ember-i18n'], function (exports, _emberI18nInstanceInitializersEmberI18n) {
  exports['default'] = _emberI18nInstanceInitializersEmberI18n['default'];
});
define('ember-taskin/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _emberSimpleAuthInstanceInitializersSetupSessionRestoration) {
  exports['default'] = {
    name: 'ember-simple-auth',

    initialize: function initialize(instance) {
      (0, _emberSimpleAuthInstanceInitializersSetupSessionRestoration['default'])(instance);
    }
  };
});
define("ember-taskin/locales/en/config", ["exports"], function (exports) {
  // Ember-I18n includes configuration for common locales. Most users
  // can safely delete this file. Use it if you need to override behavior
  // for a locale or define behavior for a locale that Ember-I18n
  // doesn't know about.
  exports["default"] = {
    // rtl: [true|FALSE],
    //
    // pluralForm: function(count) {
    //   if (count === 0) { return 'zero'; }
    //   if (count === 1) { return 'one'; }
    //   if (count === 2) { return 'two'; }
    //   if (count < 5) { return 'few'; }
    //   if (count >= 5) { return 'many'; }
    //   return 'other';
    // }
  };
});
define("ember-taskin/locales/en/translations", ["exports"], function (exports) {
  exports["default"] = {
    //tasboard.project translation
    "No person  associated with the user": "No person  associated with the user",
    "Сontact the administrator of the Website": "Сontact the administrator of the Website",
    "Projects": "Projects",
    "Tasks": "Tasks",
    "List projects": "List projects",
    "Task statuses": "Task statuses",
    "Members": "Members",
    "Current project": "Current project",
    "Create new project": "Create new project",
    "All projects": "All projects",
    "Id": "Id",
    "Name": "Name",
    "New project": "New project",
    "Project name": "Project name",
    "About": "About",
    "About this project": "About this project",
    "Are you sure?": "Are you sure?",
    "Total projects": "Total projects",

    //tasboard.task translation
    "Create new task": "Create new task",
    "All tasks": "All tasks",
    "The closed tasks hide": "The closed tasks hide",
    "Filter by executor": "Filter by executor",
    "Executor is empty": "Executor is empty",
    "You can set current project to see project tasks": "You can set current project to see project tasks",
    "Total task": "Total task",
    "Created date": "Created date",
    "Subject": "Subject",
    "Status": "Status",
    "Customer": "Customer",
    "Executors": "Executors",
    "New task": "New task",
    "This task closed": "This task closed",
    "Project": "Project",
    "Enter subject": "Enter subject",
    "Reason": "Reason",
    "Why do you create this task?": "Why do you create this task?",
    "About this task": "About this task",
    "Execute to date": "Execute to date",
    "Deadline for execution": "Deadline for execution",
    "date in russian format": "date in russian format",
    "Accept for execution": "Accept for execution",
    "Remove executor": "Remove executor",
    "Task completed": "Task completed",
    "Add executor": "Add executor",
    "Task": "Task",
    "detail": "detail",
    "Created": "Created",
    "Creator": "Creator",
    "Date closed": "Date closed",
    "Accepted for execution": "Accepted for execution",
    "edit": "edit",
    "The (person.name)'s tasks in '(session.data.project.name)'": "The {{personname}}'s' tasks in \"{{projectname}}\"",
    "The tasks in '(session.data.project.name)' without executor": "The tasks in \"{{projectname}}\" without executor",
    "(user.person_name)'s tasks to execution": "{{username}} 's tasks to execution",
    "Add new file": "Add new file",
    "Files": "Files",
    "Adding a new file": "Adding a new file",
    "Uploaded": "Uploaded",

    // taskboard.taskcomments translation
    "Comments": "Comments",
    "New comment": "New comment",
    "Add new comment": "Add new comment",
    "View comments": "View comments",
    "Comment text": "Comment text",

    // taskboard.taskstatus translation
    //"The project '(session.data.project.name)'s' task statuses":`Статусы задач в "{{project_name}}"`,
    "Create task status": "Create task status",
    "Task status list": "Task status list",
    "Order": "Order",
    "Task status edit": "Task status edit",
    "Enter name": "Enter name",
    "Enter index number": "Enter index number",
    "New task status": "New task status",
    "You can not authenticated.": "You can not authenticated.",

    // taskboard.members translation
    //"Project '(session.data.project.name)' members": `Участники проекта "{{project_name}}"`,

    "Add member": "Add member",
    "Members list": "Members list",
    "Member": "Member",
    "Right": "Right",
    "New member": "New member",
    "Select member": "Select member",
    "Select right": "Select right",
    "Executor": "Executor",
    "Watcher": "Watcher",
    "Administrator": "Administrator",
    'No account for ': 'No account for ',

    "Your changes haven't saved yet. Would you like to leave this form?": "Your changes haven't saved yet. Would you like to leave this form?",

    //labels & buttons translation
    "Password": "Password",
    "User": "User",
    "Logout": "Logout",
    "Login": "Login",
    "Delete": "Delete",
    "Save": "Save",
    "Edit": "Edit",
    "Cancel": "Cancel",
    "Current page": "Current page",
    "Previous": "Previous",
    "Next": "Next",
    "Save changes": "Save changes",
    "Add": "Add",
    "Detail": "Detail"

  };
});
// "some.translation.key": "Text for some.translation.key",
//
// "a": {
//   "nested": {
//     "key": "Text for a.nested.key"
//   }
// },
//
// "key.with.interpolation": "Text with {{anInterpolation}}"
define("ember-taskin/locales/ru/config", ["exports"], function (exports) {
  // Ember-I18n includes configuration for common locales. Most users
  // can safely delete this file. Use it if you need to override behavior
  // for a locale or define behavior for a locale that Ember-I18n
  // doesn't know about.
  exports["default"] = {
    // rtl: [true|FALSE],
    //
    // pluralForm: function(count) {
    //   if (count === 0) { return 'zero'; }
    //   if (count === 1) { return 'one'; }
    //   if (count === 2) { return 'two'; }
    //   if (count < 5) { return 'few'; }
    //   if (count >= 5) { return 'many'; }
    //   return 'other';
    // }
  };
});
define("ember-taskin/locales/ru/translations", ["exports"], function (exports) {
  exports["default"] = {
    //tasboard.project translation
    "No person  associated with the user": "Ни один человек не связан с пользователем",
    "Сontact the administrator of the Website": "Обратитесь к администратору сайта",
    "Projects": "Проекты",
    "Tasks": "Задачи",
    "List projects": "Список проектов",
    "Task statuses": "Статусы задач",
    "Members": "Участники",
    "Current project": "Текущий проект",
    "Create new project": "Создать новый проект",
    "All projects": "Все проекты",
    "Id": "Номер",
    "Name": "Название",
    "New project": "Новый проект",
    "Project name": "Название проекта",
    "About": "Описание",
    "About this project": "Описание этого проекта",
    "Are you sure?": "Вы уверены?",
    "Total projects": "Всего проектов",

    //tasboard.task translation
    "Create new task": "Создать новую задачу",
    "All tasks": "Все задачи",
    "The closed tasks hide": "Скрыть закрытые",
    "Filter by executor": "Фильтр по исполнителям",
    "Executor is empty": "Без исполнителя",
    "You can set current project to see project tasks": "Для просмотра задач нужно выбрать проект из списка",
    "Total task": "Всего задач",
    "Created date": "Дата создания",
    "Subject": "Тема",
    "Status": "Статус",
    "Customer": "Заказчик",
    "Executors": "Исполнители",
    "New task": "Новая задача",
    "This task closed": "Эта задача закрыта",
    "Project": "Проект",
    "Enter subject": "Введите тему задачи",
    "Reason": "Основание",
    "Why do you create this task?": "Почему вы создаете эту задачу?",
    "About this task": "Описание этой задачи",
    "Execute to date": "Выполнить до даты",
    "Deadline for execution": "Крайний срок исполнения",
    "date in russian format": "русский формат даты",
    "Accept for execution": "Принять к исполнению",
    "Remove executor": "Убрать исполнителя",
    "Task completed": "Задача выполнена",
    "Add executor": "Добавить исполнителя",
    "Task": "Задача",
    "detail": "детали",
    "Created": "Создана",
    "Creator": "Создал",
    "Date closed": "Дата закрытия",
    "Accepted for execution": "Принята к исполнению",
    "edit": "редактирование",
    "The (person.name)'s tasks in '(session.data.project.name)'": "Задачи для {{personname}} в \"{{projectname}}\"",
    "The tasks in '(session.data.project.name)' without executor": "Задачи без исполнителя в \"{{projectname}}\"",
    "(user.person_name)'s tasks to execution": "Задачи к исполнению для {{username}}",
    "Add new file": "Добавить файл",
    "Files": "Файлы",
    "Adding a new file": "Добавление нового файла",
    "Uploaded": "Загрузил(а)",

    // taskboard.taskcomments translation
    "Comments": "Комментарии",
    "New comment": "Новый комментарий",
    "Add new comment": "Добавить новый комментарий",
    "View comments": "Показать комментарии",
    "Comment text": "Текст комментария",

    // taskboard.taskstatus translation
    //"The project '(session.data.project.name)'s' task statuses":`Статусы задач в "{{project_name}}"`,
    "Create task status": "Добавить статус задачи",
    "Task status list": "Список статусов задач",
    "Order": "Номер по порядку",
    "Task status edit": "Редактирование статуса задачи",
    "Enter name": "Введите название",
    "Enter index number": "Введите порядковый номер",
    "New task status": "Новый статус задачи",
    "You can not authenticated.": "Необходима аутентификация.",

    // taskboard.members translation
    //"Project '(session.data.project.name)' members": `Участники проекта "{{project_name}}"`,

    "Add member": "Добавить участника",
    "Members list": "Список участников",
    "Member": "Участник",
    "Right": "Права",
    "New member": "Новый участник",
    "Select member": "Выберите участника",
    "Select right": "Выберите права",
    "Executor": "Исполнитель",
    "Watcher": "Наблюдатель",
    "Administrator": "Администратор",
    'No account for ': 'Нет учетной записи для ',

    "Your changes haven't saved yet. Would you like to leave this form?": "Ваши изменения не сохранены. Хотите перейти на другую страницу?",

    //labels & buttons translation
    "Password": "Пароль",
    "User": "Пользователь",
    "Logout": "Выход",
    "Login": "Вход",
    "Delete": "Удалить",
    "Save": "Сохранить",
    "Edit": "Редактировать",
    "Cancel": "Отмена",
    "Current page": "Текущая страница",
    "Previous": "Предыдущая",
    "Next": "Следующая",
    "Save changes": "Сохранить изменения",
    "Add": "Добавить",
    "Detail": "Детали"

  };
});
// "some.translation.key": "Text for some.translation.key",
//
// "a": {
//   "nested": {
//     "key": "Text for a.nested.key"
//   }
// },
//
// "key.with.interpolation": "Text with {{anInterpolation}}"
define('ember-taskin/login/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    session: _ember['default'].inject.service('session'),

    actions: {
      authenticate: function authenticate() {
        var _this = this;

        var _getProperties = this.getProperties('identification', 'password');

        var identification = _getProperties.identification;
        var password = _getProperties.password;

        this.get('session').authenticate('authenticator:django', identification, password)
        //this.get('session').authenticate('authenticator:django')
        .then(function () {
          //console.log('Success! authenticated with token: ' + this.get('session.data.authenticated.access_token'));
          _this.transitionToRoute('taskin');
        }, function (err) {
          //alert('Error obtaining token: ' + err.responseText);
          alert('Ошибка входа: ' + err.error);
          _this.transitionToRoute('login');
        })['catch'](function (reason) {
          _this.set('errorMessage', reason.error || reason);
        });
      },

      invalidateSession: function invalidateSession() {
        this.get('session').invalidate();
      }
    }
  });
});
// app/login/controller.js
define("ember-taskin/login/route", ["exports", "ember"], function (exports, _ember) {
  exports["default"] = _ember["default"].Route.extend({

    redirect: function redirect() {
      window.location.replace("/taskin/api-auth/login/?next=/taskin/");
    }

  });
});
define("ember-taskin/login/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "P2cWGArY", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Login\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"authenticate\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"identification\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"User\"],null],false],[\"close-element\"],[\"text\",\"\\n   \"],[\"append\",[\"helper\",[\"input\"],null,[[\"id\",\"class\",\"placeholder\",\"value\"],[\"identification\",\"form-control\",\"Enter Login\",[\"get\",[\"identification\"]]]]],false],[\"text\",\"\\n \"],[\"close-element\"],[\"text\",\"\\n \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"password\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Password\"],null],false],[\"close-element\"],[\"text\",\"\\n   \"],[\"append\",[\"helper\",[\"input\"],null,[[\"id\",\"class\",\"placeholder\",\"type\",\"value\"],[\"password\",\"form-control\",\"Enter Password\",\"password\",[\"get\",[\"password\"]]]]],false],[\"text\",\"\\n \"],[\"close-element\"],[\"text\",\"\\n \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Login\"],null],false],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/login/template.hbs" } });
});
define('ember-taskin/member/choice/transform', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Transform.extend({
    i18n: _ember['default'].inject.service(),

    deserialize: function deserialize(serialized) {
      if (serialized === 'AD') {
        return this.get('i18n').t('Administrator');
      } else if (serialized === 'EX') {
        return this.get('i18n').t('Executor');
      } else if (serialized === 'WA') {
        return this.get('i18n').t('Watcher');
      }
      return serialized;
    },

    serialize: function serialize(deserialized) {

      if (deserialized === 'Administrator') {
        return 'AD';
      } else if (deserialized === 'Executor') {
        return 'EX';
      } else if (deserialized === 'Watcher') {
        return 'WA';
      }

      return deserialized;
    }
  });
});
define('ember-taskin/member/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    user: _emberData['default'].belongsTo('user'),
    project: _emberData['default'].belongsTo('project'),
    //right: DS.attr('string'),
    right: _emberData['default'].attr('member/choice'),
    taskexecutor_set: _emberData['default'].hasMany('taskexecutor')
  });
});
define('ember-taskin/members/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/members/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "g98iEzgS", "block": "{\"statements\":[[\"text\",\"The Member edit needs to be done\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/members/edit/template.hbs" } });
});
define("ember-taskin/members/index/route", ["exports", "ember"], function (exports, _ember) {
  exports["default"] = _ember["default"].Route.extend({
    setupController: function setupController(controller, model) {
      controller.set("model", model);
      //this.store.query('member', {project: model.get('project.id')}, {include: 'user.person'});
      //console.log(this.store.peekAll('people/user', {include: 'person'}));
    }
  });
});
define("ember-taskin/members/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "UCflkiJr", "block": "{\"statements\":[[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Member\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Right\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"unknown\",[\"member\",\"user\",\"full_name\"]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"unknown\",[\"member\",\"right\"]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"members.edit\",[\"get\",[\"member\"]]],[[\"class\"],[\"btn btn-default\"]],0],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteMember\",[\"get\",[\"member\",\"id\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/members/index/template.hbs" } });
});
define('ember-taskin/members/new/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    i18n: _ember['default'].inject.service(),
    userValue: '',
    actions: {
      focusedMember: function focusedMember() {
        //console.log('focusedCustomer');
        _ember['default'].$('#btn-search').click();
        this.store.unloadAll('choiceuser');
      },
      handleFilterMember: function handleFilterMember() {
        var filterInputValue = this.get('userValue');
        if (filterInputValue.length < 2) {
          this.store.unloadAll('choiceuser');
          //this.store.query('member', {project: this.model.project.id});
        } else {
            this.store.unloadAll('choiceuser');
            this.store.query('choiceuser', { full_name: filterInputValue });
            //this.store.query('member', {project: this.model.project.id});
          }
      },

      memberClick: function memberClick(full_name, user_id) {
        var model = this.get('model');
        this.store.findRecord('taskin/user', user_id).then(function (user) {
          model.set('user', user);
        });
        this.set("userValue", full_name);
      },

      selectUser: function selectUser(user_id) {
        var user = this.store.peekRecord('taskin/user', user_id);
        this.set('model.user', user);
      },

      selectRight: function selectRight(right_value) {
        this.set('model.right', right_value);
      }
    }
  });
});
define('ember-taskin/members/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.createRecord('member', {
        project: this.modelFor('projects/show')
      });
    },

    setupController: function setupController(controller, model) {
      controller.set("model", model);
      controller.set('choiceUser', this.store.peekAll('choiceuser'));
      //controller.set('choicePeople',this.store.peekAll('choiceperson'));
    },

    actions: {
      addMember: function addMember(newMember) {
        var _this = this;

        //console.log(newMember);
        newMember.save().then(function () {
          _this.transitionTo('members', _this.modelFor('projects/show'));
        });
      },

      willTransition: function willTransition() /*transition*/{

        var model = this.controller.get('model');
        this.controller.set("userValue", '');

        if (model.get('hasDirtyAttributes')) {
          model.rollbackAttributes();
        } else {
          return true;
        }
      }
    }
  });
});
define("ember-taskin/members/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "7VFD1erO", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New member\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"form\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Member\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"top dropdown col-sm-10\"],[\"static-attr\",\"id\",\"search-bar\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"fa fa-search\"],[\"static-attr\",\"id\",\"btn-search\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"focus-in\",\"key-up\",\"autocomplete\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"userValue\"]],\"focusedMember\",[\"helper\",[\"action\"],[[\"get\",[null]],\"handleFilterMember\"],null],\"off\",\"form-control\",\"Введите заказчика\"]]],false],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"choiceUser\"]]],null,0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Right\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectRight\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Select right\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"EX\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executor\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"WA\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Watcher\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"AD\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Administrator\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addMember\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Add\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"list-group-item\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"memberClick\",[\"get\",[\"user\",\"full_name\"]],[\"get\",[\"user\",\"id\"]]],null],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/members/new/template.hbs" } });
});
define('ember-taskin/members/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),
    model: function model() {
      return this.modelFor('projects/show').get('projectmember_set');
    },

    actions: {
      deleteMember: function deleteMember(member_id) {
        var confirmation = confirm(this.get('i18n').t("Are you sure?"));
        var member = this.store.peekRecord('member', member_id);
        if (confirmation) {
          member.destroyRecord();
        }
      }
    }
  });
});
define('ember-taskin/members/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/members/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "y42uluFk", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/members/show/template.hbs" } });
});
define("ember-taskin/members/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "N0eWFel9", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Members\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"unknown\",[\"model\",\"id\"]],false],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"members.new\"],[[\"tagName\"],[\"li\"]],1],[\"block\",[\"link-to\"],[\"members\"],[[\"tagName\"],[\"li\"]],0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Members list\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Add member\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/members/template.hbs" } });
});
define("ember-taskin/navbar/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "okRdCGDt", "block": "{\"statements\":[[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"navbar navbar-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"navbar-header\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"block\",[\"link-to\"],[\"application\"],null,7],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"dropdown-toggle\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"static-attr\",\"href\",\"#\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"t\"],[\"Projects\"],null],false],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"caret\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"projects\"],[[\"tagName\"],[\"li\"]],6],[\"block\",[\"link-to\"],[\"projects.new\"],[[\"tagName\"],[\"li\"]],5],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"navbar-form navbar-left\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectProject\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"session\",\"data\",\"project\",\"name\"]]],null,4,3],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"session\",\"data\",\"project\",\"name\"]]],null,1],[\"text\",\"    \"],[\"append\",[\"unknown\",[\"user-info\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"tasks\",[\"get\",[\"session\",\"data\",\"project\",\"id\"]]],[[\"tagName\"],[\"li\"]],0],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"project\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"project\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"project\"]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Current project\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"session\",\"data\",\"project\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"session\",\"data\",\"project\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Create new project\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"All projects\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"class\",\"navbar-brand\"],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Taskin\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/navbar/template.hbs" } });
});
define('ember-taskin/not-found/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    redirect: function redirect() {
      var url = this.router.location.formatURL('/not-found');
      if (window.location.pathname !== url) {
        this.transitionTo('/not-found');
      }
    }
  });
});
define("ember-taskin/not-found/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "UWXWJAr/", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"404 Page not found\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/not-found/template.hbs" } });
});
define('ember-taskin/people/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('ember-taskin/people/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/people/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4sVuKeGl", "block": "{\"statements\":[[\"text\",\"Person detail page\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/people/show/template.hbs" } });
});
define("ember-taskin/people/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "bp5jQ5ZG", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/people/template.hbs" } });
});
define('ember-taskin/person/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    user: _emberData['default'].belongsTo('user'),
    name: _emberData['default'].attr('string'),
    tasks_customer: _emberData['default'].hasMany('task'),
    creator: _emberData['default'].belongsTo('user')
  });
});
define('ember-taskin/project/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    date_created: _emberData['default'].attr('date'),
    creator: _emberData['default'].belongsTo('user'),
    //members: DS.hasMany('member'),
    members: _emberData['default'].hasMany('user'),
    projectmember_set: _emberData['default'].hasMany('member'),
    about: _emberData['default'].attr('string'),
    task_statuses: _emberData['default'].hasMany('taskstatus'),
    tasks: _emberData['default'].hasMany('task')
  });
});
define('ember-taskin/projects/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findRecord('project', params.project_id);
    }
  });
});
define("ember-taskin/projects/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "mlENOgFj", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Project \\\"\"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\\" detail\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Name: \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Created: \"],[\"append\",[\"unknown\",[\"model\",\"date_created\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"About: \"],[\"append\",[\"unknown\",[\"model\",\"about\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Creator: \"],[\"append\",[\"unknown\",[\"model\",\"creator\",\"username\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Members:\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,2],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Task statuses:\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"task_statuses\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"tasks\",[\"get\",[\"model\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"task_status\",\"name\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task_status\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"member\",\"id\"]],false],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"member\",\"user\",\"username\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/projects/edit/template.hbs" } });
});
define('ember-taskin/projects/index/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/projects/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "c7LyxBi7", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"projects.new\"],[[\"tagName\"],[\"li\"]],7],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"List projects\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Id\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task statuses\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Members\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,6],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Total projects\"],null],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"model\",\"length\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false]],\"locals\":[]},{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Members\"],null],false]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task statuses\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"unknown\",[\"project\",\"name\"]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"append\",[\"unknown\",[\"project\",\"id\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"projects.show\",[\"get\",[\"project\"]]],null,5],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"projects.show\",[\"get\",[\"project\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],4],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"tasks\",[\"get\",[\"project\"]]],null,3],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskstatuses\",[\"get\",[\"project\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"members\",[\"get\",[\"project\"]]],null,1],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"projects.edit\",[\"get\",[\"project\"]]],[[\"class\"],[\"btn btn-default\"]],0],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteProject\",[\"get\",[\"project\"]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"project\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Create new project\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/projects/index/template.hbs" } });
});
define('ember-taskin/projects/new/route', ['exports', 'ember', 'rsvp', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _ember, _rsvp, _emberSimpleAuthMixinsAuthenticatedRouteMixin) {
  exports['default'] = _ember['default'].Route.extend(_emberSimpleAuthMixinsAuthenticatedRouteMixin['default'], {

    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),

    model: function model() {
      return _rsvp['default'].hash({
        project: this.store.createRecord('project'),
        creator: this.store.findRecord('user', this.get('session.data.authenticated.user.id'))
      });
    },

    actions: {

      saveProject: function saveProject(newProject) {
        var _this = this;

        //let creator_id = this.get('session.data.authenticated.user.id');
        var creator = this.controller.get('model.creator');
        //let person = creator.get('person')
        this.controller.set('model.project.creator', creator);
        newProject.save().then(function (project) {
          //set new project as default
          _this.get('session').set('data.project', { 'id': project.id, 'name': project.get('name') });
        }).
        //then(() => this.transitionTo('project'));
        then(function () {
          return _this.transitionTo('tasks', newProject.id);
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model.project');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define("ember-taskin/projects/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Pup3ZhmG", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New project\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"project\",\"name\"]],[\"helper\",[\"t\"],[\"Project name\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"project\",\"about\"]],[\"helper\",[\"t\"],[\"About this project\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveProject\",[\"get\",[\"model\",\"project\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/projects/new/template.hbs" } });
});
define('ember-taskin/projects/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),
    model: function model() {
      return this.store.findAll('project');
    },

    actions: {
      deleteProject: function deleteProject(project) {
        var confirmation = confirm(this.get('i18n').t("Are you sure?"));
        //let project = this.store.peekRecord('project', project_id);
        if (confirmation) {
          project.destroyRecord();
        }
      }
    }
  });
});
define("ember-taskin/projects/show/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "52GOzPUn", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Name: \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Created: \"],[\"append\",[\"unknown\",[\"model\",\"date_created\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"About: \"],[\"append\",[\"unknown\",[\"model\",\"about\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Creator: \"],[\"append\",[\"unknown\",[\"model\",\"creator\",\"username\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Members:\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"block\",[\"link-to\"],[\"members\",[\"get\",[\"model\"]]],null,4],[\"text\",\"\\n    \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,3],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Task statuses:\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskstatuses\",[\"get\",[\"model\"]]],null,2],[\"text\",\"    \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"task_statuses\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"tasks\",[\"get\",[\"model\"]]],null,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"task_status\",\"name\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task_status\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"member\",\"person_name\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]},{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/projects/show/index/template.hbs" } });
});
define('ember-taskin/projects/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findRecord('project', params.project_id);
    }
  });
});
define("ember-taskin/projects/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "y7GMnswS", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Project\"],null],false],[\"text\",\":\\n\"],[\"block\",[\"link-to\"],[\"projects.show\",[\"get\",[\"model\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],0],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/projects/show/template.hbs" } });
});
define("ember-taskin/projects/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "9MjaHJko", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n  \\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/projects/template.hbs" } });
});
define('ember-taskin/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('ember-taskin/router', ['exports', 'ember', 'ember-taskin/config/environment'], function (exports, _ember, _emberTaskinConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _emberTaskinConfigEnvironment['default'].locationType,
    rootURL: _emberTaskinConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('login');
    this.route('projects', function () {
      this.route('new');
      this.route('edit', {
        path: ':project_id/edit'
      });
      this.route('show', { path: ':project_id' }, function () {
        this.route('members', { path: "/members", resetNamespace: true }, function () {
          this.route('new');
          this.route('show', {
            path: ':member_id'
          });
          this.route('edit', {
            path: ':member_id/edit'
          });
        });
        this.route('tasks', { path: "/tasks", resetNamespace: true }, function () {
          this.route('new');

          this.route('show', { path: ':task_id' }, function () {
            this.route('taskcomments', { path: "/comments", resetNamespace: true }, function () {
              this.route('new');
            });
            this.route('taskfiles', { path: "/files", resetNamespace: true }, function () {
              this.route('new');
            });
          });

          this.route('edit', {
            path: ':task_id/edit'
          });
        });
        this.route('taskstatuses', { path: "/taskstatuses", resetNamespace: true }, function () {
          this.route('new');
          this.route('show', {
            path: ':taskstatus_id'
          });
          this.route('edit', {
            path: ':taskstatus_id/edit'
          });
        });
      });
    });

    this.route('login');

    this.route('not-found', {
      path: '/*path'
    });

    this.route('people', function () {
      this.route('show', {
        path: ':person_id'
      });
    });

    /*
    this.route('taskin', function() {
        this.route('tasks');
      this.route('members');
      this.route('taskstatuses');
      this.route('taskcomment');
      this.route('taskcomments');
      this.route('taskfiles');
       this.route('people');
       this.route('taskstatuses', function() {
        this.route('edit');
        this.route('new');
        this.route('show');
      });
       this.route('members', function() {
        this.route('edit');
        this.route('new');
        this.route('show');
      });
       this.route('tasks', function() {
        this.route('edit');
        this.route('new');
        this.route('show');
      });
     });
    */

    /*
    this.route('projects', function() {
      this.route('edit');
      this.route('new');
      this.route('show', function() {});
    });
    this.route('members', function() {
      this.route('edit');
      this.route('new');
      this.route('show');
    });
    this.route('people');
    this.route('tasks', function() {
      this.route('edit');
      this.route('new');
      this.route('show');
    });
    this.route('taskcomments', function() {
      this.route('new');
    });
    this.route('taskfiles', function() {
      this.route('new');
    });
    this.route('taskstatuses', function() {
      this.route('edit');
      this.route('new');
      this.route('show');
    });
    */
  });

  exports['default'] = Router;
});
define('ember-taskin/routes/application', ['exports', 'ember'], function (exports, _ember) {
  var Route = _ember['default'].Route;

  // Ensure the application route exists for ember-simple-auth's `setup-session-restoration` initializer
  exports['default'] = Route.extend();
});
define('ember-taskin/serializers/application', ['exports', 'ember-taskin/serializers/drf'], function (exports, _emberTaskinSerializersDrf) {
  exports['default'] = _emberTaskinSerializersDrf['default'];
});
define('ember-taskin/serializers/drf', ['exports', 'ember-django-adapter/serializers/drf'], function (exports, _emberDjangoAdapterSerializersDrf) {
  exports['default'] = _emberDjangoAdapterSerializersDrf['default'];
});
define('ember-taskin/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('ember-taskin/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _emberCookiesServicesCookies) {
  exports['default'] = _emberCookiesServicesCookies['default'];
});
define('ember-taskin/services/i18n', ['exports', 'ember-i18n/services/i18n'], function (exports, _emberI18nServicesI18n) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberI18nServicesI18n['default'];
    }
  });
});
define('ember-taskin/services/moment', ['exports', 'ember', 'ember-taskin/config/environment', 'ember-moment/services/moment'], function (exports, _ember, _emberTaskinConfigEnvironment, _emberMomentServicesMoment) {
  exports['default'] = _emberMomentServicesMoment['default'].extend({
    defaultFormat: _ember['default'].get(_emberTaskinConfigEnvironment['default'], 'moment.outputFormat')
  });
});
define('ember-taskin/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _emberSimpleAuthServicesSession) {
  exports['default'] = _emberSimpleAuthServicesSession['default'];
});
define('ember-taskin/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _emberSimpleAuthSessionStoresAdaptive) {
  exports['default'] = _emberSimpleAuthSessionStoresAdaptive['default'].extend();
});
define('ember-taskin/task/model', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Model.extend({
    subject: _emberData['default'].attr('string'),
    date_created: _emberData['default'].attr('date'),
    creator: _emberData['default'].belongsTo('user'),
    customer: _emberData['default'].belongsTo('choiceperson'),
    project: _emberData['default'].belongsTo('project'),
    status: _emberData['default'].belongsTo('taskstatus'),
    reason: _emberData['default'].attr('string'),
    about: _emberData['default'].attr('string'),
    date_exec_max: _emberData['default'].attr('date'),
    date_closed: _emberData['default'].attr('date'),
    executors: _emberData['default'].hasMany('member'),
    taskexecutors: _emberData['default'].hasMany('taskexecutor'),
    task_comments: _emberData['default'].hasMany('taskcomment'),
    taskfiles: _emberData['default'].hasMany('taskfile'),
    isOverdue: _ember['default'].computed('date_exec_max', function () {
      if (this.get('date_exec_max')) {
        if (Date.now() > this.get('date_exec_max')) {
          return true;
        }
      }
      return false;
    })
  });
});
define('ember-taskin/taskcomment/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    task: _emberData['default'].belongsTo('task'),
    creator: _emberData['default'].belongsTo('user'),
    text: _emberData['default'].attr('string'),
    date_created: _emberData['default'].attr('date')
  });
});
define('ember-taskin/taskcomments/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),
    model: function model() {
      return this.store.createRecord('taskcomment', {
        task: this.modelFor('tasks/show')
      });
    },

    actions: {
      saveComment: function saveComment(newComment) {
        var _this = this;

        var creator_id = this.get('session.data.authenticated.user.id');
        var creator = this.store.peekRecord('user', creator_id);
        this.controller.set('model.creator', creator);
        newComment.save().then(function () {
          _this.transitionTo('taskcomments');
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
            //this.store.unloadAll('taskexecutor');
          } else {
              transition.abort();
            }
        } else {
          return true;
        }
      }
    }
  });
});
define("ember-taskin/taskcomments/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1d30QMnA", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New comment\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveComment\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-12\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"text\"]],[\"helper\",[\"t\"],[\"Comment text\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskcomments/new/template.hbs" } });
});
define('ember-taskin/taskcomments/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.modelFor('tasks/show').get('task_comments');
    }
  });
});
define("ember-taskin/taskcomments/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VKHGCrNS", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskcomments.new\"],[[\"class\"],[\"btn btn-info\"]],1],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"comment\",\"date_created\"]],\"DD.MM.YYYY HH:mm\"],null],false],[\"text\",\"\\n      \"],[\"open-element\",\"b\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"comment\",\"creator\",\"person_name\"]],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"value\",\"readonly\"],[\"form-control\",[\"get\",[\"comment\",\"text\"]],\"readonly\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"comment\"]},{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Add new comment\"],null],false]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskcomments/template.hbs" } });
});
define('ember-taskin/taskexecutor/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    task: _emberData['default'].belongsTo('task'),
    executor: _emberData['default'].belongsTo('member'),
    date_accepted: _emberData['default'].attr('date'),
    date_closed: _emberData['default'].attr('date')
  });
});
define('ember-taskin/taskfile/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    task: _emberData['default'].belongsTo('task'),
    creator: _emberData['default'].belongsTo('user'),
    attachment: _emberData['default'].attr(),
    name: _emberData['default'].attr('string'),
    upload_date: _emberData['default'].attr('date'),
    size: _emberData['default'].attr('number')
  });
});
define('ember-taskin/taskfiles/index/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskfiles/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "oy6n8y19", "block": "{\"statements\":[[\"block\",[\"link-to\"],[\"taskfiles.new\"],[[\"class\"],[\"btn btn-info\"]],0],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Add new file\"],null],false]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskfiles/index/template.hbs" } });
});
define('ember-taskin/taskfiles/new/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({});
});
define('ember-taskin/taskfiles/new/route', ['exports', 'ember', 'ember-cli-js-cookie'], function (exports, _ember, _emberCliJsCookie) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),
    ajax: _ember['default'].inject.service(),
    model: function model() {
      return this.store.createRecord('taskfile', {
        task: this.modelFor('tasks/show')
      });
    },

    actions: {
      saveFile: function saveFile() {
        var _this = this;

        var model = this.controller.get('model');
        var creator_id = this.get('session.data.authenticated.user.id');
        var creator = this.store.peekRecord('user', creator_id);
        model.set('creator', creator);
        var fileUpload = document.getElementById('file-field').files[0];

        /*
        model.set('attachment', file);
        model.save()
          .then(() => {
            this.transitionTo('taskfiles');
          }).catch(response => {
            console.log(response.errors);
          });
        */
        var host = this.store.adapterFor('application').get('host');
        var url = host + '/taskin/api/taskfiles/';
        //this.get('router.currentRouteName');

        var formData = new FormData();
        formData.append('task', model.get('task.id'));
        formData.append('creator', creator_id);
        formData.append('attachment', fileUpload);

        /*
        let req = new XMLHttpRequest();
        req.open('POST', url);
        let jwtoken = this.get('session.data.authenticated.access_token');
        req.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        req.send(formData)
        this.transitionTo('taskfiles');
        */

        //let jwtoken = this.get('session.data.authenticated.access_token');
        var csrftoken = _emberCliJsCookie['default'].get('csrftoken');

        _ember['default'].$.ajax({
          url: url,
          type: 'POST',
          beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-CSRFToken", csrftoken);
            //request.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
          },
          data: formData,
          processData: false,
          contentType: false
        }).then(function (response) {
          //console.log(response);
          _this.store.findRecord('taskfile', response.id);
          _this.transitionTo('taskfiles');
        })['catch'](function (response) {
          //console.log(response);
          if (response.responseJSON.attachment) {
            _this.controller.set('errorMessage', 'File do not selected');
          }
        });
      },

      willTransition: function willTransition() /*transition*/{
        /*
        let model = this.controller.get('model');
         if (model.get('hasDirtyAttributes')) {
          let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));
           if (confirmation) {
            model.rollbackAttributes();
            //this.store.unloadAll('taskboard/taskexecutor');
            //this.store.unloadAll('people/user');
          } else {
            transition.abort();
          }
        } else {
          return true;
        }
        */
        var model = this.controller.get('model');
        model.rollbackAttributes();
        return true;
      }
    }
  });
});
define("ember-taskin/taskfiles/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "28CITaX0", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Adding a new file\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"errorMessage\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-group\"],[\"flush-element\"],[\"text\",\"\\n\\n      \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"file\"],[\"static-attr\",\"id\",\"file-field\"],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"name\",\"file\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveFile\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskfiles/new/template.hbs" } });
});
define('ember-taskin/taskfiles/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.modelFor('tasks/show').get('taskfiles');
    }
  });
});
define("ember-taskin/taskfiles/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "pxYcYHx+", "block": "{\"statements\":[[\"open-element\",\"h4\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Files\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"a\",[]],[\"dynamic-attr\",\"href\",[\"concat\",[[\"unknown\",[\"item\",\"attachment\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"item\",\"name\"]],false],[\"close-element\"],[\"text\",\" -\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Uploaded\"],null],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"item\",\"creator\",\"person_name\"]],false],[\"text\",\",\\n      \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"item\",\"upload_date\"]],\"DD.MM.YYYY HH:mm\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskfiles/template.hbs" } });
});
define('ember-taskin/taskin/choiceperson/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    user: _emberData['default'].belongsTo('taskin/user'),
    name: _emberData['default'].attr('string'),
    tasks_customer: _emberData['default'].hasMany('taskin/task'),
    creator: _emberData['default'].belongsTo('taskin/user')
  });
});
define('ember-taskin/taskin/choiceuser/model', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Model.extend({
    username: _emberData['default'].attr('string'),
    first_name: _emberData['default'].attr('string'),
    last_name: _emberData['default'].attr('string'),
    //person: DS.belongsTo('company/person', { inverse: null }),
    full_name: _ember['default'].computed('first_name', 'last_name', function () {
      if (this.get('first_name')) {
        return this.get('last_name') + ' ' + this.get('first_name');
      } else {
        return '' + this.get('username');
      }
    })
  });
});
define('ember-taskin/taskin/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    session: _ember['default'].inject.service('session'),
    actions: {
      selectProject: function selectProject(project_id) {
        var project = this.store.peekRecord('taskin/project', project_id);
        this.get('session').set('data.project', { 'id': project.id, 'name': project.get('name') });
        //this.transitionToRoute('taskin.tasks', {queryParams: {project: project.id}});
        this.transitionToRoute('taskin.tasks', project.id);
      }
    }
  });
});
define('ember-taskin/taskin/login/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    session: _ember['default'].inject.service('session'),

    actions: {
      authenticate: function authenticate() {
        var _this = this;

        //let { identification, password } = this.getProperties('identification', 'password');
        //this.get('session').authenticate('authenticator:django', identification, password)
        this.get('session').authenticate('authenticator:django').then(function () {
          //console.log('Success! authenticated with token: ' + this.get('session.data.authenticated.access_token'));
          _this.transitionToRoute('taskin');
        }, function (err) {
          //alert('Error obtaining token: ' + err.responseText);
          alert('Login error: ' + err.error);
          // redirect to django login page or if it havn't go to ember login with jwt
          _this.transitionToRoute('login');
        })['catch'](function (reason) {
          _this.set('errorMessage', reason.error || reason);
        });
      },

      invalidateSession: function invalidateSession() {
        this.get('session').invalidate();
      }
    }
  });
});
// app/login/controller.js
define('ember-taskin/taskin/login/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/login/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Nntgcb2p", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"session\",\"isAuthenticated\"]]],null,1,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"authenticate\"]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"t\"],[\"Login\"],null],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"invalidateSession\"]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"t\"],[\"Logout\"],null],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/login/template.hbs" } });
});
define('ember-taskin/taskin/member/choice/transform', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Transform.extend({
    i18n: _ember['default'].inject.service(),

    deserialize: function deserialize(serialized) {
      if (serialized === 'AD') {
        return this.get('i18n').t('Administrator');
      } else if (serialized === 'EX') {
        return this.get('i18n').t('Executor');
      } else if (serialized === 'WA') {
        return this.get('i18n').t('Watcher');
      }
      return serialized;
    },

    serialize: function serialize(deserialized) {

      if (deserialized === 'Administrator') {
        return 'AD';
      } else if (deserialized === 'Executor') {
        return 'EX';
      } else if (deserialized === 'Watcher') {
        return 'WA';
      }

      return deserialized;
    }
  });
});
define('ember-taskin/taskin/member/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    user: _emberData['default'].belongsTo('taskin/user'),
    project: _emberData['default'].belongsTo('taskin/project'),
    //right: DS.attr('string'),
    right: _emberData['default'].attr('taskin/member/choice'),
    taskexecutor_set: _emberData['default'].hasMany('taskin/taskexecutor')
  });
});
define('ember-taskin/taskin/members/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/members/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "tphr/MQz", "block": "{\"statements\":[[\"text\",\"The Member edit needs to be done\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/members/edit/template.hbs" } });
});
define("ember-taskin/taskin/members/index/route", ["exports", "ember"], function (exports, _ember) {
  exports["default"] = _ember["default"].Route.extend({
    setupController: function setupController(controller, model) {
      controller.set("model", model);
      //this.store.query('taskin/member', {project: model.get('project.id')}, {include: 'user.person'});
      //console.log(this.store.peekAll('people/user', {include: 'person'}));
    }
  });
});
define("ember-taskin/taskin/members/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "loYJ4qKA", "block": "{\"statements\":[[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Member\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Right\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"unknown\",[\"member\",\"user\",\"full_name\"]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"unknown\",[\"member\",\"right\"]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"taskin.members.edit\",[\"get\",[\"member\"]]],[[\"class\"],[\"btn btn-default\"]],0],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteMember\",[\"get\",[\"member\",\"id\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/members/index/template.hbs" } });
});
define('ember-taskin/taskin/members/new/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    i18n: _ember['default'].inject.service(),
    userValue: '',
    actions: {
      focusedMember: function focusedMember() {
        //console.log('focusedCustomer');
        _ember['default'].$('#btn-search').click();
        this.store.unloadAll('taskin/choiceuser');
      },
      handleFilterMember: function handleFilterMember() {
        var filterInputValue = this.get('userValue');
        if (filterInputValue.length < 2) {
          this.store.unloadAll('taskin/choiceuser');
          //this.store.query('taskin/member', {project: this.model.project.id});
        } else {
            this.store.unloadAll('taskin/choiceuser');
            this.store.query('taskin/choiceuser', { full_name: filterInputValue });
            //this.store.query('taskin/member', {project: this.model.project.id});
          }
      },

      memberClick: function memberClick(full_name, user_id) {
        var model = this.get('model');
        this.store.findRecord('taskin/user', user_id).then(function (user) {
          model.set('user', user);
        });
        this.set("userValue", full_name);
      },

      selectUser: function selectUser(user_id) {
        var user = this.store.peekRecord('taskin/user', user_id);
        this.set('model.user', user);
      },

      selectRight: function selectRight(right_value) {
        this.set('model.right', right_value);
      }
    }
  });
});
define('ember-taskin/taskin/members/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.createRecord('taskin/member', {
        project: this.modelFor('taskin/projects/show')
      });
    },

    setupController: function setupController(controller, model) {
      controller.set("model", model);
      controller.set('choiceUser', this.store.peekAll('taskin/choiceuser'));
      //controller.set('choicePeople',this.store.peekAll('taskin/choiceperson'));
    },

    actions: {
      addMember: function addMember(newMember) {
        var _this = this;

        //console.log(newMember);
        newMember.save().then(function () {
          _this.transitionTo('taskin.members', _this.modelFor('taskin/projects/show'));
        });
      },

      willTransition: function willTransition() /*transition*/{

        var model = this.controller.get('model');
        this.controller.set("userValue", '');

        if (model.get('hasDirtyAttributes')) {
          model.rollbackAttributes();
        } else {
          return true;
        }
      }
    }
  });
});
define("ember-taskin/taskin/members/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "E9dS1ANh", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New member\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"form\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Member\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"top dropdown col-sm-10\"],[\"static-attr\",\"id\",\"search-bar\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"fa fa-search\"],[\"static-attr\",\"id\",\"btn-search\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"focus-in\",\"key-up\",\"autocomplete\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"userValue\"]],\"focusedMember\",[\"helper\",[\"action\"],[[\"get\",[null]],\"handleFilterMember\"],null],\"off\",\"form-control\",\"Введите заказчика\"]]],false],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"choiceUser\"]]],null,0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Right\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectRight\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Select right\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"EX\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executor\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"WA\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Watcher\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"option\",[]],[\"static-attr\",\"value\",\"AD\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Administrator\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addMember\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Add\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"list-group-item\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"memberClick\",[\"get\",[\"user\",\"full_name\"]],[\"get\",[\"user\",\"id\"]]],null],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/members/new/template.hbs" } });
});
define('ember-taskin/taskin/members/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),
    model: function model() {
      return this.modelFor('taskin/projects/show').get('projectmember_set');
    },

    actions: {
      deleteMember: function deleteMember(member_id) {
        var confirmation = confirm(this.get('i18n').t("Are you sure?"));
        var member = this.store.peekRecord('taskin/member', member_id);
        if (confirmation) {
          member.destroyRecord();
        }
      }
    }
  });
});
define('ember-taskin/taskin/members/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/members/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QOD2kvE0", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/members/show/template.hbs" } });
});
define("ember-taskin/taskin/members/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "v5tILl59", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Members\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"unknown\",[\"model\",\"id\"]],false],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.members.new\"],[[\"tagName\"],[\"li\"]],1],[\"block\",[\"link-to\"],[\"taskin.members\"],[[\"tagName\"],[\"li\"]],0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Members list\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Add member\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/members/template.hbs" } });
});
define('ember-taskin/taskin/people/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/people/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "pqqBunxp", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/people/template.hbs" } });
});
define('ember-taskin/taskin/person/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    user: _emberData['default'].belongsTo('taskin/user'),
    name: _emberData['default'].attr('string'),
    tasks_customer: _emberData['default'].hasMany('taskin/task'),
    creator: _emberData['default'].belongsTo('taskin/user')
  });
});
define('ember-taskin/taskin/project/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    date_created: _emberData['default'].attr('date'),
    creator: _emberData['default'].belongsTo('taskin/user'),
    //members: DS.hasMany('taskin/member'),
    members: _emberData['default'].hasMany('taskin/user'),
    projectmember_set: _emberData['default'].hasMany('taskin/member'),
    about: _emberData['default'].attr('string'),
    task_statuses: _emberData['default'].hasMany('taskin/taskstatus'),
    tasks: _emberData['default'].hasMany('taskin/task')
  });
});
define('ember-taskin/taskin/projects/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findRecord('taskin/project', params.project_id);
    }
  });
});
define("ember-taskin/taskin/projects/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QJE9itcm", "block": "{\"statements\":[[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Project \\\"\"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\\" detail\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Name: \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Created: \"],[\"append\",[\"unknown\",[\"model\",\"date_created\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"About: \"],[\"append\",[\"unknown\",[\"model\",\"about\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Creator: \"],[\"append\",[\"unknown\",[\"model\",\"creator\",\"username\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Members:\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,2],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Task statuses:\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"task_statuses\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"get\",[\"model\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"task_status\",\"name\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task_status\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"member\",\"id\"]],false],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"member\",\"user\",\"username\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/projects/edit/template.hbs" } });
});
define('ember-taskin/taskin/projects/index/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/projects/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "6y3U82NZ", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.projects.new\"],[[\"tagName\"],[\"li\"]],7],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"List projects\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Id\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task statuses\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Members\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,6],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Total projects\"],null],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"model\",\"length\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false]],\"locals\":[]},{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Members\"],null],false]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task statuses\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"unknown\",[\"project\",\"name\"]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"append\",[\"unknown\",[\"project\",\"id\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"taskin.projects.show\",[\"get\",[\"project\"]]],null,5],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.projects.show\",[\"get\",[\"project\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],4],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"get\",[\"project\"]]],null,3],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.taskstatuses\",[\"get\",[\"project\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"taskin.members\",[\"get\",[\"project\"]]],null,1],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"taskin.projects.edit\",[\"get\",[\"project\"]]],[[\"class\"],[\"btn btn-default\"]],0],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteProject\",[\"get\",[\"project\"]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"project\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Create new project\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/projects/index/template.hbs" } });
});
define('ember-taskin/taskin/projects/new/route', ['exports', 'ember', 'rsvp', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _ember, _rsvp, _emberSimpleAuthMixinsAuthenticatedRouteMixin) {
  exports['default'] = _ember['default'].Route.extend(_emberSimpleAuthMixinsAuthenticatedRouteMixin['default'], {

    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),

    model: function model() {
      return _rsvp['default'].hash({
        project: this.store.createRecord('taskin/project'),
        creator: this.store.findRecord('taskin/user', this.get('session.data.authenticated.user.id'))
      });
    },

    actions: {

      saveProject: function saveProject(newProject) {
        var _this = this;

        //let creator_id = this.get('session.data.authenticated.user.id');
        var creator = this.controller.get('model.creator');
        //let person = creator.get('person')
        this.controller.set('model.project.creator', creator);
        newProject.save().then(function (project) {
          //set new project as default
          _this.get('session').set('data.project', { 'id': project.id, 'name': project.get('name') });
        }).
        //then(() => this.transitionTo('taskin.project'));
        then(function () {
          return _this.transitionTo('taskin.tasks', newProject.id);
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model.project');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define("ember-taskin/taskin/projects/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Fday530+", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New project\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"project\",\"name\"]],[\"helper\",[\"t\"],[\"Project name\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"project\",\"about\"]],[\"helper\",[\"t\"],[\"About this project\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveProject\",[\"get\",[\"model\",\"project\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/projects/new/template.hbs" } });
});
define('ember-taskin/taskin/projects/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),
    model: function model() {
      return this.store.findAll('taskin/project');
    },

    actions: {
      deleteProject: function deleteProject(project) {
        var confirmation = confirm(this.get('i18n').t("Are you sure?"));
        //let project = this.store.peekRecord('taskin/project', project_id);
        if (confirmation) {
          project.destroyRecord();
        }
      }
    }
  });
});
define("ember-taskin/taskin/projects/show/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Z2HDRs/s", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Name: \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Created: \"],[\"append\",[\"unknown\",[\"model\",\"date_created\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"About: \"],[\"append\",[\"unknown\",[\"model\",\"about\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Creator: \"],[\"append\",[\"unknown\",[\"model\",\"creator\",\"username\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Members:\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"block\",[\"link-to\"],[\"taskin.members\",[\"get\",[\"model\"]]],null,4],[\"text\",\"\\n    \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,3],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Task statuses:\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.taskstatuses\",[\"get\",[\"model\"]]],null,2],[\"text\",\"    \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"task_statuses\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"get\",[\"model\"]]],null,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"task_status\",\"name\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task_status\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"member\",\"person_name\"]],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]},{\"statements\":[[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/projects/show/index/template.hbs" } });
});
define('ember-taskin/taskin/projects/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findRecord('taskin/project', params.project_id);
    }
  });
});
define("ember-taskin/taskin/projects/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "T7uq1AXn", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Project\"],null],false],[\"text\",\":\\n\"],[\"block\",[\"link-to\"],[\"taskin.projects.show\",[\"get\",[\"model\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],0],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"unknown\",[\"model\",\"name\"]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/projects/show/template.hbs" } });
});
define("ember-taskin/taskin/projects/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qORfGX2D", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n  \\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"\\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\t\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/projects/template.hbs" } });
});
define('ember-taskin/taskin/route', ['exports', 'ember', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _ember, _emberSimpleAuthMixinsAuthenticatedRouteMixin) {
  exports['default'] = _ember['default'].Route.extend(_emberSimpleAuthMixinsAuthenticatedRouteMixin['default'], {
    session: _ember['default'].inject.service('session'),

    titleToken: 'Проекты',

    init: function init() {
      this.get('session').authenticate('authenticator:django');
    },

    model: function model() {
      return this.get('store').findAll('taskin/project');
    },

    setupController: function setupController(controller, model) {
      controller.set("model", model);

      var sessionProjectName = this.get('session.data.project.name');
      //console.log(this.get('session.data.project.id'));
      var session = this.get('session');
      this.store.query('taskin/project', { 'name': sessionProjectName }).then(function (currentProject) {
        if (currentProject.get('length') == 0) {
          session.set('data.project', {});
        }
      });
    }
  });
});
define('ember-taskin/taskin/task/model', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Model.extend({
    subject: _emberData['default'].attr('string'),
    date_created: _emberData['default'].attr('date'),
    creator: _emberData['default'].belongsTo('taskin/user'),
    customer: _emberData['default'].belongsTo('taskin/choiceperson'),
    project: _emberData['default'].belongsTo('taskin/project'),
    status: _emberData['default'].belongsTo('taskin/taskstatus'),
    reason: _emberData['default'].attr('string'),
    about: _emberData['default'].attr('string'),
    date_exec_max: _emberData['default'].attr('date'),
    date_closed: _emberData['default'].attr('date'),
    executors: _emberData['default'].hasMany('taskin/member'),
    taskexecutors: _emberData['default'].hasMany('taskin/taskexecutor'),
    task_comments: _emberData['default'].hasMany('taskin/taskcomment'),
    taskfiles: _emberData['default'].hasMany('taskin/taskfile'),
    isOverdue: _ember['default'].computed('date_exec_max', function () {
      if (this.get('date_exec_max')) {
        if (Date.now() > this.get('date_exec_max')) {
          return true;
        }
      }
      return false;
    })
  });
});
define('ember-taskin/taskin/taskcomment/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    task: _emberData['default'].belongsTo('taskin/task'),
    creator: _emberData['default'].belongsTo('taskin/user'),
    text: _emberData['default'].attr('string'),
    date_created: _emberData['default'].attr('date')
  });
});
define('ember-taskin/taskin/taskcomments/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/taskcomments/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "UKfXuUvn", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/taskcomments/template.hbs" } });
});
define('ember-taskin/taskin/taskexecutor/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    task: _emberData['default'].belongsTo('taskin/task'),
    executor: _emberData['default'].belongsTo('taskin/member'),
    date_accepted: _emberData['default'].attr('date'),
    date_closed: _emberData['default'].attr('date')
  });
});
define('ember-taskin/taskin/taskfile/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    task: _emberData['default'].belongsTo('taskin/task'),
    creator: _emberData['default'].belongsTo('taskin/user'),
    attachment: _emberData['default'].attr(),
    name: _emberData['default'].attr('string'),
    upload_date: _emberData['default'].attr('date'),
    size: _emberData['default'].attr('number')
  });
});
define('ember-taskin/taskin/taskfiles/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/taskfiles/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "SehOp9JO", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/taskfiles/template.hbs" } });
});
define('ember-taskin/taskin/tasks/edit/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    session: _ember['default'].inject.service('session'),
    userValue: _ember['default'].computed('model.task.customer.name', function () {
      if (this.get('model.task.customer.name')) {
        return '' + this.get('model.task.customer.name');
      }
      return null;
    }),

    init: function init() {
      this.store.createRecord('taskin/taskexecutor');
      //userValue = this.get('model.task.customer.username');
    },

    date_accepted: function date_accepted() {
      //console.log('executor.date_accepted checked');
    },

    currentProjectChanged: _ember['default'].observer('session.data.project.id', function () {
      this.transitionToRoute('taskin.tasks');
    }),

    actions: {
      focusedCustomer: function focusedCustomer() {
        //console.log('focusedCustomer');
        _ember['default'].$('#btn-search').click();
      },
      handleFilterCustomer: function handleFilterCustomer() {
        var filterInputValue = this.get('userValue');
        if (filterInputValue.length < 2) {
          //console.log('value<2',filterInputValue);
          this.store.unloadAll('taskin/choiceperson');
          //this.store.query('taskin/member', {project: this.get('model.task.project.id')});
        } else {
            this.store.unloadAll('taskin/choiceperson');
            this.get('store').query('taskin/choiceperson', { name: filterInputValue });
            //this.store.query('taskin/member', {project: this.get('model.task.project.id')});
            //console.log('value>3',filterInputValue);
          }
      },
      customerClick: function customerClick(customer_name, customer) {
        this.set("userValue", customer_name);
        //let customer = this.store.peekRecord('people/user', customer_id);
        this.set('model.task.customer', customer);
      },
      addExecutor: function addExecutor() {
        this.store.createRecord('taskin/taskexecutor');
        //console.log(this.newExecutor);
        //this.get('executorItems').push({id:insertId,name:'test'});
      },

      removeExecutor: function removeExecutor(item) {
        item.deleteRecord();
        item.save();
        //console.log(this.newExecutor);
        //this.get('executorItems').push({id:insertId,name:'test'});
      },

      selectCustomer: function selectCustomer(customer_id) {
        //console.log(customer_id);
        var customer = this.store.peekRecord('people/user', customer_id);
        this.set('model.task.customer', customer);
      },

      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskin/taskstatus', taskstatus_id);
        this.set('model.task.status', taskstatus);
      },

      selectExecutor: function selectExecutor(executor, member_id) {
        var member = this.store.peekRecord('taskin/member', member_id);
        //console.log('newmember',member_id,member.get('user.username'));
        executor.set('executor', member);
        //console.log('set executor:', executor.get('executor'));
      }
    }
  });
});
define('ember-taskin/taskin/tasks/edit/route', ['exports', 'ember', 'rsvp'], function (exports, _ember, _rsvp) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),

    model: function model(params) {
      var currentProject = this.modelFor('taskin/projects/show');
      this.store.unloadAll('taskin/taskexecutor');
      this.store.unloadAll('taskin/user');
      this.store.query('taskin/taskexecutor', { 'task': params.task_id });
      return _rsvp['default'].hash({
        members: this.store.query('taskin/member', { project: currentProject.id }),
        taskexecutors: this.store.peekAll('taskin/taskexecutor'),
        task: this.store.findRecord('taskin/task', params.task_id),
        customers: this.store.peekAll('taskin/choiceperson')
      });
    },

    setupController: function setupController(controller, model) {
      // all your data is in model hash
      controller.set("model", model);
      //controller.set("newReview", model.newReview);
    },

    actions: {
      deleteTask: function deleteTask(task) {
        var _this = this;

        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          task.destroyRecord().then(function () {
            return _this.transitionTo('taskin');
          });
        }
      },
      saveTask: function saveTask(newTask) {
        var _this2 = this;

        var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));
        if (confirmation) {
          //console.log(newTask.changedAttributes());
          newTask.save().then(function (thisTask) {
            var taskexecutors = _this2.controller.get('model.taskexecutors');
            var now = new Date();
            //let taskexecutors = this.store.peekAll('taskin/taskexecutor');
            taskexecutors.forEach(function (taskexecutor) {
              if (taskexecutor.get('executor.content')) {
                taskexecutor.set('task', thisTask);
                if (!(taskexecutor.get('date_accepted') instanceof Date)) {
                  //console.log('date_accepted is selected', now);
                  if (taskexecutor.get('date_accepted')) {
                    taskexecutor.set('date_accepted', now);
                  } else {
                    taskexecutor.set('date_accepted', null);
                  }
                }
                if (!(taskexecutor.get('date_closed') instanceof Date)) {
                  if (taskexecutor.get('date_closed')) {
                    taskexecutor.set('date_closed', now);
                  } else {
                    taskexecutor.set('date_closed', null);
                  }
                }
                taskexecutor.save();
              } else {
                taskexecutor.deleteRecord();
              }
            });

            _this2.transitionTo('taskin');
          });
        }
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model.task');
        if (model.get('isDeleted')) {
          return true;
        } else if (model.get('hasDirtyAttributes')) {
          //console.log(model.changedAttributes());
          var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define("ember-taskin/taskin/tasks/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "L00zOuLt", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"panel \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"task\",\"date_closed\"]],\"panel-warning\",\"panel-default\"],null]]]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task\"],null],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"model\",\"task\",\"id\"]],false],[\"text\",\" - \"],[\"append\",[\"helper\",[\"t\"],[\"edit\"],null],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"task\",\"date_closed\"]]],null,7],[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\",\"task\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Save changes\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.tasks\"],[[\"tagName\",\"class\"],[\"button\",\"btn btn-success\"]],6],[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteTask\",[\"get\",[\"model\",\"task\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectTaskstatus\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"model\",\"task\",\"status\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"model\",\"task\",\"status\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"task\",\"project\",\"task_statuses\"]]],null,5],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"task\",\"subject\"]],[\"helper\",[\"t\"],[\"Enter subject\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Reason\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"2\",[\"get\",[\"model\",\"task\",\"reason\"]],[\"helper\",[\"t\"],[\"Why do you create this task?\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"task\",\"about\"]],[\"helper\",[\"t\"],[\"About this task\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"top dropdown col-sm-8\"],[\"static-attr\",\"id\",\"search-bar\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"fa fa-search\"],[\"static-attr\",\"id\",\"btn-search\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"focus-in\",\"key-up\",\"autocomplete\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"userValue\"]],\"focusedCustomer\",[\"helper\",[\"action\"],[[\"get\",[null]],\"handleFilterCustomer\"],null],\"off\",\"form-control\",\"Введите заказчика\"]]],false],[\"text\",\"\\n          \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"customers\"]]],null,4],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"task\",\"customer\",\"id\"]]],null,3],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Execute to date\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"date-time-picker\"],[[\"get\",[\"model\",\"task\",\"date_exec_max\"]]],[[\"action\",\"class\"],[[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"model\",\"task\",\"date_exec_max\"]]],null]],null],\"form-control\"]]],false],[\"text\",\"\\n          (\"],[\"append\",[\"helper\",[\"t\"],[\"russian format\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"task\",\"date_exec_max\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\")\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"taskexecutors\"]]],null,1],[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addExecutor\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Add executor\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\",\"task\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save changes\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"                  \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"member\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"member\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"action\"],[[\"get\",[null]],\"selectExecutor\",[\"get\",[\"taskexecutor\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"taskexecutor\",\"executor\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskexecutor\",\"executor\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,0],[\"text\",\"              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Accept for execution\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"taskexecutor\",\"date_accepted\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"removeExecutor\",[\"get\",[\"taskexecutor\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Remove executor\"],null],false],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"taskexecutor\",\"date_closed\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskexecutor\"]},{\"statements\":[[\"text\",\"              \"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"company.people.show\",[\"get\",[\"model\",\"task\",\"customer\",\"id\"]]],[[\"target\"],[\"_blank\"]],2]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"list-group-item\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"customerClick\",[\"get\",[\"customer\",\"name\"]],[\"get\",[\"customer\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"customer\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"customer\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskstatus\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"This task closed\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/tasks/edit/template.hbs" } });
});
define('ember-taskin/taskin/tasks/index/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    queryParams: ['page'],
    page: 1,

    //task sorting by date_created
    sortProperties: ['date_created:desc'],
    //sortAscending: false, // false for descending
    sortedTasks: _ember['default'].computed.sort('model.tasks', 'sortProperties')
  });
});
define('ember-taskin/taskin/tasks/index/route', ['exports', 'ember', 'rsvp'], function (exports, _ember, _rsvp) {
  exports['default'] = _ember['default'].Route.extend({
    queryParams: {
      project: {
        refreshModel: true
      },
      page: {
        refreshModel: true
      },
      closed: {
        refreshModel: true
      },
      executor: {
        refreshModel: true
      }
    },

    model: function model(params) {
      this.store.unloadAll('taskin/task');
      var currentProjectId = this.modelFor('taskin/projects/show').get('id');
      params.project = currentProjectId;
      this.store.query('taskin/member', { project: this.get('model.project.id') });

      return _rsvp['default'].hash({
        params: params,
        queryTasks: this.get('store').query('taskin/task', params
        //{project: current_project, page: params.page, closed: params.closed, executor: params.executor}
        ),
        tasks: this.store.peekAll('taskin/task')
      });
    }
  });
});
define("ember-taskin/taskin/tasks/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "njQrO5yi", "block": "{\"statements\":[[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"table-responsive\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Id\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Created date\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Comments\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"sortedTasks\"]]],null,5],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"pager\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Current page\"],null],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"page\"]],false],[\"close-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"helper\",[\"query-params\"],null,[[\"page\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"previous\"]]]]]],[[\"disabled\"],[[\"helper\",[\"if\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"previous\"]],false,true],null]]],1],[\"text\",\"   \"],[\"close-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"helper\",[\"query-params\"],null,[[\"page\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"next\"]]]]]],[[\"disabled\"],[[\"helper\",[\"if\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"next\"]],false,true],null]]],0],[\"text\",\"   \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Total task\"],null],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"model\",\"queryTasks\",\"meta\",\"count\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"       \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Next\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"       \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Previous\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\" \"],[\"append\",[\"unknown\",[\"task\",\"task_comments\",\"length\"]],false],[\"text\",\" \"]],\"locals\":[]},{\"statements\":[[\"text\",\"                  \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"append\",[\"unknown\",[\"executor\",\"user\",\"full_name\"]],false],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"executor\"]},{\"statements\":[[\"append\",[\"unknown\",[\"task\",\"id\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"date_closed\"]],\"success\"],null],[\"helper\",[\"if\"],[[\"get\",[\"task\",\"isOverdue\"]],\"danger\"],null]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"block\",[\"link-to\"],[\"taskin.taskcomments\",[\"get\",[\"task\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],4],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"task\",\"date_created\"]],\"DD.MM.YYYY\"],null],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"subject\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"status\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"customer\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"task\",\"executors\"]]],null,3],[\"text\",\"              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"block\",[\"link-to\"],[\"taskin.taskcomments\",[\"get\",[\"task\"]]],null,2],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/tasks/index/template.hbs" } });
});
define('ember-taskin/taskin/tasks/new/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    session: _ember['default'].inject.service('session'),

    userValue: '',
    newPerson: '',

    actions: {
      customerClick: function customerClick(customer_name, customer) {
        //let customer = this.store.findRecord('people/user', customer_id);
        this.set('model.customer', customer);
        this.set("userValue", customer_name);
      },

      focusedCustomer: function focusedCustomer() {
        //console.log('focusedCustomer');
        this.store.unloadAll('taskin/choiceperson');
        _ember['default'].$('#btn-search').click();
      },

      handleFilterCustomer: function handleFilterCustomer() {
        var _this2 = this;

        var filterInputValue = this.get('userValue');
        if (filterInputValue.length < 2) {
          //console.log('value<2',filterInputValue);
          this.store.unloadAll('taskin/choiceperson');
          this.set('newPerson', '');
        } else {
          (function () {
            _this2.store.unloadAll('taskin/choiceperson');
            if (filterInputValue !== _this2.newPerson) {
              _this2.set('newPerson', '');
            }
            var _this = _this2;
            _this2.get('store').query('taskin/choiceperson', { name: filterInputValue }).then(function (person) {
              //console.log(person.get('length'));
              if (person.get('length') === 0) {
                _this.set('newPerson', filterInputValue);
              }
            });
          })();
        }
      },

      addExecutor: function addExecutor() {
        this.store.createRecord('taskin/taskexecutor');
      },

      removeExecutor: function removeExecutor(executor) {
        executor.deleteRecord();
      },

      selectCustomer: function selectCustomer(customer_id) {
        var customer = this.store.peekRecord('people/user', customer_id);
        this.set('model.task.customer', customer);
      },

      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskin/taskstatus', taskstatus_id);
        this.set('model.status', taskstatus);
      },

      selectExecutor: function selectExecutor(taskexecutor, member_id) {
        var member = this.store.peekRecord('taskin/member', member_id);
        taskexecutor.set('executor', member);
        //console.log(taskexecutor.get('executor.user.username'));
      },

      selectProject: function selectProject(project_id) {
        var project = this.store.peekRecord('taskin/project', project_id);
        this.set('model.task.project', project);
      }
    }
  });
});
define('ember-taskin/taskin/tasks/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),

    model: function model() /*params*/{
      this.store.unloadAll('taskin/taskexecutor');
      return this.store.createRecord('taskin/task', {
        project: this.modelFor('taskin/projects/show')
      });
    },

    setupController: function setupController(controller, model) {
      this.store.query('taskin/member', { project: this.get('model.project.id') });
      controller.set("model", model);
      //controller.set("project", this.modelFor('taskin/projects/show'));
      this.store.createRecord('taskin/taskexecutor');
      controller.set("taskexecutors", this.store.peekAll('taskin/taskexecutor'));
      controller.set("customers", this.store.peekAll('taskin/choiceperson'));
    },

    actions: {
      cancel: function cancel() {
        this.transitionTo('taskin.tasks');
      },

      saveTask: function saveTask(newTask) {
        var _this = this;

        var creator_id = this.controller.get('session.data.authenticated.user.id');
        var creator = this.store.peekRecord('taskin/user', creator_id);

        var newPerson = this.controller.get('newPerson');
        var customer = null;

        if (newPerson) {
          //create new person
          this.store.createRecord('taskin/choiceperson', {
            name: newPerson,
            creator: creator
          }).save().then(function (person) {
            customer = person;
          });
        }

        this.controller.set('model.creator', creator);
        if (this.controller.get('model.status.content') == null) {
          var taskstatus = this.controller.get('model.project.task_statuses').get('firstObject');
          this.controller.set('model.status', taskstatus);
        }

        newTask.save().then(function (thisTask) {
          var taskexecutors = _this.controller.get('taskexecutors');
          taskexecutors.forEach(function (taskexecutor) {
            if (taskexecutor.get('executor.content')) {
              taskexecutor.set('task', thisTask);
              taskexecutor.save();
            } else {
              taskexecutor.deleteRecord();
            }
          });
          if (customer) {
            //console.log('customer id' ,customer.get('id'));
            thisTask.set('customer', customer);
            thisTask.save().then(function () {
              _this.transitionTo('taskin.tasks');
            });
          } else {
            _this.transitionTo('taskin.tasks');
          }
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
            this.controller.set('userValue', '');
            this.controller.set('newPerson', '');
            //this.store.unloadAll('taskin/taskexecutor');
            //this.store.unloadAll('people/user');
          } else {
              transition.abort();
            }
        } else {
          this.controller.set('userValue', '');
          this.controller.set('newPerson', '');
          return true;
        }
      }

    }
  });
});
define("ember-taskin/taskin/tasks/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "dz7njjon", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New task\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"cancel\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Project\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"readonly\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"project\",\"name\"]],\"readonly\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectTaskstatus\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"project\",\"task_statuses\"]]],null,8],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"form-group \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"errors\",\"subject\"]],\"has-error\"],null]]]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"subject\"]],[\"helper\",[\"t\"],[\"Enter subject\"],null]]]],false],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"errors\",\"subject\"]]],null,7],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Reason\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"2\",[\"get\",[\"model\",\"reason\"]],[\"helper\",[\"t\"],[\"Why do you create this task?\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"about\"]],[\"helper\",[\"t\"],[\"About this task\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-8\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"btn-group btn-block\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"fa fa-search\"],[\"static-attr\",\"id\",\"btn-search\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"focus-in\",\"key-up\",\"autocomplete\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"userValue\"]],\"focusedCustomer\",[\"helper\",[\"action\"],[[\"get\",[null]],\"handleFilterCustomer\"],null],\"off\",\"form-control\",\"Enter customer name\"]]],false],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu btn-block\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"newPerson\"]]],null,6],[\"block\",[\"each\"],[[\"get\",[\"customers\"]]],null,5],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"customer\",\"id\"]]],null,4],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Execute to date\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"date-time-picker\"],[[\"get\",[\"model\",\"date_exec_max\"]]],[[\"action\",\"class\"],[[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"model\",\"date_exec_max\"]]],null]],null],\"form-control\"]]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"date_exec_max\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"taskexecutors\"]]],null,1],[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addExecutor\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Add executor\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"cancel\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"                  \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"member\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"member\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"action\"],[[\"get\",[null]],\"selectExecutor\",[\"get\",[\"taskexecutor\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"taskexecutor\",\"executor\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskexecutor\",\"executor\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"project\",\"projectmember_set\"]]],null,0],[\"text\",\"              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Accept for execution\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"executor\",\"date_accepted\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"removeExecutor\",[\"get\",[\"taskexecutor\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Remove executor\"],null],false],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"executor\",\"date_closed\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskexecutor\"]},{\"statements\":[[\"text\",\"            (\"],[\"append\",[\"helper\",[\"t\"],[\"date in russian format\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_exec_max\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\")\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"              \"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"company.people.show\",[\"get\",[\"model\",\"customer\",\"id\"]]],[[\"target\"],[\"_blank\"]],3]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"list-group-item\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"customerClick\",[\"get\",[\"customer\",\"name\"]],[\"get\",[\"customer\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"customer\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"customer\"]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown-header\"],[\"flush-element\"],[\"text\",\"Name not found in base.\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown-header\"],[\"flush-element\"],[\"text\",\"Name will add after save.\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown-header\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"text-danger\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"error\",\"message\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"error\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskstatus\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/tasks/new/template.hbs" } });
});
define('ember-taskin/taskin/tasks/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() /*params*/{
      return this.modelFor('taskin/projects/show');
    },

    setupController: function setupController(controller, model) {
      controller.set("model", model);
    }
  });
});
define('ember-taskin/taskin/tasks/show/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    actions: {
      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskin/taskstatus', taskstatus_id);
        this.set('model.status', taskstatus);
        this.model.save();
      }
    }
  });
});
define('ember-taskin/taskin/tasks/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),

    model: function model(params) {
      return this.store.findRecord('taskin/task', params.task_id);
    },

    setupController: function setupController(controller, model) {
      // all your data is in model hash
      controller.set("model", model);
      //controller.set("session", this.session);
      var current_user = this.get('session.data.authenticated.user.id');
      model.get('taskexecutors').then(function (taskexecutors) {
        taskexecutors.forEach(function (item) {
          controller.set("currentExecutor", item.get('id'));
          item.get('executor').then(function (member) {
            var executorUserId = member.get('user.id');
            if (executorUserId == current_user) {
              if (!item.get('date_accepted')) {
                controller.set("acceptForExecute", true);
              }
              if (!item.get('date_closed')) {
                controller.set("taskCompleted", true);
              }
            }
          });
        });
      });
      //controller.set("newReview", model.newReview);
    },

    actions: {
      acceptExecute: function acceptExecute(executorId) {
        var now = new Date();
        var controller = this.controller;
        this.store.findRecord('taskin/taskexecutor', executorId).then(function (taskexecutor) {
          taskexecutor.set('date_accepted', now);
          taskexecutor.save();
          controller.set("acceptForExecute", false);
        });
      },

      taskCompleted: function taskCompleted(executorId) {
        var now = new Date();
        var controller = this.controller;
        this.store.findRecord('taskin/taskexecutor', executorId).then(function (taskexecutor) {
          taskexecutor.set('date_closed', now);
          taskexecutor.save();
          controller.set("taskCompleted", false);
        });
      },

      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskin/taskstatus', taskstatus_id);
        this.set('model.status', taskstatus);
      },

      willTransition: function willTransition() {
        this.controller.set("acceptForExecute", false);
        this.controller.set("taskCompleted", false);
      }
    }
  });
});
define("ember-taskin/taskin/tasks/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "plhhIJFL", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"panel \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"date_closed\"]],\"panel-warning\",\"panel-default\"],null]]]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"date_closed\"]]],null,11],[\"text\",\"    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task\"],null],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"model\",\"id\"]],false],[\"text\",\" \"],[\"append\",[\"helper\",[\"t\"],[\"detail\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#comments\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Comments\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"task_comments\",\"length\"]],false],[\"text\",\")\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#files\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Files\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"taskfiles\",\"length\"]],false],[\"text\",\") \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"link-to\"],[\"taskin.tasks\"],null,10],[\"block\",[\"link-to\"],[\"taskin.tasks.edit\",[\"get\",[\"model\",\"project\",\"id\"]],[\"get\",[\"model\",\"id\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-success\"]],9],[\"block\",[\"link-to\"],[\"taskin.tasks\"],null,8],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"acceptForExecute\"]]],null,7],[\"block\",[\"if\"],[[\"get\",[\"taskCompleted\"]]],null,6],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectTaskstatus\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"model\",\"status\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"model\",\"status\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"project\",\"task_statuses\"]]],null,5],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-8\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"model\",\"customer\",\"name\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"customer\",\"id\"]]],null,4],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"model\",\"subject\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"readonly\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"about\"]],\"readonly\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Reason\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"readonly\"],[\"form-control\",\"2\",[\"get\",[\"model\",\"reason\"]],\"readonly\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Created\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_created\"]],\"DD.MM.YYYY, H:mm\"],null],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Creator\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"model\",\"creator\",\"person_name\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Execute to date\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_exec_max\"]],\"lll\"],null],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Date closed\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_closed\"]],\"DD.MM.YYYY, H:mm\"],null],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"taskexecutors\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"name\",\"files\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"block\",[\"link-to\"],[\"taskin.taskfiles\"],null,1],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"name\",\"comments\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"block\",[\"link-to\"],[\"taskin.taskcomments\"],null,0],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#comments\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Comments\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"task_comments\",\"length\"]],false],[\"text\",\") \"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#files\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Files\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"taskfiles\",\"length\"]],false],[\"text\",\") \"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskexecutor\",\"executor\",\"user\",\"person_name\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Accepted for execution\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"taskexecutor\",\"date_accepted\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\"\\n            \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"taskexecutor\",\"date_closed\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskexecutor\"]},{\"statements\":[[\"text\",\"                \"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"company.people.show\",[\"get\",[\"model\",\"customer\",\"id\"]]],[[\"target\"],[\"_blank\"]],3]],\"locals\":[]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskstatus\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"taskCompleted\",[\"get\",[\"currentExecutor\"]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"acceptExecute\",[\"get\",[\"currentExecutor\"]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Accept for execution\"],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"flush-element\"],[\"text\",\"\\n        Ok\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"This task closed\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/tasks/show/template.hbs" } });
});
define("ember-taskin/taskin/tasks/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3G7/fbsh", "block": "{\"statements\":[[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"text-left\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"page-header\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"taskin.tasks.new\"],[[\"tagName\"],[\"li\"]],5],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"helper\",[\"query-params\"],null,[[\"page\",\"executor\",\"closed\"],[1,[\"get\",[\"all\"]],[\"get\",[\"none\"]]]]]],[[\"tagName\"],[\"li\"]],4],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"helper\",[\"query-params\"],null,[[\"closed\"],[0]]]],[[\"tagName\"],[\"li\"]],3],[\"text\",\"\\n\\n        \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Filter by executor\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"helper\",[\"query-params\"],null,[[\"executor\"],[0]]]],[[\"tagName\"],[\"li\"]],2],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"executor\",\"full_name\"]],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"block\",[\"link-to\"],[\"taskin.tasks\",[\"helper\",[\"query-params\"],null,[[\"page\",\"executor\"],[1,[\"get\",[\"executor\",\"id\"]]]]]],[[\"tagName\"],[\"li\"]],0],[\"text\",\"\\n\"]],\"locals\":[\"executor\"]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executor is empty\"],null],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"The closed tasks hide\"],null],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"All tasks\"],null],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Create new task\"],null],false],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/tasks/template.hbs" } });
});
define('ember-taskin/taskin/taskstatus/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    project: _emberData['default'].belongsTo('taskin/project'),
    order: _emberData['default'].attr('number'),
    tasks: _emberData['default'].hasMany('taskin/task')
  });
});
define('ember-taskin/taskin/taskstatuses/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),
    model: function model(params) {
      return this.store.findRecord('taskin/taskstatus', params.taskstatus_id);
    },

    actions: {

      saveTaskstatus: function saveTaskstatus(newTaskstatus) {
        var _this = this;

        newTaskstatus.save().then(function () {
          return _this.transitionTo('taskin.taskstatuses');
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define("ember-taskin/taskin/taskstatuses/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "44PRKudl", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task status edit\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"form\",[]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"name\"]],[\"helper\",[\"t\"],[\"Enter name\"],null]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Order\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"order\"]],[\"helper\",[\"t\"],[\"Enter index number\"],null]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTaskstatus\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"t\"],[\"Save changes\"],null],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/taskstatuses/edit/template.hbs" } });
});
define('ember-taskin/taskin/taskstatuses/index/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskin/taskstatuses/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "/ERZd5Yq", "block": "{\"statements\":[[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Order\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"order\"]],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.taskstatuses.edit\",[\"get\",[\"taskstatus\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteStatus\",[\"get\",[\"taskstatus\",\"id\"]]]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/taskstatuses/index/template.hbs" } });
});
define('ember-taskin/taskin/taskstatuses/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),

    model: function model() {
      return this.store.createRecord('taskin/taskstatus', {
        project: this.modelFor('taskin/projects/show')
      });
    },

    actions: {
      saveTaskstatus: function saveTaskstatus(newTaskstatus) {
        var _this = this;

        newTaskstatus.save().then(function (newTaskstatus) {
          newTaskstatus.reload();
          _this.transitionTo('taskin.taskstatuses', _this.modelFor('taskin/projects/show'));
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        } else {
          return true;
        }
      }
    }
  });
});
define("ember-taskin/taskin/taskstatuses/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "t7+L+t6/", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New task status\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"form\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"name\"]],[\"helper\",[\"t\"],[\"Enter name\"],null]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Order\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"order\"]],[\"helper\",[\"t\"],[\"Enter index number\"],null]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTaskstatus\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/taskstatuses/new/template.hbs" } });
});
define('ember-taskin/taskin/taskstatuses/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),

    model: function model() {
      return this.modelFor('taskin/projects/show').get('task_statuses');
    },

    actions: {
      deleteStatus: function deleteStatus(status_id) {
        var confirmation = confirm(this.get('i18n').t("Are you sure?"));
        var taskstatus = this.store.peekRecord('taskin/taskstatus', status_id);
        if (confirmation) {
          taskstatus.destroyRecord();
        }
      }
    }
  });
});
define('ember-taskin/taskin/taskstatuses/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findRecord('taskin/taskstatus', params.taskstatus_id);
    }
  });
});
define("ember-taskin/taskin/taskstatuses/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "z34CGoec", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/taskstatuses/show/template.hbs" } });
});
define("ember-taskin/taskin/taskstatuses/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "yde9GrdG", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task statuses\"],null],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskin.taskstatuses.new\"],[[\"tagName\"],[\"li\"]],1],[\"block\",[\"link-to\"],[\"taskin.taskstatuses\"],[[\"tagName\"],[\"li\"]],0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task status list\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Create task status\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskin/taskstatuses/template.hbs" } });
});
define("ember-taskin/taskin/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0P20EmK6", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"partial\",\"navbar\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":true}", "meta": { "moduleName": "ember-taskin/taskin/template.hbs" } });
});
define('ember-taskin/taskin/user/model', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Model.extend({
    username: _emberData['default'].attr('string'),
    first_name: _emberData['default'].attr('string'),
    last_name: _emberData['default'].attr('string'),
    person: _emberData['default'].belongsTo('taskin/person', { inverse: null }),
    email: _emberData['default'].attr('string'),
    is_superuser: _emberData['default'].attr('boolean'),
    //for taskin app
    project_creator: _emberData['default'].hasMany('taskin/project', { inverse: 'creator' }),
    projects_member: _emberData['default'].hasMany('taskin/project', { inverse: 'members' }),
    projectmember_set: _emberData['default'].hasMany('taskin/member'),
    task_creator: _emberData['default'].hasMany('taskin/task', { inverse: 'creator' }),
    tasks_customer: _emberData['default'].hasMany('taskin/task', { inverse: 'customer' }),
    taskfiles_creator: _emberData['default'].hasMany('taskin/taskfile', { inverse: 'creator' }),
    full_name: _ember['default'].computed('first_name', 'last_name', function () {
      if (this.get('first_name')) {
        return this.get('last_name') + ' ' + this.get('first_name');
      } else {
        return '' + this.get('username');
      }
    }),
    person_name: _ember['default'].computed('person.{name}', 'first_name', 'username', function () {
      if (this.get('person.name')) {
        return this.get('person.name');
      } else if (this.get('first_name')) {
        return this.get('last_name') + ' ' + this.get('first_name');
      } else {
        return this.get('username');
      }
    })
  });
});
define('ember-taskin/tasks/edit/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    session: _ember['default'].inject.service('session'),
    userValue: _ember['default'].computed('model.task.customer.name', function () {
      if (this.get('model.task.customer.name')) {
        return '' + this.get('model.task.customer.name');
      }
      return null;
    }),

    init: function init() {
      this.store.createRecord('taskexecutor');
      //userValue = this.get('model.task.customer.username');
    },

    date_accepted: function date_accepted() {
      //console.log('executor.date_accepted checked');
    },

    currentProjectChanged: _ember['default'].observer('session.data.project.id', function () {
      this.transitionToRoute('tasks');
    }),

    actions: {
      focusedCustomer: function focusedCustomer() {
        //console.log('focusedCustomer');
        _ember['default'].$('#btn-search').click();
      },
      handleFilterCustomer: function handleFilterCustomer() {
        var filterInputValue = this.get('userValue');
        if (filterInputValue.length < 2) {
          //console.log('value<2',filterInputValue);
          this.store.unloadAll('choiceperson');
          //this.store.query('member', {project: this.get('model.task.project.id')});
        } else {
            this.store.unloadAll('choiceperson');
            this.get('store').query('choiceperson', { name: filterInputValue });
            //this.store.query('member', {project: this.get('model.task.project.id')});
            //console.log('value>3',filterInputValue);
          }
      },
      customerClick: function customerClick(customer_name, customer) {
        this.set("userValue", customer_name);
        //let customer = this.store.peekRecord('people/user', customer_id);
        this.set('model.task.customer', customer);
      },
      addExecutor: function addExecutor() {
        this.store.createRecord('taskexecutor');
        //console.log(this.newExecutor);
        //this.get('executorItems').push({id:insertId,name:'test'});
      },

      removeExecutor: function removeExecutor(item) {
        item.deleteRecord();
        item.save();
        //console.log(this.newExecutor);
        //this.get('executorItems').push({id:insertId,name:'test'});
      },

      selectCustomer: function selectCustomer(customer_id) {
        //console.log(customer_id);
        var customer = this.store.peekRecord('people/user', customer_id);
        this.set('model.task.customer', customer);
      },

      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskstatus', taskstatus_id);
        this.set('model.task.status', taskstatus);
      },

      selectExecutor: function selectExecutor(executor, member_id) {
        var member = this.store.peekRecord('member', member_id);
        //console.log('newmember',member_id,member.get('user.username'));
        executor.set('executor', member);
        //console.log('set executor:', executor.get('executor'));
      }
    }
  });
});
define('ember-taskin/tasks/edit/route', ['exports', 'ember', 'rsvp'], function (exports, _ember, _rsvp) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),
    i18n: _ember['default'].inject.service(),

    model: function model(params) {
      var currentProject = this.modelFor('projects/show');
      this.store.unloadAll('taskexecutor');
      this.store.unloadAll('user');
      this.store.query('taskexecutor', { 'task': params.task_id });
      return _rsvp['default'].hash({
        members: this.store.query('member', { project: currentProject.id }),
        taskexecutors: this.store.peekAll('taskexecutor'),
        task: this.store.findRecord('task', params.task_id),
        customers: this.store.peekAll('choiceperson')
      });
    },

    setupController: function setupController(controller, model) {
      // all your data is in model hash
      controller.set("model", model);
      //controller.set("newReview", model.newReview);
    },

    actions: {
      deleteTask: function deleteTask(task) {
        var _this = this;

        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          task.destroyRecord().then(function () {
            return _this.transitionTo('tasks');
          });
        }
      },
      saveTask: function saveTask(newTask) {
        var _this2 = this;

        var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));
        if (confirmation) {
          //console.log(newTask.changedAttributes());
          newTask.save().then(function (thisTask) {
            var taskexecutors = _this2.controller.get('model.taskexecutors');
            var now = new Date();
            //let taskexecutors = this.store.peekAll('taskexecutor');
            taskexecutors.forEach(function (taskexecutor) {
              if (taskexecutor.get('executor.content')) {
                taskexecutor.set('task', thisTask);
                if (!(taskexecutor.get('date_accepted') instanceof Date)) {
                  //console.log('date_accepted is selected', now);
                  if (taskexecutor.get('date_accepted')) {
                    taskexecutor.set('date_accepted', now);
                  } else {
                    taskexecutor.set('date_accepted', null);
                  }
                }
                if (!(taskexecutor.get('date_closed') instanceof Date)) {
                  if (taskexecutor.get('date_closed')) {
                    taskexecutor.set('date_closed', now);
                  } else {
                    taskexecutor.set('date_closed', null);
                  }
                }
                taskexecutor.save();
              } else {
                taskexecutor.deleteRecord();
              }
            });

            _this2.transitionTo('tasks');
          });
        }
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model.task');
        if (model.get('isDeleted')) {
          return true;
        } else if (model.get('hasDirtyAttributes')) {
          //console.log(model.changedAttributes());
          var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define("ember-taskin/tasks/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "6nWY85zV", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"panel \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"task\",\"date_closed\"]],\"panel-warning\",\"panel-default\"],null]]]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task\"],null],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"model\",\"task\",\"id\"]],false],[\"text\",\" - \"],[\"append\",[\"helper\",[\"t\"],[\"edit\"],null],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"task\",\"date_closed\"]]],null,7],[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\",\"task\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Save changes\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"tasks\"],[[\"tagName\",\"class\"],[\"button\",\"btn btn-success\"]],6],[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteTask\",[\"get\",[\"model\",\"task\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectTaskstatus\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"model\",\"task\",\"status\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"model\",\"task\",\"status\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"task\",\"project\",\"task_statuses\"]]],null,5],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"task\",\"subject\"]],[\"helper\",[\"t\"],[\"Enter subject\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Reason\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"2\",[\"get\",[\"model\",\"task\",\"reason\"]],[\"helper\",[\"t\"],[\"Why do you create this task?\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"task\",\"about\"]],[\"helper\",[\"t\"],[\"About this task\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"top dropdown col-sm-8\"],[\"static-attr\",\"id\",\"search-bar\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"fa fa-search\"],[\"static-attr\",\"id\",\"btn-search\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"focus-in\",\"key-up\",\"autocomplete\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"userValue\"]],\"focusedCustomer\",[\"helper\",[\"action\"],[[\"get\",[null]],\"handleFilterCustomer\"],null],\"off\",\"form-control\",\"Введите заказчика\"]]],false],[\"text\",\"\\n          \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"customers\"]]],null,4],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"task\",\"customer\",\"id\"]]],null,3],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Execute to date\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"date-time-picker\"],[[\"get\",[\"model\",\"task\",\"date_exec_max\"]]],[[\"action\",\"class\"],[[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"model\",\"task\",\"date_exec_max\"]]],null]],null],\"form-control\"]]],false],[\"text\",\"\\n          (\"],[\"append\",[\"helper\",[\"t\"],[\"russian format\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"task\",\"date_exec_max\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\")\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"taskexecutors\"]]],null,1],[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addExecutor\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Add executor\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\",\"task\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save changes\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"                  \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"member\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"member\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"action\"],[[\"get\",[null]],\"selectExecutor\",[\"get\",[\"taskexecutor\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"taskexecutor\",\"executor\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskexecutor\",\"executor\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,0],[\"text\",\"              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Accept for execution\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"taskexecutor\",\"date_accepted\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"removeExecutor\",[\"get\",[\"taskexecutor\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Remove executor\"],null],false],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"taskexecutor\",\"date_closed\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskexecutor\"]},{\"statements\":[[\"text\",\"              \"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"people.show\",[\"get\",[\"model\",\"task\",\"customer\",\"id\"]]],[[\"target\"],[\"_blank\"]],2]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"list-group-item\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"customerClick\",[\"get\",[\"customer\",\"name\"]],[\"get\",[\"customer\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"customer\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"customer\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskstatus\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"This task closed\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/tasks/edit/template.hbs" } });
});
define('ember-taskin/tasks/index/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    queryParams: ['page'],
    page: 1,

    //task sorting by date_created
    sortProperties: ['date_created:desc'],
    //sortAscending: false, // false for descending
    sortedTasks: _ember['default'].computed.sort('model.tasks', 'sortProperties')
  });
});
define('ember-taskin/tasks/index/route', ['exports', 'ember', 'rsvp'], function (exports, _ember, _rsvp) {
  exports['default'] = _ember['default'].Route.extend({
    queryParams: {
      project: {
        refreshModel: true
      },
      page: {
        refreshModel: true
      },
      closed: {
        refreshModel: true
      },
      executor: {
        refreshModel: true
      }
    },

    model: function model(params) {
      this.store.unloadAll('task');
      var currentProjectId = this.modelFor('projects/show').get('id');
      params.project = currentProjectId;
      this.store.query('member', { project: this.get('model.project.id') });

      return _rsvp['default'].hash({
        params: params,
        queryTasks: this.get('store').query('task', params
        //{project: current_project, page: params.page, closed: params.closed, executor: params.executor}
        ),
        tasks: this.store.peekAll('task')
      });
    }
  });
});
define("ember-taskin/tasks/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1gGvyU1k", "block": "{\"statements\":[[\"text\",\"\\n\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"table-responsive\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Id\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Created date\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Comments\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"sortedTasks\"]]],null,5],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"pager\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Current page\"],null],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"page\"]],false],[\"close-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"tasks\",[\"helper\",[\"query-params\"],null,[[\"page\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"previous\"]]]]]],[[\"disabled\"],[[\"helper\",[\"if\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"previous\"]],false,true],null]]],1],[\"text\",\"   \"],[\"close-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"tasks\",[\"helper\",[\"query-params\"],null,[[\"page\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"next\"]]]]]],[[\"disabled\"],[[\"helper\",[\"if\"],[[\"get\",[\"model\",\"queryTasks\",\"meta\",\"next\"]],false,true],null]]],0],[\"text\",\"   \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Total task\"],null],false],[\"text\",\": \"],[\"append\",[\"unknown\",[\"model\",\"queryTasks\",\"meta\",\"count\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"       \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Next\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"       \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Previous\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\" \"],[\"append\",[\"unknown\",[\"task\",\"task_comments\",\"length\"]],false],[\"text\",\" \"]],\"locals\":[]},{\"statements\":[[\"text\",\"                  \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"append\",[\"unknown\",[\"executor\",\"user\",\"full_name\"]],false],[\"text\",\"\\n                  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"executor\"]},{\"statements\":[[\"append\",[\"unknown\",[\"task\",\"id\"]],false]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"tr\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[[\"helper\",[\"if\"],[[\"get\",[\"task\",\"date_closed\"]],\"success\"],null],[\"helper\",[\"if\"],[[\"get\",[\"task\",\"isOverdue\"]],\"danger\"],null]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"block\",[\"link-to\"],[\"taskcomments\",[\"get\",[\"task\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],4],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"task\",\"date_created\"]],\"DD.MM.YYYY\"],null],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"subject\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"status\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"customer\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"task\",\"executors\"]]],null,3],[\"text\",\"              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"block\",[\"link-to\"],[\"taskcomments\",[\"get\",[\"task\"]]],null,2],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/tasks/index/template.hbs" } });
});
define('ember-taskin/tasks/new/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    session: _ember['default'].inject.service('session'),

    userValue: '',
    newPerson: '',

    actions: {
      customerClick: function customerClick(customer_name, customer) {
        //let customer = this.store.findRecord('people/user', customer_id);
        this.set('model.customer', customer);
        this.set("userValue", customer_name);
      },

      focusedCustomer: function focusedCustomer() {
        //console.log('focusedCustomer');
        this.store.unloadAll('choiceperson');
        _ember['default'].$('#btn-search').click();
      },

      handleFilterCustomer: function handleFilterCustomer() {
        var _this2 = this;

        var filterInputValue = this.get('userValue');
        if (filterInputValue.length < 2) {
          //console.log('value<2',filterInputValue);
          this.store.unloadAll('choiceperson');
          this.set('newPerson', '');
        } else {
          (function () {
            _this2.store.unloadAll('choiceperson');
            if (filterInputValue !== _this2.newPerson) {
              _this2.set('newPerson', '');
            }
            var _this = _this2;
            _this2.get('store').query('choiceperson', { name: filterInputValue }).then(function (person) {
              //console.log(person.get('length'));
              if (person.get('length') === 0) {
                _this.set('newPerson', filterInputValue);
              }
            });
          })();
        }
      },

      addExecutor: function addExecutor() {
        this.store.createRecord('taskexecutor');
      },

      removeExecutor: function removeExecutor(executor) {
        executor.deleteRecord();
      },

      selectCustomer: function selectCustomer(customer_id) {
        var customer = this.store.peekRecord('people/user', customer_id);
        this.set('model.task.customer', customer);
      },

      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskstatus', taskstatus_id);
        this.set('model.status', taskstatus);
      },

      selectExecutor: function selectExecutor(taskexecutor, member_id) {
        var member = this.store.peekRecord('member', member_id);
        taskexecutor.set('executor', member);
        //console.log(taskexecutor.get('executor.user.username'));
      },

      selectProject: function selectProject(project_id) {
        var project = this.store.peekRecord('project', project_id);
        this.set('model.task.project', project);
      }
    }
  });
});
define('ember-taskin/tasks/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),

    model: function model() /*params*/{
      this.store.unloadAll('taskexecutor');
      return this.store.createRecord('task', {
        project: this.modelFor('projects/show')
      });
    },

    setupController: function setupController(controller, model) {
      this.store.query('member', { project: this.get('model.project.id') });
      controller.set("model", model);
      //controller.set("project", this.modelFor('projects/show'));
      this.store.createRecord('taskexecutor');
      controller.set("taskexecutors", this.store.peekAll('taskexecutor'));
      controller.set("customers", this.store.peekAll('choiceperson'));
    },

    actions: {
      cancel: function cancel() {
        this.transitionTo('tasks');
      },

      saveTask: function saveTask(newTask) {
        var _this = this;

        var creator_id = this.controller.get('session.data.authenticated.user.id');
        var creator = this.store.peekRecord('user', creator_id);

        var newPerson = this.controller.get('newPerson');
        var customer = null;

        if (newPerson) {
          //create new person
          this.store.createRecord('choiceperson', {
            name: newPerson,
            creator: creator
          }).save().then(function (person) {
            customer = person;
          });
        }

        this.controller.set('model.creator', creator);
        if (this.controller.get('model.status.content') == null) {
          var taskstatus = this.controller.get('model.project.task_statuses').get('firstObject');
          this.controller.set('model.status', taskstatus);
        }

        newTask.save().then(function (thisTask) {
          var taskexecutors = _this.controller.get('taskexecutors');
          taskexecutors.forEach(function (taskexecutor) {
            if (taskexecutor.get('executor.content')) {
              taskexecutor.set('task', thisTask);
              taskexecutor.save();
            } else {
              taskexecutor.deleteRecord();
            }
          });
          if (customer) {
            //console.log('customer id' ,customer.get('id'));
            thisTask.set('customer', customer);
            thisTask.save().then(function () {
              _this.transitionTo('tasks');
            });
          } else {
            _this.transitionTo('tasks');
          }
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
            this.controller.set('userValue', '');
            this.controller.set('newPerson', '');
            //this.store.unloadAll('taskexecutor');
          } else {
              transition.abort();
            }
        } else {
          this.controller.set('userValue', '');
          this.controller.set('newPerson', '');
          return true;
        }
      }

    }
  });
});
define("ember-taskin/tasks/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Yug/fOge", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New task\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"cancel\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Project\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"readonly\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"project\",\"name\"]],\"readonly\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectTaskstatus\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"project\",\"task_statuses\"]]],null,8],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"form-group \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"errors\",\"subject\"]],\"has-error\"],null]]]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"subject\"]],[\"helper\",[\"t\"],[\"Enter subject\"],null]]]],false],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"errors\",\"subject\"]]],null,7],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Reason\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"2\",[\"get\",[\"model\",\"reason\"]],[\"helper\",[\"t\"],[\"Why do you create this task?\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"placeholder\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"about\"]],[\"helper\",[\"t\"],[\"About this task\"],null]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-8\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"btn-group btn-block\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"fa fa-search\"],[\"static-attr\",\"id\",\"btn-search\"],[\"static-attr\",\"data-toggle\",\"dropdown\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\",\"focus-in\",\"key-up\",\"autocomplete\",\"class\",\"placeholder\"],[\"text\",[\"get\",[\"userValue\"]],\"focusedCustomer\",[\"helper\",[\"action\"],[[\"get\",[null]],\"handleFilterCustomer\"],null],\"off\",\"form-control\",\"Enter customer name\"]]],false],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"dropdown-menu btn-block\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"newPerson\"]]],null,6],[\"block\",[\"each\"],[[\"get\",[\"customers\"]]],null,5],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"customer\",\"id\"]]],null,4],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Execute to date\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"date-time-picker\"],[[\"get\",[\"model\",\"date_exec_max\"]]],[[\"action\",\"class\"],[[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"model\",\"date_exec_max\"]]],null]],null],\"form-control\"]]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"date_exec_max\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"taskexecutors\"]]],null,1],[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"addExecutor\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Add executor\"],null],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"static-attr\",\"type\",\"submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"cancel\"]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"                  \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"member\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"member\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"member\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"action\"],[[\"get\",[null]],\"selectExecutor\",[\"get\",[\"taskexecutor\"]]],null]],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"taskexecutor\",\"executor\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskexecutor\",\"executor\",\"user\",\"full_name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"project\",\"projectmember_set\"]]],null,0],[\"text\",\"              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Accept for execution\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"executor\",\"date_accepted\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger pull-right\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"removeExecutor\",[\"get\",[\"taskexecutor\"]]]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Remove executor\"],null],false],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"checked\"],[\"checkbox\",[\"get\",[\"executor\",\"date_closed\"]]]]],false],[\"text\",\"\\n              \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskexecutor\"]},{\"statements\":[[\"text\",\"            (\"],[\"append\",[\"helper\",[\"t\"],[\"date in russian format\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_exec_max\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\")\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"              \"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"people.show\",[\"get\",[\"model\",\"customer\",\"id\"]]],[[\"target\"],[\"_blank\"]],3]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"list-group-item\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"customerClick\",[\"get\",[\"customer\",\"name\"]],[\"get\",[\"customer\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"open-element\",\"a\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"customer\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"customer\"]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown-header\"],[\"flush-element\"],[\"text\",\"Name not found in base.\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown-header\"],[\"flush-element\"],[\"text\",\"Name will add after save.\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"dropdown-header\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"text-danger\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"error\",\"message\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"error\"]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskstatus\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/tasks/new/template.hbs" } });
});
define('ember-taskin/tasks/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() /*params*/{
      return this.modelFor('projects/show');
    },

    setupController: function setupController(controller, model) {
      controller.set("model", model);
    }
  });
});
define('ember-taskin/tasks/show/controller', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    actions: {
      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskstatus', taskstatus_id);
        this.set('model.status', taskstatus);
        this.model.save();
      }
    }
  });
});
define('ember-taskin/tasks/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    session: _ember['default'].inject.service('session'),

    model: function model(params) {
      return this.store.findRecord('task', params.task_id);
    },

    setupController: function setupController(controller, model) {
      // all your data is in model hash
      controller.set("model", model);
      //controller.set("session", this.session);
      var current_user = this.get('session.data.authenticated.user.id');
      model.get('taskexecutors').then(function (taskexecutors) {
        taskexecutors.forEach(function (item) {
          controller.set("currentExecutor", item.get('id'));
          item.get('executor').then(function (member) {
            var executorUserId = member.get('user.id');
            if (executorUserId == current_user) {
              if (!item.get('date_accepted')) {
                controller.set("acceptForExecute", true);
              }
              if (!item.get('date_closed')) {
                controller.set("taskCompleted", true);
              }
            }
          });
        });
      });
      //controller.set("newReview", model.newReview);
    },

    actions: {
      acceptExecute: function acceptExecute(executorId) {
        var now = new Date();
        var controller = this.controller;
        this.store.findRecord('taskexecutor', executorId).then(function (taskexecutor) {
          taskexecutor.set('date_accepted', now);
          taskexecutor.save();
          controller.set("acceptForExecute", false);
        });
      },

      taskCompleted: function taskCompleted(executorId) {
        var now = new Date();
        var controller = this.controller;
        this.store.findRecord('taskexecutor', executorId).then(function (taskexecutor) {
          taskexecutor.set('date_closed', now);
          taskexecutor.save();
          controller.set("taskCompleted", false);
        });
      },

      selectTaskstatus: function selectTaskstatus(taskstatus_id) {
        var taskstatus = this.store.peekRecord('taskstatus', taskstatus_id);
        this.set('model.status', taskstatus);
      },

      willTransition: function willTransition() {
        this.controller.set("acceptForExecute", false);
        this.controller.set("taskCompleted", false);
      }
    }
  });
});
define("ember-taskin/tasks/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "xOJBQegj", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"panel \",[\"helper\",[\"if\"],[[\"get\",[\"model\",\"date_closed\"]],\"panel-warning\",\"panel-default\"],null]]]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"date_closed\"]]],null,11],[\"text\",\"    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task\"],null],false],[\"text\",\" \"],[\"append\",[\"unknown\",[\"model\",\"id\"]],false],[\"text\",\" \"],[\"append\",[\"helper\",[\"t\"],[\"detail\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#comments\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Comments\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"task_comments\",\"length\"]],false],[\"text\",\")\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#files\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Files\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"taskfiles\",\"length\"]],false],[\"text\",\") \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"link-to\"],[\"tasks\"],null,10],[\"block\",[\"link-to\"],[\"tasks.edit\",[\"get\",[\"model\",\"project\",\"id\"]],[\"get\",[\"model\",\"id\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-success\"]],9],[\"block\",[\"link-to\"],[\"tasks\"],null,8],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-horizontal\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"acceptForExecute\"]]],null,7],[\"block\",[\"if\"],[[\"get\",[\"taskCompleted\"]]],null,6],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Status\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"select\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectTaskstatus\"],[[\"value\"],[\"target.value\"]]],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"concat\",[[\"unknown\",[\"model\",\"status\",\"id\"]]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"model\",\"status\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"project\",\"task_statuses\"]]],null,5],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Customer\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-8\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"model\",\"customer\",\"name\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"model\",\"customer\",\"id\"]]],null,4],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Subject\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"model\",\"subject\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"About\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"readonly\"],[\"form-control\",\"5\",[\"get\",[\"model\",\"about\"]],\"readonly\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Reason\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"value\",\"readonly\"],[\"form-control\",\"2\",[\"get\",[\"model\",\"reason\"]],\"readonly\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Created\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_created\"]],\"DD.MM.YYYY, H:mm\"],null],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Creator\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"model\",\"creator\",\"person_name\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Execute to date\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_exec_max\"]],\"lll\"],null],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Date closed\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"helper\",[\"moment-format\"],[[\"get\",[\"model\",\"date_closed\"]],\"DD.MM.YYYY, H:mm\"],null],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"class\",\"col-sm-2 control-label\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executors\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-10\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"taskexecutors\"]]],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"name\",\"files\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"block\",[\"link-to\"],[\"taskfiles\"],null,1],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"name\",\"comments\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"block\",[\"link-to\"],[\"taskcomments\"],null,0],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#comments\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Comments\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"task_comments\",\"length\"]],false],[\"text\",\") \"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#files\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Files\"],null],false],[\"close-element\"],[\"text\",\" (\"],[\"append\",[\"unknown\",[\"model\",\"taskfiles\",\"length\"]],false],[\"text\",\") \"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"type\",\"text\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskexecutor\",\"executor\",\"user\",\"person_name\"]],null],[\"static-attr\",\"readonly\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Accepted for execution\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"taskexecutor\",\"date_accepted\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\"\\n            \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\": \"],[\"append\",[\"helper\",[\"moment-format\"],[[\"get\",[\"taskexecutor\",\"date_closed\"]],\"DD.MM.YYYY, H:mm\"],null],false],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskexecutor\"]},{\"statements\":[[\"text\",\"                \"],[\"append\",[\"helper\",[\"t\"],[\"Detail\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"people.show\",[\"get\",[\"model\",\"customer\",\"id\"]]],[[\"target\"],[\"_blank\"]],3]],\"locals\":[]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"taskstatus\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"taskCompleted\",[\"get\",[\"currentExecutor\"]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Task completed\"],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-info\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"acceptExecute\",[\"get\",[\"currentExecutor\"]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"t\"],[\"Accept for execution\"],null],false],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"t\"],[\"Cancel\"],null],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-success\"],[\"flush-element\"],[\"text\",\"\\n        Ok\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"This task closed\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/tasks/show/template.hbs" } });
});
define("ember-taskin/tasks/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "fbjWvByh", "block": "{\"statements\":[[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"text-left\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Tasks\"],null],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"page-header\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"tasks.new\"],[[\"tagName\"],[\"li\"]],5],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"tasks\",[\"helper\",[\"query-params\"],null,[[\"page\",\"executor\",\"closed\"],[1,[\"get\",[\"all\"]],[\"get\",[\"none\"]]]]]],[[\"tagName\"],[\"li\"]],4],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"tasks\",[\"helper\",[\"query-params\"],null,[[\"closed\"],[0]]]],[[\"tagName\"],[\"li\"]],3],[\"text\",\"\\n\\n        \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Filter by executor\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"tasks\",[\"helper\",[\"query-params\"],null,[[\"executor\"],[0]]]],[[\"tagName\"],[\"li\"]],2],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"members\"]]],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"executor\",\"full_name\"]],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"block\",[\"link-to\"],[\"tasks\",[\"helper\",[\"query-params\"],null,[[\"page\",\"executor\"],[1,[\"get\",[\"executor\",\"id\"]]]]]],[[\"tagName\"],[\"li\"]],0],[\"text\",\"\\n\"]],\"locals\":[\"executor\"]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Executor is empty\"],null],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"The closed tasks hide\"],null],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"All tasks\"],null],false],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Create new task\"],null],false],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/tasks/template.hbs" } });
});
define('ember-taskin/taskstatus/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    project: _emberData['default'].belongsTo('project'),
    order: _emberData['default'].attr('number'),
    tasks: _emberData['default'].hasMany('task')
  });
});
define('ember-taskin/taskstatuses/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),
    model: function model(params) {
      return this.store.findRecord('taskstatus', params.taskstatus_id);
    },

    actions: {

      saveTaskstatus: function saveTaskstatus(newTaskstatus) {
        var _this = this;

        newTaskstatus.save().then(function () {
          return _this.transitionTo('taskstatuses');
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define("ember-taskin/taskstatuses/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3M9fLu8B", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task status edit\"],null],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"form\",[]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"name\"]],[\"helper\",[\"t\"],[\"Enter name\"],null]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Order\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"order\"]],[\"helper\",[\"t\"],[\"Enter index number\"],null]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTaskstatus\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"t\"],[\"Save changes\"],null],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskstatuses/edit/template.hbs" } });
});
define('ember-taskin/taskstatuses/index/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define("ember-taskin/taskstatuses/index/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "b0UiCwJJ", "block": "{\"statements\":[[\"open-element\",\"table\",[]],[\"static-attr\",\"class\",\"table table-hover\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"thead\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Order\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"th\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"tbody\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"t\"],[\"Edit\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"tr\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"order\"]],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"taskstatus\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskstatuses.edit\",[\"get\",[\"taskstatus\"]]],[[\"tagName\",\"class\"],[\"button\",\"btn btn-info\"]],0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"td\",[]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"deleteStatus\",[\"get\",[\"taskstatus\",\"id\"]]]],[\"flush-element\"],[\"text\",\"\\n          \"],[\"append\",[\"helper\",[\"t\"],[\"Delete\"],null],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"taskstatus\"]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskstatuses/index/template.hbs" } });
});
define('ember-taskin/taskstatuses/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),

    model: function model() {
      return this.store.createRecord('taskstatus', {
        project: this.modelFor('projects/show')
      });
    },

    actions: {
      saveTaskstatus: function saveTaskstatus(newTaskstatus) {
        var _this = this;

        newTaskstatus.save().then(function (newTaskstatus) {
          newTaskstatus.reload();
          _this.transitionTo('taskstatuses', _this.modelFor('projects/show'));
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        } else {
          return true;
        }
      }
    }
  });
});
define("ember-taskin/taskstatuses/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZS555esb", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"New task status\"],null],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"form\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Name\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"name\"]],[\"helper\",[\"t\"],[\"Enter name\"],null]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Order\"],null],false],[\"text\",\":\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"model\",\"order\"]],[\"helper\",[\"t\"],[\"Enter index number\"],null]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-success\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"saveTaskstatus\",[\"get\",[\"model\"]]]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"t\"],[\"Save\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskstatuses/new/template.hbs" } });
});
define('ember-taskin/taskstatuses/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    i18n: _ember['default'].inject.service(),

    model: function model() {
      return this.modelFor('projects/show').get('task_statuses');
    },

    actions: {
      deleteStatus: function deleteStatus(status_id) {
        var confirmation = confirm(this.get('i18n').t("Are you sure?"));
        var taskstatus = this.store.peekRecord('taskstatus', status_id);
        if (confirmation) {
          taskstatus.destroyRecord();
        }
      }
    }
  });
});
define('ember-taskin/taskstatuses/show/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findRecord('taskstatus', params.taskstatus_id);
    }
  });
});
define("ember-taskin/taskstatuses/show/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3OjSnfF2", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskstatuses/show/template.hbs" } });
});
define("ember-taskin/taskstatuses/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Cy81z7Ky", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task statuses\"],null],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-3 col-md-2 sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"  \\t\\t\"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav nav-sidebar\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"taskstatuses.new\"],[[\"tagName\"],[\"li\"]],1],[\"block\",[\"link-to\"],[\"taskstatuses\"],[[\"tagName\"],[\"li\"]],0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n  \\t\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-9 main\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Task status list\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"append\",[\"helper\",[\"t\"],[\"Create task status\"],null],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/taskstatuses/template.hbs" } });
});
define("ember-taskin/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "yu9v1w6G", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"welcome-page\"]],false],[\"text\",\"\\n\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "ember-taskin/templates/application.hbs" } });
});
define('ember-taskin/user/model', ['exports', 'ember-data', 'ember'], function (exports, _emberData, _ember) {
  exports['default'] = _emberData['default'].Model.extend({
    username: _emberData['default'].attr('string'),
    first_name: _emberData['default'].attr('string'),
    last_name: _emberData['default'].attr('string'),
    person: _emberData['default'].belongsTo('person', { inverse: null }),
    email: _emberData['default'].attr('string'),
    is_superuser: _emberData['default'].attr('boolean'),
    //for taskin app
    project_creator: _emberData['default'].hasMany('project', { inverse: 'creator' }),
    projects_member: _emberData['default'].hasMany('project', { inverse: 'members' }),
    projectmember_set: _emberData['default'].hasMany('member'),
    task_creator: _emberData['default'].hasMany('task', { inverse: 'creator' }),
    tasks_customer: _emberData['default'].hasMany('task', { inverse: 'customer' }),
    taskfiles_creator: _emberData['default'].hasMany('taskfile', { inverse: 'creator' }),
    full_name: _ember['default'].computed('first_name', 'last_name', function () {
      if (this.get('first_name')) {
        return this.get('last_name') + ' ' + this.get('first_name');
      } else {
        return '' + this.get('username');
      }
    }),
    person_name: _ember['default'].computed('person.{name}', 'first_name', 'username', function () {
      if (this.get('person.name')) {
        return this.get('person.name');
      } else if (this.get('first_name')) {
        return this.get('last_name') + ' ' + this.get('first_name');
      } else {
        return this.get('username');
      }
    })
  });
});
define('ember-taskin/utils/i18n/compile-template', ['exports', 'ember-i18n/utils/i18n/compile-template'], function (exports, _emberI18nUtilsI18nCompileTemplate) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberI18nUtilsI18nCompileTemplate['default'];
    }
  });
});
define('ember-taskin/utils/i18n/missing-message', ['exports', 'ember-i18n/utils/i18n/missing-message'], function (exports, _emberI18nUtilsI18nMissingMessage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberI18nUtilsI18nMissingMessage['default'];
    }
  });
});


define('ember-taskin/config/environment', ['ember'], function(Ember) {
  var prefix = 'ember-taskin';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("ember-taskin/app")["default"].create({"API_NAMESPACE":"taskin/api","name":"ember-taskin","version":"0.0.0+37f6f39e","API_HOST":"http://localhost:8000","API_ADD_TRAILING_SLASHES":true});
}
//# sourceMappingURL=ember-taskin.map
