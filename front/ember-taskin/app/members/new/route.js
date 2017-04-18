import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('member', {
      project: this.modelFor('projects/show')
    });
  },

  setupController: function(controller, model) {
    controller.set("model", model);
    controller.set('choiceUser',this.store.peekAll('choiceuser'));
    //controller.set('choicePeople',this.store.peekAll('choiceperson'));
  },

  actions: {
    addMember(newMember) {
      //console.log(newMember);
      let selectedUser = this.controller.get('selectedUser');
      let user_id = selectedUser.get('id')
      let model = this.controller.get('model');
      let _this = this;
      this.store.findRecord('user', user_id)
        .then(function(user){
          model.set('user', user);
          newMember.save().then(() =>{
            _this.transitionTo('members', _this.modelFor('projects/show'));
          });
        });
    },

    willTransition(/*transition*/) {

      let model = this.controller.get('model');
      this.controller.set("userValue", '');

      if (model.get('hasDirtyAttributes')) {
        model.rollbackAttributes();
      } else {
        return true;
      }
    },
  }
});
