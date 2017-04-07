import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),

  model() {
    return this.store.createRecord('taskin/taskstatus', {
      project: this.modelFor('taskin/projects/show')
    });
  },

  actions: {
    saveTaskstatus(newTaskstatus) {
      newTaskstatus.save().then((newTaskstatus) => {
        newTaskstatus.reload();
        this.transitionTo('taskin.taskstatuses', this.modelFor('taskin/projects/show'));
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
