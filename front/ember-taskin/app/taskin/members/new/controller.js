import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  userValue: '',
  actions: {
    focusedMember: function(){
      //console.log('focusedCustomer');
      Ember.$('#btn-search').click();
      this.store.unloadAll('taskin/choiceuser');
    },
    handleFilterMember(){
      let filterInputValue = this.get('userValue');
			if(filterInputValue.length<2){
        this.store.unloadAll('taskin/choiceuser');
        //this.store.query('taskin/member', {project: this.model.project.id});
			} else {
        this.store.unloadAll('taskin/choiceuser');
        this.store.query('taskin/choiceuser', { full_name: filterInputValue });
        //this.store.query('taskin/member', {project: this.model.project.id});
			}
		},

    memberClick(full_name, user_id){
      let model = this.get('model');
      this.store.findRecord('taskin/user', user_id)
        .then(function(user){
          model.set('user', user);
        });
      this.set("userValue", full_name);
    },

    selectUser(user_id) {
      let user = this.store.peekRecord('taskin/user', user_id);
      this.set('model.user', user);
    },

    selectRight(right_value) {
      this.set('model.right', right_value);
    },
  }
});
