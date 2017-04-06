import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('taskin/project', params.project_id);
  }
});
