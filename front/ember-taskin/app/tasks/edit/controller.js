import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  userValue: Ember.computed('model.task.customer.name', function() {
    if (this.get('model.task.customer.name')) {
      return `${this.get('model.task.customer.name')}`;
    }
    return null;
  }),

  init: function() {
    this.store.createRecord('taskexecutor');
    //userValue = this.get('model.task.customer.username');
  },

  date_accepted: function(){
    //console.log('executor.date_accepted checked');
  },

  currentProjectChanged: Ember.observer('session.data.project.id', function(){
    this.transitionToRoute('tasks');
  }),

  actions: {
    focusedCustomer: function(){
      //console.log('focusedCustomer');
      Ember.$('#btn-search').click();
    },
    handleFilterCustomer(){
      let filterInputValue = this.get('userValue');
			if(filterInputValue.length<2){
				//console.log('value<2',filterInputValue);
        this.store.unloadAll('choiceperson');
        //this.store.query('member', {project: this.get('model.task.project.id')});
			} else {
        this.store.unloadAll('choiceperson');
        this.get('store').query('choiceperson', { name: filterInputValue });
        //this.store.query('member', {project: this.get('model.task.project.id')});
        //console.log('value>3',filterInputValue);
			}
		},
    customerClick(customer_name, customer){
      this.set("userValue", customer_name);
      //let customer = this.store.peekRecord('people/user', customer_id);
      this.set('model.task.customer', customer);
    },
    addExecutor(){
      this.store.createRecord('taskexecutor');
      //console.log(this.newExecutor);
      //this.get('executorItems').push({id:insertId,name:'test'});
    },

    removeExecutor(item){
      item.deleteRecord();
      item.save();
      //console.log(this.newExecutor);
      //this.get('executorItems').push({id:insertId,name:'test'});
    },

    selectCustomer(customer_id) {
      //console.log(customer_id);
      let customer = this.store.peekRecord('people/user', customer_id);
      this.set('model.task.customer', customer);
    },

    selectTaskstatus(taskstatus_id) {
      let taskstatus = this.store.peekRecord('taskstatus', taskstatus_id);
      this.set('model.task.status', taskstatus);
    },

    selectExecutor(executor, member_id) {
      let member = this.store.peekRecord('member', member_id);
      //console.log('newmember',member_id,member.get('user.username'));
      executor.set('executor', member);
      //console.log('set executor:', executor.get('executor'));
    },
  }
});
