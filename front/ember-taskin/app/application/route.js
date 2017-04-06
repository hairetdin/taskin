import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  init(){
    this.get('session').authenticate('authenticator:django');
  }
});
