import Ember from 'ember';

export default Ember.Route.extend({

  model(/*params*/) {
    return this.modelFor('projects/show');
  },

  setupController: function(controller, model) {
    controller.set("model", model);
  },
});
