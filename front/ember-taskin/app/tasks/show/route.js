import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  model(params) {
    return  this.store.findRecord('task', params.task_id);
  },

  setupController: function(controller, model) {
    // all your data is in model hash
    controller.set("model", model);
    //controller.set("session", this.session);
    let current_user = this.get('session.data.authenticated.user.id');
    model.get('taskexecutors').
      then(function(taskexecutors){
        taskexecutors.forEach(function(item) {
          controller.set("currentExecutor", item.get('id'));
          item.get('executor').then((member)=>{
            let executorUserId = member.get('user.id');
            if (executorUserId == current_user) {
              if (!(item.get('date_accepted'))){
                controller.set("acceptForExecute", true);
              }
              if (!(item.get('date_closed'))){
                controller.set("taskCompleted", true);
              }
            }
          });
        });
      });
    //controller.set("newReview", model.newReview);
  },

  actions: {
    acceptExecute(executorId){
      let now = new Date();
      let controller = this.controller;
      this.store.findRecord('taskexecutor', executorId).
        then(function(taskexecutor){
          taskexecutor.set('date_accepted',now);
          taskexecutor.save();
          controller.set("acceptForExecute", false);
        });
    },

    taskCompleted(executorId){
      let now = new Date();
      let controller = this.controller;
      this.store.findRecord('taskexecutor', executorId).
        then(function(taskexecutor){
          taskexecutor.set('date_closed',now);
          taskexecutor.save();
          controller.set("taskCompleted", false);
        });
    },

    selectTaskstatus(taskstatus_id) {
      let taskstatus = this.store.peekRecord('taskstatus', taskstatus_id);
      this.set('model.status', taskstatus);
    },

    willTransition() {
      this.controller.set("acceptForExecute", false);
      this.controller.set("taskCompleted", false);
    }
  }
});
