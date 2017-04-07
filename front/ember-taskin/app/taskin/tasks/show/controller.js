import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    selectTaskstatus(taskstatus_id) {
      let taskstatus = this.store.peekRecord('taskin/taskstatus', taskstatus_id);
      this.set('model.status', taskstatus);
      this.model.save();
    },
  }
});
