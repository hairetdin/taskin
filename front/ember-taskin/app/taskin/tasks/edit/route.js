import Ember from 'ember';
import RSVP from 'rsvp';


export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),

  model(params) {
    let currentProject = this.modelFor('taskin/projects/show');
    this.store.unloadAll('taskin/taskexecutor');
    this.store.unloadAll('taskin/user');
    this.store.query('taskin/taskexecutor', {'task': params.task_id});
    return RSVP.hash({
      members: this.store.query('taskin/member', {project: currentProject.id}),
      taskexecutors: this.store.peekAll('taskin/taskexecutor'),
      task: this.store.findRecord('taskin/task', params.task_id),
      customers: this.store.peekAll('taskin/choiceperson'),
    });
  },

  setupController: function(controller, model) {
    // all your data is in model hash
    controller.set("model", model);
    //controller.set("newReview", model.newReview);
  },

  actions: {
    deleteTask(task) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        task.destroyRecord().
          then(()=>this.transitionTo('taskin'));
      }

    },
    saveTask(newTask) {

      let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));
      if (confirmation) {
        //console.log(newTask.changedAttributes());
        newTask.save().
          then((thisTask) =>{
            let taskexecutors = this.controller.get('model.taskexecutors');
            let now = new Date();
            //let taskexecutors = this.store.peekAll('taskin/taskexecutor');
            taskexecutors.forEach(function(taskexecutor){
              if (taskexecutor.get('executor.content')){
                taskexecutor.set('task',thisTask);
                if (!(taskexecutor.get('date_accepted') instanceof Date)){
                  //console.log('date_accepted is selected', now);
                  if (taskexecutor.get('date_accepted')){
                    taskexecutor.set('date_accepted',now);
                  } else {
                    taskexecutor.set('date_accepted',null);
                  }
                }
                if (!(taskexecutor.get('date_closed') instanceof Date)){
                  if (taskexecutor.get('date_closed')){
                    taskexecutor.set('date_closed',now);
                  } else {
                    taskexecutor.set('date_closed',null);
                  }
                }
                taskexecutor.save();
              } else {
                taskexecutor.deleteRecord();
              }
            });

            this.transitionTo('taskin');
          });
      }
    },

    willTransition(transition) {

      let model = this.controller.get('model.task');
      if (model.get('isDeleted')){
        return true;
      } else if (model.get('hasDirtyAttributes')) {
        //console.log(model.changedAttributes());
        let confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

        if (confirmation) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});
