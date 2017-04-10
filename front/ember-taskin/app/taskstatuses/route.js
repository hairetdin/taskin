import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),

  model() {
    return this.modelFor('projects/show').get('task_statuses');
  },

  actions: {
    deleteStatus(status_id) {
      let confirmation = confirm(this.get('i18n').t("Are you sure?"));
      let taskstatus = this.store.peekRecord('taskstatus', status_id);
      if (confirmation) {
        taskstatus.destroyRecord();
      }
    }
  }
});
