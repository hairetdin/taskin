import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),

  model(/*params*/) {
    this.store.unloadAll('taskexecutor');
    return this.store.createRecord('task', {
      project: this.modelFor('projects/show')
    });
  },

  setupController: function(controller, model) {
    this.store.query('member', {project: this.get('model.project.id')});
    controller.set("model", model);
    //controller.set("project", this.modelFor('projects/show'));
    this.store.createRecord('taskexecutor');
    controller.set("taskexecutors", this.store.peekAll('taskexecutor'));
    controller.set("customers", this.store.peekAll('choiceperson'));
  },

  actions: {
    cancel() {
      this.transitionTo('tasks');
    },

    saveTask(newTask) {
      let creator_id = this.controller.get('session.data.authenticated.user.id');
      let creator = this.store.peekRecord('user', creator_id);
      /*
      let newPerson = this.controller.get('newPerson');
      let customer = null;

      if (newPerson) {
        //create new person
        this.store.createRecord('choiceperson', {
          name: newPerson,
          creator: creator,
        })
        .save()
        .then((person)=>{
          customer = person;
        });
      }
      */

      this.controller.set('model.creator', creator);
      if (this.controller.get('model.status.content') == null) {
        let taskstatus = this.controller.get('model.project.task_statuses').get('firstObject');
        this.controller.set('model.status', taskstatus);
      }

      newTask.save()
        .then((thisTask)=>{
          let taskexecutors = this.controller.get('taskexecutors');
          taskexecutors.forEach(function(taskexecutor){
            if (taskexecutor.get('executor.content')){
              taskexecutor.set('task',thisTask);
              taskexecutor.save();
            } else {
              taskexecutor.deleteRecord();
            }
          });
          /*
          if (customer) {
            //console.log('customer id' ,customer.get('id'));
            thisTask.set('customer', customer);
            thisTask.save()
            .then(()=>{
              this.transitionTo('tasks');
            });
          } else {
            this.transitionTo('tasks');
          }
          */
          this.transitionTo('tasks');
        });
    },

    willTransition(transition) {

      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

        if (confirmation) {
          model.rollbackAttributes();
          this.controller.set('userValue','');
          this.controller.set('newPerson','');
          //this.store.unloadAll('taskexecutor');
        } else {
          transition.abort();
        }
      } else {
        this.controller.set('userValue','');
        this.controller.set('newPerson','');
        return true;
      }
    },

  }
});
