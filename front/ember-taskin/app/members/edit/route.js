import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('member', params.member_id);
  },

  setupController: function(controller, model) {
    controller.set("model", model);
    controller.set('choiceUser',this.store.peekAll('choiceuser'));
    //controller.set('choicePeople',this.store.peekAll('choiceperson'));
  },

  actions: {
    cancel() {
      this.transitionTo('company.employees');
    },

    saveMember(editMember) {
      //console.log(newMember);
      editMember.save().then(() =>{
        this.transitionTo('members', this.modelFor('projects/show'));
      });
    },

    willTransition(/*transition*/) {

      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        model.rollbackAttributes();
      } else {
        return true;
      }
    },
  }
});
