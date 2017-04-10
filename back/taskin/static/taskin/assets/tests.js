'use strict';

define('ember-taskin/tests/app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/application/adapter.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - application/adapter.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'application/adapter.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/application/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - application/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'application/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/application/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - application/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'application/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/authenticators/django.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - authenticators/django.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authenticators/django.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/authorizers/django.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - authorizers/django.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authorizers/django.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/choiceperson/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - choiceperson/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'choiceperson/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/choiceuser/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - choiceuser/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'choiceuser/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/components/user-info/component.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - components/user-info/component.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/user-info/component.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('ember-taskin/tests/helpers/destroy-app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/destroy-app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/helpers/ember-i18n/test-helpers', ['exports', 'ember'], function (exports, _ember) {

  // example usage: find(`.header:contains(${t('welcome_message')})`)
  _ember['default'].Test.registerHelper('t', function (app, key, interpolations) {
    var i18n = app.__container__.lookup('service:i18n');
    return i18n.t(key, interpolations);
  });

  // example usage: expectTranslation('.header', 'welcome_message');
  _ember['default'].Test.registerHelper('expectTranslation', function (app, element, key, interpolations) {
    var text = app.testHelpers.t(key, interpolations);

    assertTranslation(element, key, text);
  });

  var assertTranslation = (function () {
    if (typeof QUnit !== 'undefined' && typeof QUnit.assert.ok === 'function') {
      return function (element, key, text) {
        QUnit.assert.ok(find(element + ':contains(' + text + ')').length, 'Found translation key ' + key + ' in ' + element);
      };
    } else if (typeof expect === 'function') {
      return function (element, key, text) {
        var found = !!find(element + ':contains(' + text + ')').length;
        expect(found).to.equal(true);
      };
    } else {
      return function () {
        throw new Error("ember-i18n could not find a compatible test framework");
      };
    }
  })();
});
define('ember-taskin/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _emberSimpleAuthAuthenticatorsTest) {
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;

  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _emberSimpleAuthAuthenticatorsTest['default']);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }
});
/* global wait */
define('ember-taskin/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'ember-taskin/tests/helpers/start-app', 'ember-taskin/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _emberTaskinTestsHelpersStartApp, _emberTaskinTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _emberTaskinTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _emberTaskinTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('ember-taskin/tests/helpers/module-for-acceptance.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/module-for-acceptance.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/helpers/resolver', ['exports', 'ember-taskin/resolver', 'ember-taskin/config/environment'], function (exports, _emberTaskinResolver, _emberTaskinConfigEnvironment) {

  var resolver = _emberTaskinResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _emberTaskinConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _emberTaskinConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('ember-taskin/tests/helpers/resolver.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/resolver.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/helpers/start-app', ['exports', 'ember', 'ember-taskin/app', 'ember-taskin/config/environment'], function (exports, _ember, _emberTaskinApp, _emberTaskinConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var attributes = _ember['default'].merge({}, _emberTaskinConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    return _ember['default'].run(function () {
      var application = _emberTaskinApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('ember-taskin/tests/helpers/start-app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/start-app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/integration/components/user-info/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('user-info', 'Integration | Component | user info', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'cr0nuXaU',
      'block': '{"statements":[["append",["unknown",["user-info"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '0MtoKzGJ',
      'block': '{"statements":[["text","\\n"],["block",["user-info"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('ember-taskin/tests/integration/components/user-info/component-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - integration/components/user-info/component-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/user-info/component-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/locales/en/config.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - locales/en/config.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/en/config.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/locales/en/translations.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - locales/en/translations.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/en/translations.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/locales/ru/config.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - locales/ru/config.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/ru/config.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/locales/ru/translations.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - locales/ru/translations.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'locales/ru/translations.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/login/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - login/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'login/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/login/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - login/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'login/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/member/choice/transform.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - member/choice/transform.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'member/choice/transform.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/member/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - member/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'member/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/members/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - members/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'members/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/members/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - members/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'members/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/members/new/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - members/new/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'members/new/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/members/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - members/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'members/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/members/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - members/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'members/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/members/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - members/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'members/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/not-found/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - not-found/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'not-found/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/people/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - people/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'people/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/person/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - person/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'person/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/project/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - project/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'project/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/projects/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - projects/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'projects/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/projects/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - projects/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'projects/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/projects/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - projects/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'projects/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/projects/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - projects/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'projects/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/projects/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - projects/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'projects/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/resolver.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - resolver.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/router.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - router.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/task/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - task/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'task/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskcomment/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskcomment/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskcomment/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskcomments/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskcomments/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskcomments/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskcomments/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskcomments/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskcomments/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskexecutor/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskexecutor/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskexecutor/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskfile/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskfile/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskfile/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskfiles/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskfiles/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskfiles/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskfiles/new/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskfiles/new/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskfiles/new/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskfiles/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskfiles/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskfiles/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskfiles/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskfiles/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskfiles/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/choiceperson/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/choiceperson/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/choiceperson/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/choiceuser/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/choiceuser/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/choiceuser/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/login/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/login/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/login/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/login/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/login/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/login/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/member/choice/transform.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/member/choice/transform.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/member/choice/transform.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/member/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/member/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/member/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/members/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/members/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/members/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/members/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/members/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/members/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/members/new/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/members/new/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/members/new/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/members/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/members/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/members/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/members/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/members/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/members/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/members/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/members/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/members/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/people/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/people/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/people/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/person/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/person/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/person/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/project/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/project/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/project/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/projects/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/projects/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/projects/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/projects/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/projects/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/projects/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/projects/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/projects/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/projects/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/projects/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/projects/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/projects/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/projects/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/projects/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/projects/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/task/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/task/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/task/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskcomment/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskcomment/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskcomment/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskcomments/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskcomments/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskcomments/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskexecutor/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskexecutor/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskexecutor/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskfile/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskfile/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskfile/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskfiles/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskfiles/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskfiles/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/edit/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/edit/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/edit/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/index/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/index/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/index/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/new/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/new/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/new/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/show/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/show/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/show/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/tasks/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/tasks/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/tasks/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskstatus/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskstatus/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskstatus/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskstatuses/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskstatuses/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskstatuses/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskstatuses/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskstatuses/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskstatuses/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskstatuses/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskstatuses/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskstatuses/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskstatuses/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskstatuses/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskstatuses/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/taskstatuses/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/taskstatuses/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/taskstatuses/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskin/user/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskin/user/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskin/user/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/edit/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/edit/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/edit/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/index/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/index/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/index/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/new/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/new/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/new/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/show/controller.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/show/controller.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/show/controller.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/tasks/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - tasks/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tasks/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskstatus/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskstatus/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskstatus/model.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskstatuses/edit/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskstatuses/edit/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskstatuses/edit/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskstatuses/index/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskstatuses/index/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskstatuses/index/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskstatuses/new/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskstatuses/new/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskstatuses/new/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskstatuses/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskstatuses/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskstatuses/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/taskstatuses/show/route.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - taskstatuses/show/route.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'taskstatuses/show/route.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/test-helper', ['exports', 'ember-taskin/tests/helpers/resolver', 'ember-qunit'], function (exports, _emberTaskinTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_emberTaskinTestsHelpersResolver['default']);
});
define('ember-taskin/tests/test-helper.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - test-helper.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/application/adapter-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('ember-taskin/tests/unit/application/adapter-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/application/adapter-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/application/adapter-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/application/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/application/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/application/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/application/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/application/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/application/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/application/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/application/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/choiceperson/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('choiceperson', 'Unit | Model | choiceperson', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/choiceperson/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/choiceperson/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/choiceperson/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/choiceuser/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('choiceuser', 'Unit | Model | choiceuser', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/choiceuser/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/choiceuser/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/choiceuser/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/login/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:login', 'Unit | Controller | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/login/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/login/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/login/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/login/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/login/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/login/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/login/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/member/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('member', 'Unit | Model | member', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/member/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/member/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/member/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/members/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:members/edit', 'Unit | Route | members/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/members/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/members/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/members/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/members/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:members/index', 'Unit | Route | members/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/members/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/members/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/members/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/members/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:members/new', 'Unit | Controller | members/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/members/new/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/members/new/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/members/new/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/members/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:members/new', 'Unit | Route | members/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/members/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/members/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/members/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/members/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:members', 'Unit | Route | members', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/members/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/members/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/members/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/members/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:members/show', 'Unit | Route | members/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/members/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/members/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/members/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/not-found/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:not-found', 'Unit | Route | not found', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/not-found/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/not-found/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/not-found/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/people/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:people', 'Unit | Route | people', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/people/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/people/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/people/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/person/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('person', 'Unit | Model | person', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/person/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/person/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/person/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/project/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('project', 'Unit | Model | project', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/project/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/project/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/project/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/projects/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:projects/edit', 'Unit | Route | projects/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/projects/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/projects/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/projects/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/projects/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:projects/index', 'Unit | Route | projects/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/projects/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/projects/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/projects/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/projects/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:projects/new', 'Unit | Route | projects/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/projects/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/projects/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/projects/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/projects/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:projects', 'Unit | Route | projects', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/projects/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/projects/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/projects/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/projects/show/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:projects/show/index', 'Unit | Route | projects/show/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/projects/show/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/projects/show/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/projects/show/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/projects/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:projects/show', 'Unit | Route | projects/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/projects/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/projects/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/projects/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/task/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('task', 'Unit | Model | task', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/task/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/task/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/task/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskcomment/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskcomment', 'Unit | Model | taskcomment', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskcomment/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskcomment/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskcomment/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskcomments/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskcomments/new', 'Unit | Route | taskcomments/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskcomments/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskcomments/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskcomments/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskcomments/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskcomments', 'Unit | Route | taskcomments', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskcomments/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskcomments/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskcomments/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskexecutor/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskexecutor', 'Unit | Model | taskexecutor', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskexecutor/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskexecutor/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskexecutor/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskfile/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskfile', 'Unit | Model | taskfile', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskfile/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskfile/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskfile/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskfiles/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskfiles/index', 'Unit | Route | taskfiles/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskfiles/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskfiles/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskfiles/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskfiles/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskfiles/new', 'Unit | Controller | taskfiles/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskfiles/new/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskfiles/new/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskfiles/new/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskfiles/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskfiles/new', 'Unit | Route | taskfiles/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskfiles/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskfiles/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskfiles/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskfiles/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskfiles', 'Unit | Route | taskfiles', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskfiles/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskfiles/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskfiles/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/choiceperson/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/choiceperson', 'Unit | Model | taskin/choiceperson', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/choiceperson/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/choiceperson/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/choiceperson/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/choiceuser/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/choiceuser', 'Unit | Model | taskin/choiceuser', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/choiceuser/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/choiceuser/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/choiceuser/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskin', 'Unit | Controller | taskin', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskin/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/login/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskin/login', 'Unit | Controller | taskin/login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskin/login/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/login/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/login/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/login/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/login', 'Unit | Route | taskin/login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/login/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/login/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/login/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/member/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/member', 'Unit | Model | taskin/member', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/member/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/member/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/member/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/members/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/members/edit', 'Unit | Route | taskin/members/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/members/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/members/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/members/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/members/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/members/index', 'Unit | Route | taskin/members/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/members/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/members/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/members/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/members/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskin/members/new', 'Unit | Controller | taskin/members/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskin/members/new/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/members/new/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/members/new/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/members/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/members/new', 'Unit | Route | taskin/members/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/members/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/members/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/members/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/members/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/members', 'Unit | Route | taskin/members', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/members/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/members/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/members/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/members/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/members/show', 'Unit | Route | taskin/members/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/members/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/members/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/members/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/people/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/people', 'Unit | Route | taskin/people', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/people/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/people/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/people/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/person/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/person', 'Unit | Model | taskin/person', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/person/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/person/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/person/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/project/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/project', 'Unit | Model | taskin/project', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/project/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/project/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/project/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/projects/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/projects/edit', 'Unit | Route | taskin/projects/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/projects/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/projects/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/projects/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/projects/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/projects/index', 'Unit | Route | taskin/projects/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/projects/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/projects/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/projects/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/projects/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/projects/new', 'Unit | Route | taskin/projects/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/projects/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/projects/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/projects/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/projects/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/projects', 'Unit | Route | taskin/projects', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/projects/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/projects/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/projects/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/projects/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/projects/show', 'Unit | Route | taskin/projects/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/projects/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/projects/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/projects/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin', 'Unit | Route | taskin', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/task/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/task', 'Unit | Model | taskin/task', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/task/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/task/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/task/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskcomment/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/taskcomment', 'Unit | Model | taskin/taskcomment', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/taskcomment/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskcomment/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskcomment/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskcomments/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/taskcomments', 'Unit | Route | taskin/taskcomments', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/taskcomments/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskcomments/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskcomments/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskexecutor/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/taskexecutor', 'Unit | Model | taskin/taskexecutor', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/taskexecutor/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskexecutor/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskexecutor/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskfile/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/taskfile', 'Unit | Model | taskin/taskfile', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/taskfile/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskfile/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskfile/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskfiles/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/taskfiles', 'Unit | Route | taskin/taskfiles', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/taskfiles/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskfiles/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskfiles/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/edit/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskin/tasks/edit', 'Unit | Controller | taskin/tasks/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/edit/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/edit/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/edit/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/tasks/edit', 'Unit | Route | taskin/tasks/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/index/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskin/tasks/index', 'Unit | Controller | taskin/tasks/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/index/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/index/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/index/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/tasks/index', 'Unit | Route | taskin/tasks/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskin/tasks/new', 'Unit | Controller | taskin/tasks/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/new/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/new/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/new/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/tasks/new', 'Unit | Route | taskin/tasks/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/tasks', 'Unit | Route | taskin/tasks', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:taskin/tasks/show', 'Unit | Controller | taskin/tasks/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/show/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/show/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/show/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/tasks/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/tasks/show', 'Unit | Route | taskin/tasks/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/tasks/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/tasks/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/tasks/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskstatus/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/taskstatus', 'Unit | Model | taskin/taskstatus', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/taskstatus/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskstatus/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskstatus/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/taskstatuses/edit', 'Unit | Route | taskin/taskstatuses/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskstatuses/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskstatuses/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/taskstatuses/index', 'Unit | Route | taskin/taskstatuses/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskstatuses/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskstatuses/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/taskstatuses/new', 'Unit | Route | taskin/taskstatuses/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskstatuses/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskstatuses/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/taskstatuses', 'Unit | Route | taskin/taskstatuses', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskstatuses/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskstatuses/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskin/taskstatuses/show', 'Unit | Route | taskin/taskstatuses/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskin/taskstatuses/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/taskstatuses/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/taskstatuses/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskin/user/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskin/user', 'Unit | Model | taskin/user', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskin/user/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskin/user/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskin/user/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/edit/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:tasks/edit', 'Unit | Controller | tasks/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/tasks/edit/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/edit/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/edit/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:tasks/edit', 'Unit | Route | tasks/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/tasks/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/index/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:tasks/index', 'Unit | Controller | tasks/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/tasks/index/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/index/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/index/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:tasks/index', 'Unit | Route | tasks/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/tasks/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/new/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:tasks/new', 'Unit | Controller | tasks/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/tasks/new/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/new/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/new/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:tasks/new', 'Unit | Route | tasks/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/tasks/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:tasks', 'Unit | Route | tasks', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/tasks/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/show/controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:tasks/show', 'Unit | Controller | tasks/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ember-taskin/tests/unit/tasks/show/controller-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/show/controller-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/show/controller-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/tasks/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:tasks/show', 'Unit | Route | tasks/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/tasks/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/tasks/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/tasks/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskstatus/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('taskstatus', 'Unit | Model | taskstatus', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/taskstatus/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskstatus/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskstatus/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskstatuses/edit/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskstatuses/edit', 'Unit | Route | taskstatuses/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskstatuses/edit/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskstatuses/edit/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskstatuses/edit/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskstatuses/index/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskstatuses/index', 'Unit | Route | taskstatuses/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskstatuses/index/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskstatuses/index/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskstatuses/index/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskstatuses/new/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskstatuses/new', 'Unit | Route | taskstatuses/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskstatuses/new/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskstatuses/new/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskstatuses/new/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskstatuses/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskstatuses', 'Unit | Route | taskstatuses', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskstatuses/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskstatuses/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskstatuses/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/taskstatuses/show/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:taskstatuses/show', 'Unit | Route | taskstatuses/show', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('ember-taskin/tests/unit/taskstatuses/show/route-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/taskstatuses/show/route-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/taskstatuses/show/route-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/unit/user/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForModel)('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ember-taskin/tests/unit/user/model-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/user/model-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/user/model-test.js should pass ESLint.\n');
  });
});
define('ember-taskin/tests/user/model.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - user/model.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'user/model.js should pass ESLint.\n');
  });
});
require('ember-taskin/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
