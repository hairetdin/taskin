import Ember from 'ember';

export default Ember.Route.extend({

  model(/*params*/) {
    return this.modelFor('taskin/projects/show');
  },

  setupController: function(controller, model) {
    controller.set("model", model);
  },
});
