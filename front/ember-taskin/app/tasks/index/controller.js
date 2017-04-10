import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page'],
  page: 1,

  //task sorting by date_created
  sortProperties: ['date_created:desc'],
  //sortAscending: false, // false for descending
  sortedTasks: Ember.computed.sort('model.tasks', 'sortProperties'),
});
