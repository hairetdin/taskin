import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  project: DS.belongsTo('project'),
  //right: DS.attr('string'),
  right: DS.attr('member/choice'),
  taskexecutor_set: DS.hasMany('taskexecutor'),
});
