import Ember from 'ember';
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(/*AuthenticatedRouteMixin, */{
  i18n: Ember.inject.service(),
  model() {
    return this.store.findAll('project');
  },

  actions: {
    deleteProject(project) {
      let confirmation = confirm(this.get('i18n').t("Are you sure?"));
      //let project = this.store.peekRecord('project', project_id);
      if (confirmation) {
        project.destroyRecord();
      }
    },
  },
});
