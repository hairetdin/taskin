import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),

  model() {
    return this.store.createRecord('taskstatus', {
      project: this.modelFor('projects/show')
    });
  },

  actions: {
    saveTaskstatus(newTaskstatus) {
      newTaskstatus.save().then((newTaskstatus) => {
        newTaskstatus.reload();
        this.transitionTo('taskstatuses', this.modelFor('projects/show'));
      });
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
      } else {
        return true;
      }
    }
  }
});
