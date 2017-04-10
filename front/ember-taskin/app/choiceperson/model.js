import DS from 'ember-data';


export default DS.Model.extend({
  user: DS.belongsTo('user'),
  name: DS.attr('string'),
  tasks_customer: DS.hasMany('task'),
  creator: DS.belongsTo('user'),
});
