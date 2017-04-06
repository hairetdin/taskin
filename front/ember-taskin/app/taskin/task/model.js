import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  subject: DS.attr('string'),
  date_created: DS.attr('date'),
  creator: DS.belongsTo('taskin/user'),
  customer: DS.belongsTo('taskin/choiceperson'),
  project: DS.belongsTo('taskin/project'),
  status: DS.belongsTo('taskin/taskstatus'),
  reason: DS.attr('string'),
  about: DS.attr('string'),
  date_exec_max: DS.attr('date'),
  date_closed: DS.attr('date'),
  executors: DS.hasMany('taskin/member'),
  taskexecutors: DS.hasMany('taskin/taskexecutor'),
  task_comments: DS.hasMany('taskin/taskcomment'),
  taskfiles: DS.hasMany('taskin/taskfile'),
  isOverdue: Ember.computed('date_exec_max', function(){
    if (this.get('date_exec_max')){
      if (Date.now() > this.get('date_exec_max')){
        return true;
      }
    }
    return false;
  })
});
