import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  username: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  //person: DS.belongsTo('company/person', { inverse: null }),
  full_name: Ember.computed('first_name' ,'last_name', function(){
    if (this.get('first_name')) {
      return `${this.get('last_name')} ${this.get('first_name')}`;
    } else {
      return `${this.get('username')}`
    }
  })
});
