import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  username: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  person: DS.belongsTo('taskin/person', { inverse: null }),
  email: DS.attr('string'),
  is_superuser: DS.attr('boolean'),
  //for taskin app
  project_creator: DS.hasMany('taskin/project', {inverse: 'creator'}),
  projects_member: DS.hasMany('taskin/project', {inverse: 'members'}),
  projectmember_set: DS.hasMany('taskin/member'),
  task_creator: DS.hasMany('taskin/task', {inverse: 'creator'}),
  tasks_customer: DS.hasMany('taskin/task', {inverse: 'customer'}),
  taskfiles_creator: DS.hasMany('taskin/taskfile', {inverse: 'creator'}),
  full_name: Ember.computed('first_name' ,'last_name', function(){
    if (this.get('first_name')) {
      return `${this.get('last_name')} ${this.get('first_name')}`;
    } else {
      return `${this.get('username')}`;
    }
  }),
  person_name: Ember.computed('person.{name}', 'first_name', 'username', function(){
    if (this.get('person.name')){
      return this.get('person.name');
    } else if (this.get('first_name')){
      return (this.get('last_name') + ' ' + this.get('first_name'));
    } else {
      return this.get('username');
    }
  })
});
