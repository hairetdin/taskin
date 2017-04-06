import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  model() {
    return this.store.findAll('taskin/project');
  },

  actions: {
    deleteProject(project) {
      let confirmation = confirm(this.get('i18n').t("Are you sure?"));
      //let project = this.store.peekRecord('taskin/project', project_id);
      if (confirmation) {
        project.destroyRecord();
      }
    },
  },
});
