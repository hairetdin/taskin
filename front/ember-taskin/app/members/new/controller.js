import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  userValue: '',
  selectedUser: '',
  actions: {
    searchUser: function(value){
      this.set('selectedUser','');
      this.store.unloadAll('choiceuser');
      this.store.query('choiceuser', { full_name: value });
    },
    /*
    focusedMember: function(){
      //console.log('focusedCustomer');
      Ember.$('#btn-search').click();
      this.store.unloadAll('choiceuser');
    },
    handleFilterMember(){
      let filterInputValue = this.get('userValue');
			if(filterInputValue.length<2){
        this.store.unloadAll('choiceuser');
        //this.store.query('member', {project: this.model.project.id});
			} else {
        this.store.unloadAll('choiceuser');
        this.store.query('choiceuser', { full_name: filterInputValue });
        //this.store.query('member', {project: this.model.project.id});
			}
		},

    memberClick(full_name, user_id){
      let model = this.get('model');
      this.store.findRecord('user', user_id)
        .then(function(user){
          model.set('user', user);
        });
      this.set("userValue", full_name);
    },

    selectUser(user_id) {
      let user = this.store.peekRecord('user', user_id);
      this.set('model.user', user);
    },
    */

    selectRight(right_value) {
      this.set('model.right', right_value);
    },
  }
});
