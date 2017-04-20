import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),

  model(/*params*/) {
    this.store.unloadAll('member');
    this.store.unloadAll('taskexecutor');
    return this.store.createRecord('task', {
      project: this.modelFor('projects/show')
    });
  },

  setupController: function(controller, model) {
    controller.set("model", model);
    let projectsMember = this.store.query('choiceuser', {projects_member: this.get('model.project.id')});
    controller.set("projectsMember", projectsMember);
    //controller.set("project", this.modelFor('projects/show'));
    //this.store.createRecord('taskexecutor');
    //controller.set("taskexecutors", this.store.peekAll('taskexecutor'));
    controller.set("customers", this.store.peekAll('choiceperson'));
  },

  resetController(controller, isExiting /*, transition*/) {
    if (isExiting) {
      this.controller.set('executors',null);
      this.store.unloadAll('choiceuser');
      //this.store.unloadAll('task');
      /*
      this.controller.set('organizationValue', '');

      this.store.unloadAll('company/choiceperson');
      */
    }
  },

  actions: {
    cancel() {
      this.transitionTo('tasks');
    },

    saveTask(newTask) {
      let creator_id = this.controller.get('session.data.authenticated.user.id');
      let creator = this.store.peekRecord('user', creator_id);


      this.controller.set('model.creator', creator);
      if (this.controller.get('model.status.content') == null) {
        let taskstatus = this.controller.get('model.project.task_statuses').get('firstObject');
        this.controller.set('model.status', taskstatus);
      }
      let _this = this;
      newTask.save()
        .then((thisTask)=>{
          // create executors from power-select-multiple
          let executors = this.controller.get('executors');
          if (executors){
            executors.forEach(function(executor, idx, array){
              _this.store.queryRecord('member', {
                user: executor.get('id'),
                project: thisTask.get('project.id')
              })
              .then(function(member){
                let taskExecutor = _this.store.createRecord('taskexecutor', {
                  task: thisTask,
                  executor: member
                });
                taskExecutor.save();
  
                if (idx === array.length - 1){
                  _this.transitionTo('tasks.show', thisTask.id);
                }
              });
            });

          } else {
            _this.transitionTo('tasks.show', thisTask.id);
          }


          /*
          let taskexecutors = this.controller.get('taskexecutors');
          taskexecutors.forEach(function(taskexecutor){
            if (taskexecutor.get('executor.content')){
              taskexecutor.set('task',thisTask);
              taskexecutor.save();
            } else {
              taskexecutor.deleteRecord();
            }
          });
          */

          //this.transitionTo('tasks');
        });
    },

    willTransition(transition) {

      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

        if (confirmation) {
          model.rollbackAttributes();
          //this.controller.set('userValue','');
          //this.controller.set('newPerson','');

          //this.store.unloadAll('taskexecutor');
        } else {
          transition.abort();
        }
      } else {
        /*
        this.controller.set('userValue','');
        this.controller.set('newPerson','');
        */
        return true;
      }
    },

  }
});
