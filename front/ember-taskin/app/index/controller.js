import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  
  currentTime: null,

  //task sorting by date_created
  sortProperties: ['date_created:desc'],
  //sortAscending: false, // false for descending
  sortedTasks: Ember.computed.sort('model.tasks', 'sortProperties'),

  //pagination
  queryParams: ['page'],
  page: 1,
});
