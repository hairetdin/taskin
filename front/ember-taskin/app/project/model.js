import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  date_created: DS.attr('date'),
  creator: DS.belongsTo('user'),
  //members: DS.hasMany('member'),
  members: DS.hasMany('user'),
  projectmember_set: DS.hasMany('member'),
  about: DS.attr('string'),
  task_statuses: DS.hasMany('taskstatus'),
  tasks: DS.hasMany('task'),
});
