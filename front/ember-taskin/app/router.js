import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('taskin', function() {
    this.route('login');
  });
  this.route('login');
});

export default Router;
