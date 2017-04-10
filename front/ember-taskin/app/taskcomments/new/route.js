import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),
  model() {
    return this.store.createRecord('taskcomment', {
      task: this.modelFor('tasks/show')
    });
  },

  actions: {
    saveComment(newComment) {
      let creator_id = this.get('session.data.authenticated.user.id');
      let creator = this.store.peekRecord('user', creator_id);
      this.controller.set('model.creator', creator);
      newComment.save()
        .then(() => {
          this.transitionTo('taskcomments');
        });
    },

    willTransition(transition) {

      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

        if (confirmation) {
          model.rollbackAttributes();
          //this.store.unloadAll('taskexecutor');
        } else {
          transition.abort();
        }
      } else {
        return true;
      }
    },
  }
});
