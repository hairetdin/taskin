import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  userValue: '',
  newPerson: '',

  actions: {
    customerClick(customer_name, customer){
      //let customer = this.store.findRecord('people/user', customer_id);
      this.set('model.customer', customer);
      this.set("userValue", customer_name);
    },

    focusedCustomer: function(){
      //console.log('focusedCustomer');
      this.store.unloadAll('choiceperson');
      Ember.$('#btn-search').click();
    },

    handleFilterCustomer(){
      let filterInputValue = this.get('userValue');
			if(filterInputValue.length<2){
				//console.log('value<2',filterInputValue);
        this.store.unloadAll('choiceperson');
        this.set('newPerson','');
			} else {
        this.store.unloadAll('choiceperson');
        if (filterInputValue !== this.newPerson){
          this.set('newPerson','');
        }
        let _this = this;
        this.get('store').query('choiceperson', { name: filterInputValue })
          .then(function(person) {
            //console.log(person.get('length'));
            if (person.get('length') === 0) {
              _this.set('newPerson', filterInputValue);
            }
          });
			}
		},

    addExecutor(){
      this.store.createRecord('taskexecutor');
    },

    removeExecutor(executor){
      executor.deleteRecord();
    },

    selectCustomer(customer_id) {
      let customer = this.store.peekRecord('people/user', customer_id);
      this.set('model.task.customer', customer);
    },

    selectTaskstatus(taskstatus_id) {
      let taskstatus = this.store.peekRecord('taskstatus', taskstatus_id);
      this.set('model.status', taskstatus);
    },

    selectExecutor(taskexecutor, member_id) {
      let member = this.store.peekRecord('member', member_id);
      taskexecutor.set('executor', member);
      //console.log(taskexecutor.get('executor.user.username'));
    },

    selectProject(project_id) {
      let project = this.store.peekRecord('project', project_id);
      this.set('model.task.project', project);
    },
  }
});
