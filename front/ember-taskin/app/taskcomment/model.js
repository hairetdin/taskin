import DS from 'ember-data';

export default DS.Model.extend({
  task: DS.belongsTo('task'),
  creator: DS.belongsTo('user'),
  text: DS.attr('string'),
  date_created: DS.attr('date'),
});
