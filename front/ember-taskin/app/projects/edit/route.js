import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),

  model(params) {
    return this.store.findRecord('project', params.project_id);
  },

  actions: {

    saveProject(project) {
      this.store.findRecord('user', this.get('session.data.authenticated.user.id'))
      .then((currentUser)=>{
        project.set('creator',currentUser);
        project.save()
        .then(() => this.transitionTo('projects.show', project.id));
      })


    },

    willTransition(transition) {

      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

        if (confirmation) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});
