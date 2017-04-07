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
      this.route('edit', {
        path: ':project_id/edit'
      });
      this.route('show', {path: ':project_id'}, function() {
        this.route('taskin.members', {path: "/members", resetNamespace: true}, function() {
          this.route('new');
          this.route('show', {
            path: ':member_id'
          });
          this.route('edit', {
            path: ':member_id/edit'
          });
        });
        this.route('taskin.tasks', {path: "/tasks", resetNamespace: true}, function() {
          this.route('new');

          this.route('show', {path: ':task_id'}, function() {
            this.route('taskin.taskcomments', {path: "/comments", resetNamespace: true}, function() {
              this.route('new');
            });
            this.route('taskin.taskfiles', {path: "/files", resetNamespace: true}, function() {
              this.route('new');
            });
          });

          this.route('edit', {
            path: ':task_id/edit'
          });
        });
        this.route('taskin.taskstatuses', {path: "/taskstatuses", resetNamespace: true}, function() {
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
    /*
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
    */
  });
  this.route('login');
});

export default Router;
