import DS from 'ember-data';

export default DS.Model.extend({
  task: DS.belongsTo('task'),
  executor: DS.belongsTo('member'),
  date_accepted: DS.attr('date'),
  date_closed: DS.attr('date'),
});
