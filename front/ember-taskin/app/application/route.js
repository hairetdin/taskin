import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin,{
  session: Ember.inject.service('session'),

  init(){
    //console.log('aplication init work');
    //this.get('session').authenticate('authenticator:django');
    if (!(this.get('session.isAuthenticated'))){
      this.get('session').authenticate('authenticator:django')
      .then(()=>{
        //console.log('aplication init auth success');
        this.refresh();
      }, (/*reject*/) => {
        //console.log('reject');
        //this.transitionTo('login');
        //window.location.replace("/taskin/api-auth/login/?next=/taskin/");
      })
    }

  },


  titleToken: 'Projects',
  /*
  beforeModel: function(){
    this.get('session').authenticate('authenticator:django')
    .then(()=>{

    }, (reject) => {
      //console.log('reject');
      this.refresh();
      //window.location.replace("/taskin/api-auth/login/?next=/taskin/");
    })
  },
  */

  model() {
    if (this.get('session.isAuthenticated')){
      return this.get('store').findAll('project');
    } else {
      return {}
    }
  },

  setupController: function(controller, model) {
    console.log(this.get('session.isAuthenticated'));
    if (this.get('session.isAuthenticated')){
      controller.set("model", model);
      let sessionProjectName = this.get('session.data.project.name');
      //console.log(this.get('session.data.project.id'));
      let session = this.get('session');
      this.store.query('project', {'name':sessionProjectName}).then(
        function(currentProject){
          if (currentProject.get('length') == 0){
            session.set('data.project',{});
          }
        }
      );
    }
  },
});
