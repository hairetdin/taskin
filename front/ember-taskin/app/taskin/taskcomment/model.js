import DS from 'ember-data';

export default DS.Model.extend({
  task: DS.belongsTo('taskin/task'),
  creator: DS.belongsTo('taskin/user'),
  text: DS.attr('string'),
  date_created: DS.attr('date'),
});
