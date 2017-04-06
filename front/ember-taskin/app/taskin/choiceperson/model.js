import DS from 'ember-data';


export default DS.Model.extend({
  user: DS.belongsTo('taskin/user'),
  name: DS.attr('string'),
  tasks_customer: DS.hasMany('taskin/task'),
  creator: DS.belongsTo('taskin/user'),
});
