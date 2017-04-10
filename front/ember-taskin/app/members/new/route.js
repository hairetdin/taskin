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
      newMember.save().then(() =>{
        this.transitionTo('members', this.modelFor('projects/show'));
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
