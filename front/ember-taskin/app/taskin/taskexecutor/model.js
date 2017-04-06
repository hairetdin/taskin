import DS from 'ember-data';

export default DS.Model.extend({
  task: DS.belongsTo('taskin/task'),
  executor: DS.belongsTo('taskin/member'),
  date_accepted: DS.attr('date'),
  date_closed: DS.attr('date'),
});
