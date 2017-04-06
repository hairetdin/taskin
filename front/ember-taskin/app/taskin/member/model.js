import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('taskin/user'),
  project: DS.belongsTo('taskin/project'),
  //right: DS.attr('string'),
  right: DS.attr('taskin/member/choice'),
  taskexecutor_set: DS.hasMany('taskin/taskexecutor'),
});
