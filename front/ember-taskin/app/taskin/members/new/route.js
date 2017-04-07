import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('taskin/member', {
      project: this.modelFor('taskin/projects/show')
    });
  },

  setupController: function(controller, model) {
    controller.set("model", model);
    controller.set('choiceUser',this.store.peekAll('taskin/choiceuser'));
    //controller.set('choicePeople',this.store.peekAll('taskin/choiceperson'));
  },

  actions: {
    addMember(newMember) {
      //console.log(newMember);
      newMember.save().then(() =>{
        this.transitionTo('taskin.members', this.modelFor('taskin/projects/show'));
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
