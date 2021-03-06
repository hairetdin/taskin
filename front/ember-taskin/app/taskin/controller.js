import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  actions: {
    selectProject(project_id) {
      let project = this.store.peekRecord('taskin/project', project_id);
      this.get('session').set('data.project', {'id':project.id, 'name':project.get('name')});
      //this.transitionToRoute('taskin.tasks', {queryParams: {project: project.id}});
      this.transitionToRoute('taskin.tasks', project.id);
    },
  }
});
