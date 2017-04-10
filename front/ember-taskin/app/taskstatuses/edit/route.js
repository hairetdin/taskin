import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  model(params) {
    return this.store.findRecord('taskstatus', params.taskstatus_id);
  },

  actions: {

    saveTaskstatus(newTaskstatus) {
      newTaskstatus.save().then(() => this.transitionTo('taskstatuses'));
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
