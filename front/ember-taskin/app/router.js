import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('taskin', function() {
    this.route('login');
    this.route('projects', function() {
      this.route('new');
      this.route('edit');
      this.route('show');
    });
    this.route('tasks');
    this.route('members');
    this.route('taskstatuses');
    this.route('taskcomment');
    this.route('taskcomments');
    this.route('taskfiles');
    this.route('people');
  });
  this.route('login');
});

export default Router;
