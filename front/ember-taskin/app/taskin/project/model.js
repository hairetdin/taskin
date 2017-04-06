import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  date_created: DS.attr('date'),
  creator: DS.belongsTo('taskin/user'),
  //members: DS.hasMany('taskin/member'),
  members: DS.hasMany('taskin/user'),
  projectmember_set: DS.hasMany('taskin/member'),
  about: DS.attr('string'),
  task_statuses: DS.hasMany('taskin/taskstatus'),
  tasks: DS.hasMany('taskin/task'),
});
