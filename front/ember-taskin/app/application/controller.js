import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  sessionAuthenticated: Ember.observer('session.isAuthenticated', function () {
    //reload taskin application because model load/unload if session isAuthenticated
    window.location.href = '/taskin/';
  }),

  actions: {
    selectProject(project_id) {
      //selected project set to session and show tasks for selected project
      let project = this.store.peekRecord('project', project_id);
      this.get('session').set('data.project', {'id':project.id, 'name':project.get('name')});
      //this.transitionToRoute('tasks', {queryParams: {project: project.id}});
      this.transitionToRoute('tasks', project.id);
    },
  }
});
