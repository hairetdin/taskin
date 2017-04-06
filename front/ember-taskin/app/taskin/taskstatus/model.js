import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  project: DS.belongsTo('taskin/project'),
  order: DS.attr('number'),
  tasks: DS.hasMany('taskin/task'),
});
