import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  subject: DS.attr('string'),
  date_created: DS.attr('date'),
  creator: DS.belongsTo('user'),
  customer: DS.belongsTo('choiceperson'),
  project: DS.belongsTo('project'),
  status: DS.belongsTo('taskstatus'),
  reason: DS.attr('string'),
  about: DS.attr('string'),
  date_exec_max: DS.attr('date'),
  date_closed: DS.attr('date'),
  executors: DS.hasMany('member'),
  taskexecutors: DS.hasMany('taskexecutor'),
  task_comments: DS.hasMany('taskcomment'),
  taskfiles: DS.hasMany('taskfile'),
  isOverdue: Ember.computed('date_exec_max', function(){
    if (this.get('date_exec_max')){
      if (Date.now() > this.get('date_exec_max')){
        return true;
      }
    }
    return false;
  })
});
