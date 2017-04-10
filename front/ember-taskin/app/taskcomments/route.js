import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('tasks/show').get('task_comments');
  },
});
