import DS from 'ember-data';

export default DS.Model.extend({
  task: DS.belongsTo('taskin/task'),
  creator: DS.belongsTo('taskin/user'),
  attachment: DS.attr(),
  name: DS.attr('string'),
  upload_date: DS.attr('date'),
  size: DS.attr('number')
});
